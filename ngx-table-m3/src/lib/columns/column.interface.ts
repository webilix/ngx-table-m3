interface IColumn<T> {
    readonly title: string;
    readonly value: keyof T | ((data: T) => any);
    readonly subValue?: keyof T | ((data: T) => string | { value: string; english: true } | undefined);
    readonly color?: string | ((data: T) => string);
    readonly action?: (data: T) => string[] | (() => void);
    readonly copy?: (data: T) => string;
}

export abstract class ColumnMethods<C /** COLUMN **/, V /** VALUE **/> {
    abstract value(value: any, column?: C): V;
}

export interface IColumnString<T> extends IColumn<T> {
    readonly type: 'STRING';
    readonly english?: ((data: T) => boolean) | true;
}

export interface IColumnDate<T> extends IColumn<T> {
    readonly type: 'DATE';
    readonly format?: string | 'FULL' | 'DATE' | 'TIME';
}

export interface IColumnMobile<T> extends Omit<IColumn<T>, 'title'> {
    readonly type: 'MOBILE';
    readonly title?: string;
}
