import { InjectionToken } from '@angular/core';

import { IViewConfig } from '../views';

import { IFilterDate, IFilterMultiSelect, IFilterNumber, IFilterSearch, IFilterSelect } from '.';

export type Filter = IFilterDate | IFilterMultiSelect | IFilterNumber | IFilterSearch | IFilterSelect;

export interface IFilter {
    readonly filter: Filter;
    readonly title: string;
    readonly value?: any;
}

export abstract class FilterMethods<F /** FILTER **/, V /** VALUE **/> {
    abstract toParam(value: V): string;

    abstract value(value: string, filter: F): V | undefined;
    abstract query(value: V): string;
    abstract active(value: V, filter: F): { value: string; english: boolean };
}

export const FILTER_DATA: InjectionToken<{ filter: any; viewConfig: IViewConfig }> = new InjectionToken(
    'NGX-TABLE-FILTER-DATA',
);
export const FILTER_VALUE: InjectionToken<any> = new InjectionToken('NGX-TABLE-FILTER-VALUE');
export const FILTER_CHANGE: InjectionToken<(value?: any) => void> = new InjectionToken('NGX-TABLE-FILTER-CHANGE');
