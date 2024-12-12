import { Helper } from '@webilix/helper-library';

import { ColumnMethods, IColumn } from '../column.interface';

export interface IColumnNumber<T> extends IColumn<T> {
    readonly type: 'NUMBER';
    readonly fractionDigits?: number;
}

export class ColumnNumberMethods<T> extends ColumnMethods<IColumnNumber<T>, number> {
    override column(column: IColumnNumber<T>): IColumnNumber<T> {
        return { ...column };
    }

    override value(value: any, column?: IColumnNumber<T> | undefined): number | undefined {
        return Helper.IS.number(value) ? value : undefined;
    }
}
