import { Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { Filters } from '../../../filters/filter.service';

import { IViewConfig, IViewOrder } from '../../view.interface';
import { Orders } from '../../view.service';

@Component({
    selector: 'view-card-toolbar',
    imports: [MatDivider, MatIcon, MatMenuModule],
    templateUrl: './view-card-toolbar.component.html',
    styleUrl: './view-card-toolbar.component.scss',
})
export class ViewCardToolbarComponent implements OnChanges {
    @HostBinding('className') private className: string = 'ngx-table-m3-card-view-toolbar';

    @Input({ required: true }) orders!: Orders;
    @Input({ required: true }) filters!: Filters;
    @Input({ required: true }) viewConfig!: IViewConfig;
    @Output() orderChanged: EventEmitter<IViewOrder> = new EventEmitter<IViewOrder>();
    @Output() updateFilter: EventEmitter<string> = new EventEmitter<string>();
    @Output() clearFilter: EventEmitter<void> = new EventEmitter<void>();

    public orderKeys: string[] = [];
    public filterKeys: string[] = [];
    public showClear: boolean = false;

    private swipeStart?: number;
    private swipeLeft: number = 0;

    ngOnChanges(changes: SimpleChanges): void {
        this.orderKeys = Object.keys(this.orders);

        const activeKeys: string[] = [];
        const deactiveKeys: string[] = [];
        Object.keys(this.filters).forEach((key: string) => {
            if (this.filters[key].value !== undefined) activeKeys.push(key);
            else deactiveKeys.push(key);
        });
        this.filterKeys = [...activeKeys, ...deactiveKeys];
        this.showClear = activeKeys.length > 2;
    }

    updateOrder(id: string, type: 'ASC' | 'DESC'): void {
        this.orderChanged.next({ id, type });
    }

    swipe(
        event: MouseEvent | TouchEvent,
        action: 'START' | 'MOVE' | 'END',
        container: HTMLElement,
        items: HTMLElement,
    ): void {
        if (container.offsetWidth > items.offsetWidth) return;
        const clientX: number = event instanceof MouseEvent ? event.clientX : event.changedTouches[0].clientX;

        switch (action) {
            case 'START':
                this.swipeStart = clientX - this.swipeLeft;
                break;
            case 'END':
                this.swipeStart = undefined;

                break;
            case 'MOVE':
                if (!this.swipeStart) return;

                let left: number = clientX - this.swipeStart;

                if (left <= 0) left = 0;
                else if (left > items.offsetWidth - container.offsetWidth) left = items.offsetWidth - container.offsetWidth;

                this.swipeLeft = left;
                items.style.left = `${left}px`;
                break;
        }
    }
}
