import { Component } from '@angular/core';

import { Helper } from '@webilix/helper-library';
import { INgxTable, INgxTableFilter, INgxTablePagination, NgxTableComponent } from '@webilix/ngx-table-m3';

import { namesList } from './page-index.names';

type DataType = 'MANAGER' | 'ADMIN' | 'USER';
const DataInfo: { [key in DataType]: { title: string; icon: string } } = {
    MANAGER: { title: 'مدیر اصلی', icon: 'badge' },
    ADMIN: { title: 'مدیر', icon: 'account_box' },
    USER: { title: 'عضو', icon: 'account_circle' },
};

interface IData {
    readonly type: DataType;
    readonly name: string;
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
                type: 'STRING',
                title: 'عضویت',
                value: (data) => DataInfo[data.type].title,
                subValue: (data) => ({ value: data.type, english: true }),
            },
            { type: 'STRING', title: 'نام', value: 'name' },
            { type: 'DATE', title: 'تاریخ تولد', value: 'birthDay', format: 'FULL' },
            {
                title: 'محل تولد',
                columns: [
                    { type: 'STRING', title: 'استان', value: (data) => data.birthPlace?.state },
                    { type: 'STRING', title: 'شهر', value: (data) => data.birthPlace?.city },
                ],
            },
            { type: 'STRING', title: 'وضعیت', value: (data) => (data.status === 'ACTIVE' ? 'فعال' : 'غیرفعال') },
        ],
        actions: [
            { type: 'ACTION', title: 'مشاهده', icon: '', action: (data) => console.log('VIEW DATA', data) },
            'DIVIDER',
            {
                type: 'STATUS',
                action: (data) => console.log('STATUS DATA', data),
                isActive: (data) => data.status === 'ACTIVE',
            },
            { type: 'UPDATE', action: (data) => console.log('UPDATE DATA', data) },
            { type: 'DELETE', action: (data) => console.log('DELETE DATA', data) },
            'DIVIDER',
            { type: 'LOG', action: (data) => console.log('VIEW DATA LOG', data) },
        ],
        row: { icon: (data) => DataInfo[data.type].icon, isDeactive: (data) => data.status === 'DEACTIVE' },
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
                birthDay: Math.random() > 0.3 ? getBirthDay() : undefined,
                birthPlace: Math.random() > 0.1 ? getCity() : undefined,
                status: statusList[Math.floor(Math.random() * statusList.length)],
            }));
    }
}
