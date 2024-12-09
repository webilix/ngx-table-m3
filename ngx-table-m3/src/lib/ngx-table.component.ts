import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Optional, Output, SimpleChanges } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Helper } from '@webilix/helper-library';

import { IViewConfig, ViewCardComponent, ViewPaginationComponent, ViewTableComponent } from './views';

import { ColumnInfo } from './columns';
import { INgxTableConfig, NGX_TABLE_CONFIG } from './ngx-table.config';
import { INgxTable, INgxTableFilter, INgxTablePagination } from './ngx-table.interface';

@Component({
    selector: 'ngx-table',
    host: { '(window:resize)': 'onResize($event)' },
    imports: [NgClass, ViewCardComponent, ViewPaginationComponent, ViewTableComponent],
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
    public loaderClass!: string;
    public emptyClass!: string;

    public viewConfig!: IViewConfig;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        @Optional() @Inject(NGX_TABLE_CONFIG) private readonly config?: Partial<INgxTableConfig>,
    ) {}

    ngOnInit(): void {
        const queryParams: { [key: string]: any } = { ...this.activatedRoute.snapshot.queryParams };
        const page: number = Helper.IS.number(+queryParams['ngx-table-page']) ? +queryParams['ngx-table-page'] : 1;
        this.filterChanged.next({ page });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.ngxTable = {
            ...this.ngxTable,
            columns: this.ngxTable.columns.map((column) => ColumnInfo[column.type].methods.column(column)),
        };

        this.loaderClass = this.config?.cssClasses?.loader || 'ngx-table-loader';
        this.emptyClass = this.config?.cssClasses?.empty || 'ngx-table-empty';

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

            enClass: this.config?.cssClasses?.en || 'ngx-table-en',
            deactiveClass: this.config?.cssClasses?.deactive || 'ngx-table-deactive',

            borderColor: this.config?.colors?.border || 'var(--outline-variant)',
            headerTextColor: this.config?.colors?.headerText || '',
            headerBackgroundColor: this.config?.colors?.headerBackground || 'var(--surface-container-highest)',
            oddRowsBackgroundColor: this.config?.colors?.oddRowsBackground || 'var(--background)',
            evenRowsBackgroundColor: this.config?.colors?.evenRowsBackground || 'var(--surface-container-low)',
            cardBackgroundColor: this.config?.colors?.cardBackground || 'var(--surface-container)',
            paginationBackgroundColor: this.config?.colors?.paginationBackground || 'var(--background)',

            actionButtonColor: this.config?.action?.buttonColor || 'var(--primary)',
            actionMenuColor: this.config?.action?.buttonColor || 'var(--on-surface)',
            actionWarnColor: this.config?.action?.warnColor || 'var(--error)',
            actionMenuTitle: this.config?.action?.menuTitle || 'امکانات',

            stickyView: this.config?.stickyView
                ? {
                      headerTop: this.config.stickyView.headerTop
                          ? getStickyView(this.config.stickyView.headerTop)
                          : undefined,
                      paginationBottom: this.config.stickyView.paginationBottom
                          ? getStickyView(this.config.stickyView.paginationBottom)
                          : undefined,
                  }
                : undefined,
        };

        this.onResize();
    }

    onResize(): void {
        const mobileWidth: number = this.config?.mobileWidth || 600;
        this.isMobile = this.ngxTable.mobileView || window.innerWidth <= mobileWidth;
    }
}
