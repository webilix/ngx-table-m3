import { Component, OnInit } from '@angular/core';

import { Helper } from '@webilix/helper-library';
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

                filter: {
                    id: 'type',
                    order: { type: 'DESC' },
                },
            },
            {
                type: 'TEXT',
                title: 'نام',
                value: 'name',
                onCopy: (data) => data.name,
                mode: 'TITLE',
                color: (data) => DataInfo[data.type].iconColor,

                filter: {
                    id: 'name',
                    order: { isDefault: true },
                },
            },
            {
                type: 'MOBILE',
                value: 'mobile',
                english: true,
                onClick: (data) => () => alert(`MOBILE: ${data.mobile}`),
            },
            {
                type: 'DATE',
                title: 'تاریخ تولد',
                value: 'birthDay',

                filter: {
                    id: 'birthDay',
                    order: { initial: 'DESC' },
                },
            },
            {
                type: 'TEXT',
                title: 'استان',
                value: (data) => data.birthPlace?.state.title,

                filter: {
                    id: 'state',
                    order: { type: 'ASC' },
                },
            },
            { type: 'TEXT', title: 'شهر', value: (data) => data.birthPlace?.city.title },
            {
                type: 'TEXT',
                title: 'وضعیت',
                value: (data) => (data.status === 'ACTIVE' ? 'فعال' : 'غیرفعال'),
                textAlign: 'LEFT',
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
            .map(() => ({
                type: dataTypes[Math.floor(Math.random() * dataTypes.length)],
                name: namesList[Math.floor(Math.random() * namesList.length)],
                mobile: `09${Helper.STRING.getRandom(9, 'numeric')}`,
                birthDay: Math.random() > 0.3 ? getBirthDay() : undefined,
                birthPlace: Math.random() > 0.1 ? getCity() : undefined,
                status: statusList[Math.floor(Math.random() * statusList.length)],
            }));
    }

    filterChanged(filter: INgxTableFilter): void {
        setTimeout(
            () => {
                this.loading = false;
                this.setPagination(filter);
                this.setOrder(filter);
                this.setData();
            },
            this.pagination ? 0 : 500,
        );
    }

    setPagination(filter: INgxTableFilter): void {
        const total: number = this.list.length;
        const item: number = 25;
        const pages: number = Math.ceil(total / item);

        let page: number = filter.page;
        if (page < 1) page = 1;
        else if (page > pages) page = pages;

        this.pagination = {
            total,
            item,
            page: { current: page, total: pages },
        };
    }

    setOrder(filter: INgxTableFilter): void {
        if (!filter.order) return;

        switch (filter.order.id) {
            case 'type':
                this.list = this.list.sort(
                    (d1, d2) => DataInfo[d1.type].order - DataInfo[d2.type].order || d1.name.localeCompare(d2.name),
                );
                break;
            case 'name':
                switch (filter.order.type) {
                    case 'ASC':
                        this.list = this.list.sort((d1, d2) => d1.name.localeCompare(d2.name));
                        break;
                    case 'DESC':
                        this.list = this.list.sort((d1, d2) => d2.name.localeCompare(d1.name));
                        break;
                }
                break;
            case 'birthDay':
                switch (filter.order.type) {
                    case 'ASC':
                        this.list = this.list.sort(
                            (d1, d2) => (d1.birthDay?.getTime() || 0) - (d2.birthDay?.getTime() || 0),
                        );
                        break;
                    case 'DESC':
                        this.list = this.list.sort(
                            (d1, d2) => (d2.birthDay?.getTime() || 0) - (d1.birthDay?.getTime() || 0),
                        );
                        break;
                }
                break;
            case 'state':
                this.list = this.list.sort(
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

        const skip: number = (this.pagination.page.current - 1) * this.pagination.item;
        this.data = this.list.slice(skip, skip + this.pagination.item);
    }
}
