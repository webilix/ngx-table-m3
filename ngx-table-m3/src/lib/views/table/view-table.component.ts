import { Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatIcon } from '@angular/material/icon';

import { INgxTable } from '../../ngx-table.interface';

import { ViewActionComponent } from '../action/view-action.component';
import { ViewValueComponent } from '../value/view-value.component';
import { Order, ViewService } from '../view.service';
import { IViewConfig, IViewOrder } from '..';

@Component({
    selector: 'view-table',
    imports: [MatIcon, ViewActionComponent, ViewValueComponent],
    providers: [ViewService],
    templateUrl: './view-table.component.html',
    styleUrl: './view-table.component.scss',
})
export class ViewTableComponent<T> implements OnChanges {
    @HostBinding('style.--oddRowsBackgroundColor') private oddRowsBackgroundColor!: string;
    @HostBinding('style.--evenRowsBackgroundColor') private evenRowsBackgroundColor!: string;

    @Input({ required: true }) ngxTable!: INgxTable<T>;
    @Input({ required: true }) data!: T[];
    @Input({ required: true }) viewConfig!: IViewConfig;
    @Output() orderChanged: EventEmitter<IViewOrder> = new EventEmitter<IViewOrder>();

    public hasIcon: boolean = false;
    public hasAction: boolean = false;

    public titleIndex!: number;
    public subTitleIndex?: number;

    public icons: { icon: string; color?: string }[] = [];
    public colors: string[] = [];
    public deactives: number[] = [];

    public orders!: Order;

    constructor(private readonly viewService: ViewService) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.oddRowsBackgroundColor = this.viewConfig.alternateRows ? this.viewConfig.oddRowsBackgroundColor : '';
        this.evenRowsBackgroundColor = this.viewConfig.alternateRows ? this.viewConfig.evenRowsBackgroundColor : '';

        this.hasIcon = !!this.ngxTable.rows?.icon;
        this.hasAction = (this.ngxTable.actions || []).length > 0;

        this.titleIndex = this.viewService.getTitleIndex(this.ngxTable);
        this.subTitleIndex = this.viewService.getSubTitleIndex(this.ngxTable);

        this.icons = this.viewService.getIcons(this.ngxTable, this.data);
        this.colors = this.viewService.getColors(this.ngxTable, this.data);
        this.deactives = this.viewService.getDeactives(this.ngxTable, this.data);

        this.orders = this.viewService.getOrders(this.ngxTable);
    }

    updateOrder(id: string): void {
        const order = this.orders[id];
        if (!order || order.type === order.current) return;

        const type: 'ASC' | 'DESC' = order.current ? (order.current === 'ASC' ? 'DESC' : 'ASC') : order.initial;
        this.orderChanged.next({ id, type });
    }
}
