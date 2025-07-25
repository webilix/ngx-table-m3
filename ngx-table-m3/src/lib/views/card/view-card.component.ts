import { Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatIcon } from '@angular/material/icon';

import { NgxHelperMultiLinePipe } from '@webilix/ngx-helper-m3';

import { IFilter } from '../../filters';
import { INgxTable } from '../../ngx-table.interface';
import { Filters, FilterService } from '../../filters/filter.service';

import { ViewActionComponent } from '../action/view-action.component';
import { ViewValueComponent } from '../value/view-value.component';
import { Orders, ViewService } from '../view.service';
import { IViewConfig, IViewFilter, IViewOrder } from '..';

import { ViewCardToolbarComponent } from './toolbar/view-card-toolbar.component';

@Component({
    selector: 'view-card',
    imports: [MatIcon, NgxHelperMultiLinePipe, ViewActionComponent, ViewValueComponent, ViewCardToolbarComponent],
    providers: [FilterService, ViewService],
    templateUrl: './view-card.component.html',
    styleUrl: './view-card.component.scss',
})
export class ViewCardComponent<T> implements OnChanges {
    @HostBinding('className') private className: string = 'ngx-table-m3-card-view';

    @Input({ required: true }) ngxTable!: INgxTable<T>;
    @Input({ required: true }) data!: T[];
    @Input({ required: true }) viewConfig!: IViewConfig;
    @Output() orderChanged: EventEmitter<IViewOrder> = new EventEmitter<IViewOrder>();
    @Output() filterChanged: EventEmitter<IViewFilter> = new EventEmitter<IViewFilter>();
    @Output() filterCleared: EventEmitter<void> = new EventEmitter<void>();

    public hasIcon: boolean = false;
    public hasAction: boolean = false;

    public titleIndex!: number;
    public subTitleIndex?: number;

    public icons: { icon: string; color?: string }[] = [];
    public emojis: string[] = [];
    public colors: string[] = [];
    public descriptions: (string | undefined)[] = [];
    public deactives: number[] = [];

    public orders!: Orders;
    public filters!: Filters;
    public hasToolbar: boolean = false;
    public top: string = '';

    public hasContent!: boolean;

    constructor(private readonly filterService: FilterService, private readonly viewService: ViewService) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.hasIcon = !!this.ngxTable.rows?.icon;
        this.hasAction = (this.ngxTable.actions || []).length > 0;

        this.titleIndex = this.viewService.getTitleIndex(this.ngxTable);
        this.subTitleIndex = this.viewService.getSubTitleIndex(this.ngxTable);

        this.icons = this.viewService.getIcons(this.ngxTable, this.data);
        this.emojis = this.viewService.getEmojis(this.ngxTable, this.data);
        this.colors = this.viewService.getColors(this.ngxTable, this.data);
        this.descriptions = this.viewService.getDescriptions(this.ngxTable, this.data);
        this.deactives = this.viewService.getDeactives(this.ngxTable, this.data);

        this.orders = this.viewService.getOrders(this.ngxTable);
        this.filters = this.filterService.getFilters(this.ngxTable);
        this.hasToolbar = Object.keys(this.orders).length > 0 || Object.keys(this.filters).length > 0;

        const top = this.viewConfig.stickyView?.top?.mobileView;
        this.top = top ? (this.hasToolbar ? `calc(${top} + var(--ngx-table-m3-toolbar-height) + 1rem + 2px)` : top) : '';

        this.hasContent = this.ngxTable.columns.some(
            (_, index: number) => index != this.titleIndex && index !== this.subTitleIndex,
        );
    }

    updateFilter(id: string): void {
        const filter = this.filters[id];
        if (!filter) return;

        this.filterService.updateFilter(filter, this.viewConfig).then((filter?: IFilter) => {
            if (!filter) return;

            this.filters[id] = filter;
            this.filterChanged.next({ id, value: filter.value });
        });
    }
}
