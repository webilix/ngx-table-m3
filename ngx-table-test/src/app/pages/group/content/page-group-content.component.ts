import { Component, inject, OnInit } from '@angular/core';

import { INgxHelperPageGroupItem, NGX_HELPER_PAGE_GROUP_ITEM } from '@webilix/ngx-helper-m3';
import { INgxTable, INgxTableFilter, INgxTablePagination, NgxTableComponent } from '@webilix/ngx-table-m3';

import { AppService } from '../../../app.service';

import { DataService, IData } from '../../data.service';

@Component({
    host: { selector: 'page-group-content' },
    imports: [NgxTableComponent],
    templateUrl: './page-group-content.component.html',
    styleUrl: './page-group-content.component.scss',
})
export class PageGroupContentComponent implements OnInit {
    public page: INgxHelperPageGroupItem = inject(NGX_HELPER_PAGE_GROUP_ITEM);

    public ngxTable!: INgxTable<IData>;

    public loading: boolean = true;
    public data: IData[] = [];
    public pagination?: INgxTablePagination;

    private list: IData[] = [];
    private filtered: IData[] = [];

    constructor(private readonly appService: AppService, private readonly dataService: DataService) {}

    ngOnInit(): void {
        this.ngxTable = this.dataService.getTable(
            ['/group'],
            this.page.id === 'info'
                ? ['TYPE', 'NAME', 'MOBILE', 'STATUS']
                : this.page.id === 'birth'
                ? ['NAME', 'BIRTH-DAY', 'AGE-YEAR', 'AGE-DAY', 'STATE', 'CITY']
                : [],
        );
        this.list = this.dataService.getData();
    }

    filterChanged(filter: INgxTableFilter): void {
        console.log(filter);
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
