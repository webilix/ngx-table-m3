import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Optional, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Helper } from '@webilix/helper-library';
import { NgxHelperLoaderComponent } from '@webilix/ngx-helper-m3';

import {
    IViewConfig,
    IViewFilter,
    IViewOrder,
    ViewCardComponent,
    ViewPaginationComponent,
    ViewTableComponent,
} from './views';

import { ColumnInfo } from './columns';
import { FilterInfo } from './filters/filter.info';
import { FilterService } from './filters/filter.service';
import { ViewService } from './views/view.service';
import { INgxTableConfig, NGX_TABLE_CONFIG } from './ngx-table.config';
import { INgxTable, INgxTableFilter, INgxTablePagination } from './ngx-table.interface';

@Component({
    selector: 'ngx-table',
    host: { '(window:resize)': 'onResize()' },
    imports: [NgxHelperLoaderComponent, ViewCardComponent, ViewPaginationComponent, ViewTableComponent],
    providers: [FilterService, ViewService],
    templateUrl: './ngx-table.component.html',
    styleUrl: './ngx-table.component.scss',
})
export class NgxTableComponent<T> implements OnInit, OnChanges {
    @Input({ required: true }) loading!: boolean;
    @Input({ required: true }) ngxTable!: INgxTable<T>;
    @Input({ required: true }) data!: T[];
    @Input({ required: false }) pagination?: INgxTablePagination | null;
    @Output() filterChanged: EventEmitter<INgxTableFilter> = new EventEmitter<INgxTableFilter>();

    public isMobile: boolean = false;
    public viewConfig!: IViewConfig;

    private filter!: INgxTableFilter;
    public hasFilter: boolean = false;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly filterService: FilterService,
        private readonly viewService: ViewService,
        @Optional() @Inject(NGX_TABLE_CONFIG) private readonly config?: Partial<INgxTableConfig>,
    ) {}

    ngOnInit(): void {
        const queryParams: { [key: string]: any } = { ...this.activatedRoute.snapshot.queryParams };
        const page: number = !!this.ngxTable.route
            ? Helper.IS.number(+queryParams['ngx-table-page'])
                ? +queryParams['ngx-table-page']
                : 1
            : 1;

        const orders = this.viewService.getOrders(this.ngxTable);
        let order: { id: string; type: 'ASC' | 'DESC'; param: string } | undefined = undefined;
        Object.keys(orders).forEach((id: string) => {
            if (!orders[id].current) return;

            const type = orders[id].current;
            order = { id, type: type, param: `${id}:${type}` };
        });

        const filters = this.filterService.getFilters(this.ngxTable);
        const filter: { [id: string]: { value: any; param: string } } = {};
        Object.keys(filters).forEach((id: string) => {
            if (filters[id].value === undefined) return;

            const column = this.ngxTable.columns.find((column) => column.tools?.id === id);
            if (!column || !column.tools || !('filter' in column.tools) || !column.tools.filter) return;

            const param: string =
                column.tools.filter.toParam?.(filters[id].value) ||
                FilterInfo[column.tools.filter.type].methods.toParam(filters[id].value);

            filter[id] = { value: filters[id].value, param };
        });

        this.filter = { page, order, filter };
        this.filterChanged.next(this.filter);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.ngxTable = {
            ...this.ngxTable,
            columns: this.ngxTable.columns.map((column) => ColumnInfo[column.type].methods.column(column)),
        };

        const getStickyView = (
            config: string | { desktopView: string; mobileView: string },
        ): { desktopView: string; mobileView: string } => {
            return {
                desktopView: typeof config === 'string' ? config : config.desktopView,
                mobileView: typeof config === 'string' ? config : config.mobileView,
            };
        };

        this.viewConfig = {
            alternateRows: !!this.config?.alternateRows,
            iconSize: `${this.config?.iconSize || 24}px`,
            emojiSize: `${this.config?.emojiSize || 19}px`,
            actionMenuTitle: this.config?.actionMenuTitle || 'امکانات',
            minimalCardView: !!this.config?.minimalCardView,
            stickyView: this.config?.stickyView
                ? {
                      top: this.config.stickyView.top ? getStickyView(this.config.stickyView.top) : undefined,
                      bottom: this.config.stickyView.bottom ? getStickyView(this.config.stickyView.bottom) : undefined,
                  }
                : undefined,
        };

        this.hasFilter = this.filter && Object.keys(this.filter).length !== 0;
        this.onResize();
    }

    onResize(): void {
        const mobileWidth: number = this.config?.mobileWidth || 600;
        this.isMobile = this.ngxTable.mobileView || window.innerWidth <= mobileWidth;
    }

    setQueryParams(): void {
        if (!this.ngxTable.route) return;

        const queryParams: { [key: string]: any } = { ...this.activatedRoute.snapshot.queryParams };
        const keys: string[] = Object.keys(queryParams);
        keys.forEach((id: string) => id.substring(0, 17) === 'ngx-table-filter-' && delete queryParams[id]);

        queryParams['ngx-table-page'] = this.filter.page !== 1 ? this.filter.page.toString() : undefined;
        queryParams['ngx-table-order'] = this.filter.order ? this.filter.order.param : undefined;
        Object.keys(this.filter.filter).forEach((id: string) => {
            const column = this.ngxTable.columns.find((column) => column.tools?.id === id);
            if (!column || !column.tools || !('filter' in column.tools) || !column.tools.filter) return;

            const param: string = FilterInfo[column.tools.filter.type].methods.query(this.filter.filter[id].value);
            queryParams[`ngx-table-filter-${id}`] = param;
        });
        this.router.navigate(this.ngxTable.route, { queryParams });
    }

    pageChanged(page: number): void {
        this.filter = { ...this.filter, page };

        this.setQueryParams();
        this.filterChanged.next(this.filter);
    }

    orderChanged(order: IViewOrder): void {
        const param: string = `${order.id}:${order.type}`;
        this.filter = { ...this.filter, order: { ...order, param } };

        this.setQueryParams();
        this.filterChanged.next(this.filter);
    }

    filterItemChanged(filter: IViewFilter): void {
        const column = this.ngxTable.columns.find((column) => column.tools?.id === filter.id);
        if (!column || !column.tools || !('filter' in column.tools) || !column.tools.filter) return;

        if (filter.value === undefined) delete this.filter.filter[filter.id];
        else {
            const param: string =
                column.tools.filter.toParam?.(filter.value) ||
                FilterInfo[column.tools.filter.type].methods.toParam(filter.value);
            this.filter.filter[filter.id] = { value: filter.value, param };
        }

        this.setQueryParams();
        this.filterChanged.next(this.filter);
    }

    filterCleared(): void {
        this.filter = { ...this.filter, filter: {} };

        this.setQueryParams();
        this.filterChanged.next(this.filter);
    }
}
