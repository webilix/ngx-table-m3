import { Component, HostBinding, inject } from '@angular/core';

import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';

import { IViewConfig } from '../../views';

import { FILTER_CHANGE, FILTER_DATA, FILTER_VALUE } from '../filter.interface';

import { IFilterSelect } from './filter-select.interface';

@Component({
    host: { selector: 'filter-select' },
    imports: [MatRadioButton, MatRadioGroup],
    templateUrl: './filter-select.component.html',
    styleUrl: './filter-select.component.scss',
})
export class FilterSelectComponent {
    @HostBinding('className') private className: string = 'ngx-table-m3-filter';

    public data: { filter: IFilterSelect; viewConfig: IViewConfig } = inject(FILTER_DATA);
    public value?: string = inject(FILTER_VALUE);
    public onChange: (value?: string) => void = inject(FILTER_CHANGE);

    public searchQuery: string = '';

    updateValue(id: string): void {
        this.value = id;
        this.onChange(this.value);
    }
}
