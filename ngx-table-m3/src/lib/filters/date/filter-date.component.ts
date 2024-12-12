import { Component, inject } from '@angular/core';

import { NgxCalendarDateComponent } from '@webilix/ngx-calendar-m3';

import { IViewConfig } from '../../views';

import { FILTER_CHANGE, FILTER_DATA, FILTER_VALUE } from '../filter.interface';

import { IFilterDate } from './filter-date.interface';

@Component({
    host: { selector: 'filter-date' },
    imports: [NgxCalendarDateComponent],
    templateUrl: './filter-date.component.html',
    styleUrl: './filter-date.component.scss',
})
export class FilterDateComponent {
    public data: { filter: IFilterDate; viewConfig: IViewConfig } = inject(FILTER_DATA);
    public value?: Date = inject(FILTER_VALUE);
    public onChange: (value?: Date) => void = inject(FILTER_CHANGE);
}
