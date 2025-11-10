import { AfterViewInit, Component, ElementRef, HostBinding, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';

import { Helper } from '@webilix/helper-library';

import { IViewConfig } from '../../views';

import { FILTER_CHANGE, FILTER_DATA, FILTER_VALUE } from '../filter.interface';

import { IFilterSearch, IFilterSearchValue } from './filter-search.interface';

type Mode = IFilterSearchValue['mode'];

@Component({
    host: { selector: 'filter-search' },
    imports: [FormsModule, MatRadioButton, MatRadioGroup],
    templateUrl: './filter-search.component.html',
    styleUrl: './filter-search.component.scss',
})
export class FilterSearchComponent implements AfterViewInit {
    @HostBinding('className') protected className: string = 'ngx-table-m3-filter';
    @ViewChild('searchInput') protected searchInput?: ElementRef;

    public data: { filter: IFilterSearch; viewConfig: IViewConfig } = inject(FILTER_DATA);
    public value?: IFilterSearchValue = inject(FILTER_VALUE);
    public onChange: (value?: IFilterSearchValue) => void = inject(FILTER_CHANGE);

    public query?: string = this.value?.query;
    public mode: Mode = this.data.filter.mode || this.value?.mode || 'PHRASE';

    ngAfterViewInit(): void {
        if (!this.searchInput) return;

        const element: HTMLInputElement = this.searchInput.nativeElement;
        element?.focus();
    }

    updateQuery(query: string): void {
        query = query && Helper.IS.string(query) ? query.trim() : '';
        this.query = query.length === 0 ? undefined : query;

        this.onChange(this.query ? { query: this.query, mode: this.mode || 'PHRASE' } : undefined);
    }

    updateMode(mode: Mode): void {
        this.mode = mode;

        this.onChange(this.query ? { query: this.query, mode: this.mode || 'PHRASE' } : undefined);
    }
}
