import { Component, HostBinding, inject, OnInit } from '@angular/core';

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
export class FilterSelectComponent implements OnInit {
    @HostBinding('className') private className: string = 'ngx-table-m3-filter';

    public data: { filter: IFilterSelect; viewConfig: IViewConfig } = inject(FILTER_DATA);
    public value?: string = inject(FILTER_VALUE);
    public onChange: (value?: string) => void = inject(FILTER_CHANGE);

    private searchQuery: string = '';
    public options: {
        readonly id: string;
        readonly title: string;
    }[] = [];

    ngOnInit(): void {
        this.setOptions('');
    }

    setOptions(query: string) {
        this.searchQuery = query.trim() || '';
        this.options = this.data.filter.options.filter(
            (o) => this.value === o.id || !this.searchQuery || o.title.includes(this.searchQuery),
        );

        const maxItem: number = this.data.filter.maxItem || 0;
        if (maxItem > 20) this.options = this.options.slice(0, maxItem);
    }

    updateValue(id: string): void {
        this.value = id;
        this.onChange(this.value);
    }
}
