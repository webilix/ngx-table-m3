import { Helper } from '@webilix/helper-library';

import { ColumnMethods, IColumn } from '../column.interface';

export interface IColumnMobile<T> extends Omit<IColumn<T>, 'title'> {
    readonly type: 'MOBILE';
    readonly title?: string;
}

export class ColumnMobileMethods<T> extends ColumnMethods<IColumnMobile<T>, string> {
    override column(column: IColumnMobile<T>): IColumnMobile<T> {
        return { ...column, title: column.title || 'موبایل' };
    }

    override value(value: any, column?: IColumnMobile<T> | undefined): string | undefined {
        return Helper.IS.STRING.mobile(value) ? value : undefined;
    }
}
