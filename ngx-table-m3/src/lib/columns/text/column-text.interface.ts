import { Helper } from '@webilix/helper-library';

import { ColumnMethods, IColumn } from '../column.interface';

export interface IColumnText<T> extends IColumn<T> {
    readonly type: 'TEXT';
}

export class ColumnTextMethods<T> extends ColumnMethods<IColumnText<T>, string> {
    override column(column: IColumnText<T>): IColumnText<T> {
        return { ...column };
    }

    override value(value: any, column?: IColumnText<T> | undefined): string | undefined {
        return Helper.IS.string(value) && value !== '' ? value : undefined;
    }
}
