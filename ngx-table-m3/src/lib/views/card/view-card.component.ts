import { Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatIcon } from '@angular/material/icon';

import { INgxTable } from '../../ngx-table.interface';

import { ViewActionComponent } from '../action/view-action.component';
import { ViewValueComponent } from '../value/view-value.component';
import { Order, ViewService } from '../view.service';
import { IViewConfig, IViewOrder } from '..';

import { ViewCardToolbarComponent } from './toolbar/view-card-toolbar.component';

@Component({
    selector: 'view-card',
    imports: [MatIcon, ViewActionComponent, ViewValueComponent, ViewCardToolbarComponent],
    providers: [ViewService],
    templateUrl: './view-card.component.html',
    styleUrl: './view-card.component.scss',
})
export class ViewCardComponent<T> implements OnChanges {
    @HostBinding('style.--toolbarHeight') private toolbarHeight: string = '32px';

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
    public hasToolbar: boolean = false;
    public headerTop: string = '';

    public hasContent!: boolean;

    constructor(private readonly viewService: ViewService) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.hasIcon = !!this.ngxTable.rows?.icon;
        this.hasAction = (this.ngxTable.actions || []).length > 0;

        this.titleIndex = this.viewService.getTitleIndex(this.ngxTable);
        this.subTitleIndex = this.viewService.getSubTitleIndex(this.ngxTable);

        this.icons = this.viewService.getIcons(this.ngxTable, this.data);
        this.colors = this.viewService.getColors(this.ngxTable, this.data);
        this.deactives = this.viewService.getDeactives(this.ngxTable, this.data);

        this.orders = this.viewService.getOrders(this.ngxTable);
        this.hasToolbar = Object.keys(this.orders).length > 1;

        const top = this.viewConfig.stickyView?.headerTop?.mobileView;
        this.headerTop = top ? (this.hasToolbar ? `calc(${top} + var(--toolbarHeight) + 1rem + 2px)` : top) : '';

        this.hasContent = this.ngxTable.columns.some(
            (_, index: number) => index != this.titleIndex && index !== this.subTitleIndex,
        );
    }
}
