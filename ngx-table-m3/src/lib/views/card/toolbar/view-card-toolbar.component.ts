import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

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
    @Input({ required: true }) orders!: Orders;
    @Input({ required: true }) filters!: Filters;
    @Input({ required: true }) viewConfig!: IViewConfig;
    @Output() orderChanged: EventEmitter<IViewOrder> = new EventEmitter<IViewOrder>();
    @Output() updateFilter: EventEmitter<string> = new EventEmitter<string>();

    public orderKeys: string[] = [];
    public filterKeys: string[] = [];

    private swipeStart?: number;
    private swipeLeft: number = 0;

    ngOnChanges(changes: SimpleChanges): void {
        this.orderKeys = Object.keys(this.orders);
        this.filterKeys = Object.keys(this.filters);
    }

    updateOrder(id: string, type: 'ASC' | 'DESC'): void {
        this.orderChanged.next({ id, type });
    }

    swipe(
        event: MouseEvent | TouchEvent,
        action: 'START' | 'MOVE' | 'END',
        toolbar: HTMLElement,
        container: HTMLElement,
    ): void {
        if (toolbar.offsetWidth > container.offsetWidth) return;
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
                else if (left > container.offsetWidth - toolbar.offsetWidth)
                    left = container.offsetWidth - toolbar.offsetWidth;

                this.swipeLeft = left;
                container.style.left = `${left}px`;
                break;
        }
    }
}
