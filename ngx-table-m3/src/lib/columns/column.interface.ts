import { InjectionToken } from '@angular/core';

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

    readonly filter?: {
        readonly id: string;
        readonly order?: {
            readonly type?: 'ORDER' | 'ASC' | 'DESC';
            readonly initial?: 'ASC' | 'DESC';
            readonly isDefault?: boolean;
        };
    };
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
