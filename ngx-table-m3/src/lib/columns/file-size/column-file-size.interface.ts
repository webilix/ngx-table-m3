import { Helper } from '@webilix/helper-library';

import { ColumnMethods, IColumn } from '../column.interface';

export interface IColumnFileSize<T> extends Omit<IColumn<T>, 'title'> {
    readonly type: 'FILE-SIZE';
    readonly title?: string;
    readonly format?: 'FULL' | 'DAY' | 'HOUR' | 'MINUTE' | 'SECOND';
}

export class ColumnFileSizeMethods<T> extends ColumnMethods<IColumnFileSize<T>, number> {
    override column(column: IColumnFileSize<T>): IColumnFileSize<T> {
        return { ...column, title: column.title || 'حجم فایل' };
    }

    override value(value: any, column?: IColumnFileSize<T> | undefined): number | undefined {
        return Helper.IS.number(value) && value >= 0 ? value : undefined;
    }
}
