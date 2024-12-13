import { Component, OnInit } from '@angular/core';

import { Helper } from '@webilix/helper-library';
import { JalaliDateTime } from '@webilix/jalali-date-time';
import { INgxTable, INgxTableFilter, INgxTablePagination, NgxTableComponent } from '@webilix/ngx-table-m3';

import { namesList } from './page-index.names';

type DataType = 'MANAGER' | 'ADMIN' | 'USER';
const DataInfo: { [key in DataType]: { title: string; icon: string; order: number; textColor: string; iconColor: string } } =
    {
        MANAGER: { title: 'مدیر اصلی', icon: 'badge', order: 1, textColor: 'var(--error)', iconColor: 'var(--error)' },
        ADMIN: { title: 'مدیر', icon: 'account_box', order: 2, textColor: '', iconColor: 'var(--secondary)' },
        USER: { title: 'عضو', icon: 'account_circle', order: 3, textColor: '', iconColor: '' },
    };

interface IData {
    readonly type: DataType;
    readonly name: string;
    readonly mobile: string;
    readonly birthDay?: Date;
    readonly ageYear?: number;
    readonly ageDay?: any;
    readonly birthPlace?: {
        readonly state: { readonly id: string; readonly title: string };
        readonly city: { readonly id: string; readonly title: string };
    };
    readonly status: 'ACTIVE' | 'DEACTIVE';
}

@Component({
    host: { selector: 'page-index' },
    imports: [NgxTableComponent],
    templateUrl: './page-index.component.html',
    styleUrl: './page-index.component.scss',
})
export class PageIndexComponent implements OnInit {
    public ngxTable: INgxTable<IData> = {
        route: ['/'],
        type: 'عضو',
        columns: [
            {
                type: 'TEXT',
                title: 'عضویت',
                value: (data) => DataInfo[data.type].title,
                subValue: (data) => ({ value: data.type, english: true }),

                tools: {
                    id: 'type',
                    order: { type: 'DESC' },
                    filter: {
                        type: 'SELECT',
                        options: [
                            { id: 'MANAGER', title: DataInfo['MANAGER'].title },
                            { id: 'ADMIN', title: DataInfo['ADMIN'].title },
                            { id: 'USER', title: DataInfo['USER'].title },
                        ],
                    },
                },
            },
            {
                type: 'TEXT',
                title: 'نام',
                value: 'name',
                onCopy: (data) => data.name,
                mode: 'TITLE',
                color: (data) => DataInfo[data.type].iconColor,

                tools: {
                    id: 'name',
                    order: { isDefault: true },
                    filter: { type: 'SEARCH' },
                },
            },
            {
                type: 'MOBILE',
                value: 'mobile',
                english: true,
                onClick: (data) => () => alert(`MOBILE: ${data.mobile}`),

                tools: {
                    id: 'mobile',
                    filter: { type: 'SEARCH', english: true, mode: 'FULL' },
                },
            },
            {
                type: 'DATE',
                title: 'تاریخ تولد',
                value: 'birthDay',

                tools: {
                    id: 'birthDay',
                    order: { initial: 'DESC' },
                    filter: { type: 'DATE' },
                },
            },
            { type: 'NUMBER', title: 'سن (سال)', value: 'ageYear', fractionDigits: 5 },
            { type: 'DURATION', title: 'سن (روز)', value: 'ageDay', format: 'DAY' },
            {
                type: 'TEXT',
                title: 'استان',
                value: (data) => data.birthPlace?.state.title,

                tools: {
                    id: 'state',
                    order: { type: 'ASC' },
                    filter: {
                        type: 'MULTI-SELECT',
                        options: Helper.STATE.states.map((state) => ({ id: state.id, title: state.title })),
                    },
                },
            },
            { type: 'TEXT', title: 'شهر', value: (data) => data.birthPlace?.city.title },
            {
                type: 'TEXT',
                title: 'وضعیت',
                value: (data) => (data.status === 'ACTIVE' ? 'فعال' : 'غیرفعال'),
                textAlign: 'LEFT',
                mode: 'SUBTITLE',

                tools: {
                    id: 'status',
                    filter: {
                        type: 'SELECT',
                        options: [
                            { id: 'ACTIVE', title: 'فعال' },
                            { id: 'DEACTIVE', title: 'غیرفعال' },
                        ],
                    },
                },
            },
        ],
        rows: {
            icon: (data) => ({ icon: DataInfo[data.type].icon, color: DataInfo[data.type].iconColor }),
            color: (data) => DataInfo[data.type].textColor,
            isDeactive: (data) => data.status === 'DEACTIVE',
        },
        actions: [
            'DIVIDER',
            {
                type: 'ACTION',
                title: 'مشاهده',
                icon: 'perm_contact_calendar',
                action: (data) => console.log('VIEW DATA', data),
                standalone: true,
                disableOn: (data) => data.status === 'DEACTIVE',
            },
            'DIVIDER',
            'DIVIDER',
            {
                type: 'STATUS',
                action: (data, active) => console.log('STATUS DATA', data, active),
                isDeactive: (data) => data.status === 'DEACTIVE',
            },
            {
                type: 'UPDATE',
                action: (data) => console.log('UPDATE DATA', data),
                disableOn: (data) => data.status === 'DEACTIVE',
            },
            { type: 'DELETE', action: (data) => console.log('DELETE DATA', data) },
            'DIVIDER',
            'DIVIDER',
            { type: 'LOG', action: (data) => console.log('VIEW DATA LOG', data) },
            'DIVIDER',
            'DIVIDER',
            'DIVIDER',
        ],
    };

    private list: IData[] = [];
    private filtered: IData[] = [];
    private jalali = JalaliDateTime();

    public loading: boolean = true;
    public data: IData[] = [];
    public pagination?: INgxTablePagination;

    ngOnInit(): void {
        const cities = Helper.STATE.cities;
        const getCity = (): { state: { id: string; title: string }; city: { id: string; title: string } } => {
            const city = cities[Math.floor(Math.random() * cities.length)];
            return { state: city.state, city: { id: city.id, title: city.title } };
        };

        const getBirthDay = (): Date =>
            new Date(new Date().getTime() - Math.floor(Math.random() * (365 * 30) + 365 * 18) * 24 * 3600 * 1000);

        const dataTypes: DataType[] = ['MANAGER', ...Array(5).fill('ADMIN'), ...Array(24).fill('USER')];
        const statusList: ('ACTIVE' | 'DEACTIVE')[] = [...Array(5).fill('ACTIVE'), 'DEACTIVE'];

        this.list = Array(Math.floor(Math.random() * 5000))
            .fill('')
            .map(() => {
                const birthDay: Date | undefined = Math.random() > 0.3 ? getBirthDay() : undefined;
                const ageYear: number | undefined = birthDay
                    ? Math.floor((new Date().getTime() - birthDay.getTime()) / (365 * 24 * 3600 * 1000))
                    : undefined;
                const actualAge: number | undefined = 100;

                return {
                    type: dataTypes[Math.floor(Math.random() * dataTypes.length)],
                    name: namesList[Math.floor(Math.random() * namesList.length)],
                    mobile: `09${Helper.STRING.getRandom(9, 'numeric')}`,
                    birthDay,
                    ageYear,
                    ageDay: { from: birthDay },
                    birthPlace: Math.random() > 0.1 ? getCity() : undefined,
                    status: statusList[Math.floor(Math.random() * statusList.length)],
                };
            });
    }

    filterChanged(filter: INgxTableFilter): void {
        console.clear();
        console.log('ORDER', filter.order?.param);
        Object.keys(filter.filter).forEach((id: string) => console.log(`FILTER ${id}: ${filter.filter[id].param}`));

        const update = (): void => {
            this.loading = false;
            this.setFiltered(filter);
            this.setPagination(filter);
            this.setOrder(filter);
            this.setData();
        };

        if (this.pagination) update();
        else setTimeout(() => update(), 500);
    }

    setFiltered(filter: INgxTableFilter): void {
        this.filtered = this.list.filter((data) => {
            // TYPE
            if (filter.filter['type']) {
                if (data.type !== filter.filter['type'].value) return false;
            }

            // NAME
            if (filter.filter['name']) {
                const words: string[] = filter.filter['name'].value.query.split(' ').filter((word: string) => word !== '');
                switch (filter.filter['name'].value.mode) {
                    case 'FULL':
                        if (data.name.indexOf(words.join(' ')) === -1) return false;
                        break;
                    case 'ALL':
                        const all: boolean[] = words.map((word) => data.name.indexOf(word) !== -1);
                        if (all.includes(false)) return false;
                        break;
                    case 'EACH':
                        const each: boolean[] = words.map((word) => data.name.indexOf(word) !== -1);
                        if (!each.includes(true)) return false;
                        break;
                }
            }

            // MOBILE
            if (filter.filter['mobile']) {
                if (data.mobile.indexOf(filter.filter['mobile'].value.query) === -1) return false;
            }

            // BIRTH DAY
            if (filter.filter['birthDay']) {
                if (!data.birthDay) return false;

                const birthDay: number = data.birthDay.getTime();
                const { from, to } = this.jalali.periodDay(1, filter.filter['birthDay'].value);
                if (birthDay < from.getTime() || birthDay > to.getTime()) return false;
            }

            // STATE
            if (filter.filter['state']) {
                if (!data.birthPlace) return false;

                const states: string[] = filter.filter['state'].value;
                if (!states.includes(data.birthPlace.state.id)) return false;
            }

            // STATUS
            if (filter.filter['status']) {
                if (data.status !== filter.filter['status'].value) return false;
            }

            return true;
        });
    }

    setPagination(filter: INgxTableFilter): void {
        const total: number = this.filtered.length;
        const perPage: number = 25;
        const pages: number = Math.ceil(total / perPage);

        let page: number = filter.page;
        if (page < 1) page = 1;
        else if (page > pages) page = pages;

        this.pagination = {
            item: { perPage, total },
            page: { current: page, total: pages },
        };
    }

    setOrder(filter: INgxTableFilter): void {
        if (!filter.order) return;

        switch (filter.order.id) {
            case 'type':
                this.filtered = this.filtered.sort(
                    (d1, d2) => DataInfo[d1.type].order - DataInfo[d2.type].order || d1.name.localeCompare(d2.name),
                );
                break;
            case 'name':
                switch (filter.order.type) {
                    case 'ASC':
                        this.filtered = this.filtered.sort((d1, d2) => d1.name.localeCompare(d2.name));
                        break;
                    case 'DESC':
                        this.filtered = this.filtered.sort((d1, d2) => d2.name.localeCompare(d1.name));
                        break;
                }
                break;
            case 'birthDay':
                switch (filter.order.type) {
                    case 'ASC':
                        this.filtered = this.filtered.sort(
                            (d1, d2) => (d1.birthDay?.getTime() || 0) - (d2.birthDay?.getTime() || 0),
                        );
                        break;
                    case 'DESC':
                        this.filtered = this.filtered.sort(
                            (d1, d2) => (d2.birthDay?.getTime() || 0) - (d1.birthDay?.getTime() || 0),
                        );
                        break;
                }
                break;
            case 'state':
                this.filtered = this.filtered.sort(
                    (d1, d2) =>
                        (d1.birthPlace?.state.title || '').localeCompare(d2.birthPlace?.state.title || '') ||
                        (d1.birthPlace?.city.title || '').localeCompare(d2.birthPlace?.city.title || '') ||
                        d1.name.localeCompare(d2.name),
                );
                break;
        }
    }

    setData(): void {
        if (!this.pagination) return;

        const skip: number = (this.pagination.page.current - 1) * this.pagination.item.perPage;
        this.data = this.filtered.slice(skip, skip + this.pagination.item.perPage);
    }
}
