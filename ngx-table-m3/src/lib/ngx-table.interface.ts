import {
    IAction,
    IActionDelete,
    IActionLog,
    IActionStatus,
    IActionUpdate,
    IColumnDate,
    IColumnMobile,
    IColumnText,
} from './columns';

export type NgxTableColumn<T> = IColumnDate<T> | IColumnMobile<T> | IColumnText<T>;

export type NgxTableAction<T> =
    | 'DIVIDER'
    | IAction<T>
    | IActionUpdate<T>
    | IActionDelete<T>
    | IActionStatus<T>
    | IActionLog<T>;

export interface INgxTable<T> {
    readonly route?: string[];
    readonly type: string;
    readonly columns: NgxTableColumn<T>[];
    readonly rows?: {
        readonly icon?: (data: T) => string | { icon: string; color: string };
        readonly color?: (data: T) => string;
        readonly isDeactive?: (data: T) => boolean;
    };
    readonly actions?: NgxTableAction<T>[];

    // SETTING
    readonly mobileView?: boolean;
}

export interface INgxTableFilter {
    readonly page: number;
    readonly order?: {
        readonly id: string;
        readonly type: 'ASC' | 'DESC';
        readonly param: string;
    };
    readonly filter: {
        [id: string]: {
            readonly value: any;
            readonly param: string;
        };
    };
}

export interface INgxTablePagination {
    // readonly totalItems: number;
    // readonly itemPerPage: number;
    readonly item: {
        readonly perPage: number;
        readonly total: number;
    };
    readonly page: {
        readonly current: number;
        readonly total: number;
    };
}
