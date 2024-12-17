import { Component, HostBinding, inject, Injector, OnInit } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

import { MatButton } from '@angular/material/button';

import { NGX_HELPER_CONTAINER_CLOSE, NGX_HELPER_CONTAINER_DATA } from '@webilix/ngx-helper-m3';

import { IViewConfig } from '../views';

import { FilterInfo } from './filter.info';
import { FILTER_CHANGE, FILTER_DATA, FILTER_VALUE, IFilter } from './filter.interface';

@Component({
    selector: 'filter',
    host: { '(window:keydown)': 'onKeydown($event)' },
    imports: [MatButton, NgComponentOutlet],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss',
})
export class FilterComponent implements OnInit {
    @HostBinding('className') private className: string = 'ngx-table-m3-filter';

    public data: { filter: IFilter; viewConfig: IViewConfig } = inject(NGX_HELPER_CONTAINER_DATA);
    public closeContainer: (response?: any) => void = inject(NGX_HELPER_CONTAINER_CLOSE);

    public filterInfo = FilterInfo;

    public value?: any = undefined;
    public injector!: Injector;

    ngOnInit(): void {
        this.value = this.data.filter.value;

        this.injector = Injector.create({
            providers: [
                { provide: FILTER_DATA, useValue: { filter: this.data.filter.filter, viewConfig: this.data.viewConfig } },
                { provide: FILTER_VALUE, useValue: this.value },
                { provide: FILTER_CHANGE, useFactory: () => (value?: any) => (this.value = value) },
            ],
        });
    }

    onKeydown(event: any): void {
        if (!(event instanceof KeyboardEvent)) return;
        if (event.code === 'Enter' && this.value) this.closeContainer({ value: this.value });
    }
}
