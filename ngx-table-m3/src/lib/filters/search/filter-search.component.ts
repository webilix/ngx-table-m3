import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';

import { Helper } from '@webilix/helper-library';

import { IViewConfig } from '../../views';

import { FILTER_CHANGE, FILTER_DATA, FILTER_VALUE } from '../filter.interface';

import { IFilterSearch, IFilterSearchValue } from './filter-search.interface';

@Component({
    host: { selector: 'filter-search' },
    imports: [NgClass, FormsModule, MatRadioButton, MatRadioGroup],
    templateUrl: './filter-search.component.html',
    styleUrl: './filter-search.component.scss',
})
export class FilterSearchComponent implements AfterViewInit {
    @ViewChild('searchInput') private searchInput?: ElementRef;

    public data: { filter: IFilterSearch; viewConfig: IViewConfig } = inject(FILTER_DATA);
    public value?: IFilterSearchValue = inject(FILTER_VALUE);
    public onChange: (value?: IFilterSearchValue) => void = inject(FILTER_CHANGE);

    public query?: string = this.value?.query;
    public mode?: 'FULL' | 'ALL' | 'EACH' = this.data.filter.mode || this.value?.mode || 'FULL';

    ngAfterViewInit(): void {
        if (!this.searchInput) return;

        const element: HTMLInputElement = this.searchInput.nativeElement;
        element?.focus();
    }

    updateQuery(query: string): void {
        query = query && Helper.IS.string(query) ? query.trim() : '';
        this.query = query.length === 0 ? undefined : query;

        this.onChange(this.query ? { query: this.query, mode: this.mode || 'FULL' } : undefined);
    }

    updateMode(mode: 'FULL' | 'ALL' | 'EACH'): void {
        this.mode = mode;

        this.onChange(this.query ? { query: this.query, mode: this.mode || 'FULL' } : undefined);
    }
}
