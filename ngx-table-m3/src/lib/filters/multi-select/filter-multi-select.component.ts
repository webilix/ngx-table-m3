import { Component, HostBinding, inject, OnInit } from '@angular/core';

import { MatCheckbox } from '@angular/material/checkbox';

import { IViewConfig } from '../../views';

import { FILTER_CHANGE, FILTER_DATA, FILTER_VALUE } from '../filter.interface';

import { IFilterMultiSelect } from './filter-multi-select.interface';

@Component({
    host: { selector: 'filter-multi-select' },
    imports: [MatCheckbox],
    templateUrl: './filter-multi-select.component.html',
    styleUrl: './filter-multi-select.component.scss',
})
export class FilterMultiSelectComponent implements OnInit {
    @HostBinding('className') protected className: string = 'ngx-table-m3-filter';

    public data: { filter: IFilterMultiSelect; viewConfig: IViewConfig } = inject(FILTER_DATA);
    public value?: string[] = inject(FILTER_VALUE);
    public onChange: (value?: string[]) => void = inject(FILTER_CHANGE);

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
            (o) => (this.value || []).includes(o.id) || !this.searchQuery || o.title.includes(this.searchQuery),
        );

        const maxItem: number = this.data.filter.maxItem || 0;
        if (maxItem > 20) this.options = this.options.slice(0, maxItem);
    }

    updateValue(id: string, checked: boolean): void {
        this.value = this.value || [];

        if (!checked) this.value = this.value.filter((v) => v !== id);
        else if (!this.value.includes(id)) this.value.push(id);

        this.onChange(this.value.length === 0 ? undefined : this.value);
    }
}
