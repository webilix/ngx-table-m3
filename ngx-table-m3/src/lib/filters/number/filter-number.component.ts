import { AfterViewInit, Component, ElementRef, HostBinding, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { Helper } from '@webilix/helper-library';

import { IViewConfig } from '../../views';

import { FILTER_CHANGE, FILTER_DATA, FILTER_VALUE } from '../filter.interface';

import { IFilterNumber, IFilterNumberValue } from './filter-number.interface';

type Mode = IFilterNumberValue['mode'];

@Component({
    host: { selector: 'filter-number' },
    imports: [FormsModule, NgxMaskDirective],
    providers: [provideNgxMask()],
    templateUrl: './filter-number.component.html',
    styleUrl: './filter-number.component.scss',
})
export class FilterNumberComponent implements AfterViewInit {
    @HostBinding('className') private className: string = 'ngx-table-m3-filter';
    @ViewChild('fromInput') private fromInput?: ElementRef;
    @ViewChild('numberInput') private numberInput?: ElementRef;

    public data: { filter: IFilterNumber; viewConfig: IViewConfig } = inject(FILTER_DATA);
    public value?: IFilterNumberValue = inject(FILTER_VALUE);
    public onChange: (value?: IFilterNumberValue) => void = inject(FILTER_CHANGE);

    public modes: { type: Mode; title: string }[] = [
        { type: 'EQUAL', title: 'برابر با' },
        { type: 'LOWER', title: 'کمتر از' },
        { type: 'GREATER', title: 'بیشتر از' },
        { type: 'BETWEEN', title: 'در محدوده' },
    ];

    public mode?: Mode = this.data.filter.mode || this.value?.mode;
    public query?: string = this.value?.query;

    public fromQuery?: string = this.mode === 'BETWEEN' && this.query ? this.query.split(':')[0] : undefined;
    public toQuery?: string = this.mode === 'BETWEEN' && this.query ? this.query.split(':')[1] : undefined;
    public numberQuery?: string =
        this.mode === 'EQUAL' || this.mode === 'LOWER' || this.mode === 'GREATER' ? this.query : undefined;

    public inputTransformFn = (value: any): string => Helper.STRING.changeNumbers(value.toString(), 'EN');

    ngAfterViewInit(): void {
        if (!this.mode) return;

        const elementRef: ElementRef | undefined = this.mode === 'BETWEEN' ? this.fromInput : this.numberInput;
        const element: HTMLInputElement | undefined = elementRef?.nativeElement;
        element?.focus();
    }

    setMode(mode: Mode) {
        this.mode = mode;
        this.updateQuery();

        setTimeout(() => {
            const elementRef: ElementRef | undefined = this.mode === 'BETWEEN' ? this.fromInput : this.numberInput;
            const element: HTMLInputElement | undefined = elementRef?.nativeElement;
            element?.focus();
        }, 100);
    }

    isNumeric(value: string): boolean {
        if (value.substring(0, 1) === '-') value = value.substring(1);
        return Helper.IS.STRING.numeric(value);
    }

    setQuery(fromQuery: string, toQuery: string): void {
        if (!this.mode) return;

        fromQuery = (fromQuery && Helper.IS.string(fromQuery) ? fromQuery.trim() : '').replace(/,/gi, '');
        const from: number | undefined =
            fromQuery && this.isNumeric(fromQuery) && !isNaN(+fromQuery) ? +fromQuery : undefined;

        if (this.mode !== 'BETWEEN') {
            this.query = from !== undefined ? from.toString() : undefined;
            this.updateQuery();
            return;
        }

        toQuery = (toQuery && Helper.IS.string(toQuery) ? toQuery.trim() : '').replace(/,/gi, '');
        const to: number | undefined = toQuery && this.isNumeric(toQuery) && !isNaN(+toQuery) ? +toQuery : undefined;

        this.query = from !== undefined && to !== undefined && from < to ? `${from}:${to}` : undefined;
        this.updateQuery();
    }

    updateQuery(): void {
        this.onChange(this.query && this.mode ? { query: this.query, mode: this.mode } : undefined);
    }
}
