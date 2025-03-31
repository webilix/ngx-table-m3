import { Helper } from '@webilix/helper-library';

import { ColumnMethods, IColumn } from '../column.interface';

export interface IColumnDate<T> extends Omit<IColumn<T>, 'title' | 'english'> {
    readonly type: 'DATE';
    readonly title?: string;
    readonly format?: string | 'FULL' | 'SHORT' | 'DATE' | 'TIME' | 'WEEK' | 'MONTH' | 'YEAR';
}

export class ColumnDateMethods<T> extends ColumnMethods<IColumnDate<T>, Date> {
    override column(column: IColumnDate<T>): IColumnDate<T> {
        return { ...column, title: column.title || 'تاریخ' };
    }

    override value(value: any, column?: IColumnDate<T> | undefined): Date | undefined {
        return Helper.IS.date(value) ? value : undefined;
    }
}
