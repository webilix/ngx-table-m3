import {
    IAction,
    IActionDelete,
    IActionLog,
    IActionStatus,
    IActionUpdate,
    IColumnDate,
    IColumnMobile,
    IColumnString,
} from './columns';

export type NgxTableColumn<T> = IColumnDate<T> | IColumnMobile<T> | IColumnString<T>;
type Columns<T> = NgxTableColumn<T> | { readonly title: string; readonly columns: NgxTableColumn<T>[] };

export type NgxTableAction<T> =
    | 'DIVIDER'
    | IAction<T>
    | IActionUpdate<T>
    | IActionDelete<T>
    | IActionStatus<T>
    | IActionLog<T>;

export interface INgxTable<T> {
    readonly type: string;
    readonly columns: Columns<T>[];
    readonly actions?: NgxTableAction<T>[];
    readonly row?: {
        readonly description?: (data: T) => string;
        readonly icon?: (data: T) => string | { icon: string; color: string };
        readonly isDeactive?: (data: T) => boolean;
    };

    // SETTING
    readonly mobileView?: boolean;
}

export interface INgxTableFilter {
    readonly page: number;
}

export interface INgxTablePagination {
    readonly total: number;
    readonly item: number;
    readonly page: {
        readonly current: number;
        readonly total: number;
    };
}
