import { Component, OnInit } from '@angular/core';

import { INgxTable, INgxTableFilter, INgxTablePagination, NgxTableComponent } from '@webilix/ngx-table-m3';

import { AppService } from '../../app.service';

import { DataService, IData } from '../data.service';

@Component({
    host: { selector: 'page-index' },
    imports: [NgxTableComponent],
    templateUrl: './page-index.component.html',
    styleUrl: './page-index.component.scss',
})
export class PageIndexComponent implements OnInit {
    public ngxTable!: INgxTable<IData>;

    public loading: boolean = true;
    public data: IData[] = [];
    public pagination?: INgxTablePagination;

    private list: IData[] = [];
    private filtered: IData[] = [];

    constructor(private readonly appService: AppService, private readonly dataService: DataService) {}

    ngOnInit(): void {
        this.ngxTable = this.dataService.getTable(
            ['/'],
            ['TYPE', 'NAME', 'MOBILE', 'BIRTH-DAY', 'AGE-YEAR', 'AGE-DAY', 'PERIOD', 'STATE', 'CITY', 'FILE-SIZE', 'STATUS'],
        );
        this.list = this.dataService.getData();

        this.appService.setPage('INDEX');
    }

    filterChanged(filter: INgxTableFilter): void {
        console.clear();
        console.log('ORDER', filter.order?.param);
        Object.keys(filter.filter).forEach((id: string) => console.log(`FILTER ${id}: ${filter.filter[id].param}`));

        const update = (): void => {
            this.loading = false;
            this.filtered = this.dataService.filtereData(this.list, filter);
            this.pagination = this.dataService.getPagination(this.filtered.length, filter.page);
            this.filtered = this.dataService.orderList(this.filtered, filter);
            this.setData();
        };

        if (this.pagination) update();
        else setTimeout(() => update(), 500);
    }

    setData(): void {
        if (!this.pagination) return;

        const skip: number = (this.pagination.page.current - 1) * this.pagination.item.perPage;
        this.data = this.filtered.slice(skip, skip + this.pagination.item.perPage);
    }
}
