import { Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { MatIcon } from '@angular/material/icon';

import { NgxHelperMultiLinePipe } from '@webilix/ngx-helper-m3';

import { IFilter } from '../../filters';
import { INgxTable } from '../../ngx-table.interface';
import { FilterInfo } from '../../filters/filter.info';
import { Filters, FilterService } from '../../filters/filter.service';

import { ViewActionComponent } from '../action/view-action.component';
import { ViewValueComponent } from '../value/view-value.component';
import { Orders, ViewService } from '../view.service';
import { IViewConfig, IViewFilter, IViewOrder } from '..';

@Component({
    selector: 'view-table',
    imports: [MatIcon, NgxHelperMultiLinePipe, ViewActionComponent, ViewValueComponent],
    providers: [FilterService, ViewService],
    templateUrl: './view-table.component.html',
    styleUrl: './view-table.component.scss',
    animations: [
        trigger('toolbar', [
            transition(':enter', [style({ opacity: 0, height: 0 }), animate('150ms', style({ opacity: 1, height: '*' }))]),
        ]),
    ],
})
export class ViewTableComponent<T> implements OnChanges {
    @HostBinding('className') private className: string = 'ngx-table-m3-table-view';

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
    public activeFilters: { id: string; title: string; value: string; english: boolean }[] = [];

    constructor(private readonly viewService: ViewService, private readonly filterService: FilterService) {}

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
        this.activeFilters = Object.keys(this.filters)
            .filter((id: string) => this.filters[id].value !== undefined)
            .map((id: string) => ({
                id,
                title: this.filters[id].title,
                ...FilterInfo[this.filters[id].filter.type].methods.active(this.filters[id].value, this.filters[id].filter),
            }));
    }

    updateOrder(id: string): void {
        const order = this.orders[id];
        if (!order || order.type === order.current) return;

        const type: 'ASC' | 'DESC' = order.current ? (order.current === 'ASC' ? 'DESC' : 'ASC') : order.initial;
        this.orderChanged.next({ id, type });
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

    clearFilter(id: string): void {
        const filter = this.filters[id];
        if (!filter) return;

        this.filters[id] = { ...this.filters[id], value: undefined };
        this.filterChanged.next({ id, value: undefined });
    }
}
