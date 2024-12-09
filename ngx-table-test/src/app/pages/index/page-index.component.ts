import { Component } from '@angular/core';

import { Helper } from '@webilix/helper-library';
import { INgxTable, INgxTableFilter, INgxTablePagination, NgxTableComponent } from '@webilix/ngx-table-m3';

import { namesList } from './page-index.names';

type DataType = 'MANAGER' | 'ADMIN' | 'USER';
const DataInfo: { [key in DataType]: { title: string; icon: string; textColor: string; iconColor: string } } = {
    MANAGER: { title: 'مدیر اصلی', icon: 'badge', textColor: 'var(--error)', iconColor: 'var(--error)' },
    ADMIN: { title: 'مدیر', icon: 'account_box', textColor: 'var(--secondary)', iconColor: 'var(--secondary)' },
    USER: { title: 'عضو', icon: 'account_circle', textColor: '', iconColor: '' },
};

interface IData {
    readonly type: DataType;
    readonly name: string;
    readonly mobile: string;
    readonly birthDay?: Date;
    readonly birthPlace?: { readonly state: string; readonly city: string };
    readonly status: 'ACTIVE' | 'DEACTIVE';
}

@Component({
    host: { selector: 'page-index' },
    imports: [NgxTableComponent],
    templateUrl: './page-index.component.html',
    styleUrl: './page-index.component.scss',
})
export class PageIndexComponent {
    public ngxTable: INgxTable<IData> = {
        type: 'عضو',
        columns: [
            {
                type: 'TEXT',
                title: 'عضویت',
                value: (data) => DataInfo[data.type].title,
                subValue: (data) => ({ value: data.type, english: true }),
            },
            {
                type: 'TEXT',
                title: 'نام',
                value: 'name',
                onCopy: (data) => data.name,
                mode: 'TITLE',
                color: (data) => DataInfo[data.type].iconColor,
            },
            {
                type: 'MOBILE',
                value: 'mobile',
                english: true,
                onClick: (data) => () => alert(`MOBILE: ${data.mobile}`),
            },
            { type: 'DATE', title: 'تاریخ تولد', value: 'birthDay' },
            { type: 'TEXT', title: 'استان', value: (data) => data.birthPlace?.state },
            { type: 'TEXT', title: 'شهر', value: (data) => data.birthPlace?.city },
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
            { type: 'UPDATE', action: (data) => console.log('UPDATE DATA', data) },
            { type: 'DELETE', action: (data) => console.log('DELETE DATA', data) },
            'DIVIDER',
            'DIVIDER',
            {
                type: 'LOG',
                action: (data) => console.log('VIEW DATA LOG', data),
                disableOn: (data) => data.status === 'DEACTIVE',
            },
            'DIVIDER',
            'DIVIDER',
            'DIVIDER',
        ],
    };

    public loading: boolean = true;
    public data: IData[] = [];
    public pagination?: INgxTablePagination;

    filterChanged(filter: INgxTableFilter): void {
        setTimeout(() => {
            this.loading = false;
            this.setPagination(filter.page);
            this.createData();
        }, 500);
    }

    setPagination(page: number): void {
        const pages: number = 120;
        const item: number = 25;
        const extra: number = 13;

        this.pagination = {
            total: pages * item + extra,
            item,
            page: { current: page, total: pages + 1 },
        };
    }

    createData(): void {
        if (!this.pagination) return;

        const cities = Helper.STATE.cities;
        const getCity = (): { state: string; city: string } => {
            const city = cities[Math.floor(Math.random() * cities.length)];
            return { state: city.state.title, city: city.title };
        };

        const getBirthDay = (): Date =>
            new Date(new Date().getTime() - Math.floor(Math.random() * (365 * 30) + 365 * 18) * 24 * 3600 * 1000);

        const dataTypes: DataType[] = ['MANAGER', ...Array(5).fill('ADMIN'), ...Array(24).fill('USER')];
        const statusList: ('ACTIVE' | 'DEACTIVE')[] = [...Array(5).fill('ACTIVE'), 'DEACTIVE'];

        const lastPage: boolean = this.pagination.page.current === this.pagination.page.total;
        const length: number = lastPage ? this.pagination.total % this.pagination.item : this.pagination.item;
        this.data = Array(length)
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
}
