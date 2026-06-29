import { Component, inject, OnInit, ChangeDetectionStrategy, WritableSignal, signal } from '@angular/core';
import { timer } from 'rxjs';

import { INgxHelperPageGroupItem, NGX_HELPER_PAGE_GROUP_ITEM } from '@webilix/ngx-helper-m3';
import { INgxTable, INgxTableFilter, INgxTablePagination, NgxTableComponent } from '@webilix/ngx-table-m3';

import { DataService, IData } from '../../data.service';

@Component({
    host: { selector: 'index-content' },
    imports: [NgxTableComponent],
    templateUrl: './page-index-content.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './page-index-content.component.scss',
})
export class PageIndexContentComponent implements OnInit {
    public page: INgxHelperPageGroupItem = inject(NGX_HELPER_PAGE_GROUP_ITEM);

    public ngxTable!: INgxTable<IData>;

    public loading: WritableSignal<boolean> = signal(true);
    public data: WritableSignal<IData[]> = signal([]);
    public pagination: WritableSignal<INgxTablePagination | null> = signal(null);

    private list: WritableSignal<IData[]> = signal([]);
    private filtered: WritableSignal<IData[]> = signal([]);

    constructor(private readonly dataService: DataService) {}

    ngOnInit(): void {
        this.ngxTable = this.dataService.getTable(
            ['/'],
            this.page.id === 'user'
                ? ['TYPE', 'NAME', 'MOBILE', 'STATUS']
                : this.page.id === 'birth'
                  ? ['NAME', 'BIRTH-DAY', 'AGE-YEAR', 'AGE-DAY', 'STATE', 'CITY']
                  : this.page.id === 'others'
                    ? ['NAME', 'PERIOD', 'FILE-SIZE', 'WEIGHT', 'TAG']
                    : [],
        );
        this.list.update(() => this.dataService.getData());
    }

    filterChanged(filter: INgxTableFilter): void {
        console.log(filter);
        const update = (): void => {
            this.loading.update(() => false);
            this.filtered.update(() => this.dataService.filtereData(this.list(), filter));
            this.pagination.update(() => this.dataService.getPagination(this.filtered().length, filter.page));
            this.filtered.update(() => this.dataService.orderList(this.filtered(), filter));
            this.setData();
        };

        if (this.pagination()) update();
        else timer(500).subscribe(() => update());
    }

    setData(): void {
        const pagination = this.pagination();
        if (!pagination) return;

        const skip: number = (pagination.page.current - 1) * pagination.item.perPage;
        this.data.update(() => this.filtered().slice(skip, skip + pagination.item.perPage));
    }
}
