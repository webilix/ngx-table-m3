import { InjectionToken } from '@angular/core';

import { Filter } from '../filters';

interface IColumnOrder {
    readonly type?: 'ORDER' | 'ASC' | 'DESC';
    readonly initial?: 'ASC' | 'DESC';
    readonly isDefault?: boolean;
}

export interface IColumn<T> {
    readonly title: string;
    readonly value: keyof T | ((data: T) => any);
    readonly subValue?: keyof T | ((data: T) => string | { value: string; english: true } | undefined);
    readonly english?: ((data: T) => boolean) | boolean;
    readonly color?: string | ((data: T) => string);
    readonly textAlign?: 'RIGHT' | 'CENTER' | 'LEFT';
    readonly mode?: 'TITLE' | 'SUBTITLE';

    readonly onClick?: (data: T) => string[] | (() => void);
    readonly onCopy?: (data: T) => string;

    readonly tools?:
        | { readonly id: string; readonly order: IColumnOrder }
        | { readonly id: string; readonly filter: Filter }
        | { readonly id: string; readonly order: IColumnOrder; readonly filter: Filter };
}

export abstract class ColumnMethods<C /** COLUMN **/, V /** VALUE **/> {
    abstract column(column: C): C;
    abstract value(value: any, column?: C): V | undefined;
}

export interface IColumnConfig {
    readonly isEN: boolean;
    readonly enClass: string;
    readonly isDeactive: boolean;
    readonly deactiveClass: string;
}

export const COLUMN_TYPE: InjectionToken<any> = new InjectionToken('NGX-TABLE-COLUMN-TYPE');
export const COLUMN_CONFIG: InjectionToken<IColumnConfig> = new InjectionToken('NGX-TABLE-COLUMN-CONFIG');
export const COLUMN_VALUE: InjectionToken<any> = new InjectionToken('NGX-TABLE-COLUMN-VALUE');
