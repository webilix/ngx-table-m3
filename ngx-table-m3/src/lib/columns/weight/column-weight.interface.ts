import { Helper } from '@webilix/helper-library';

import { ColumnMethods, IColumn } from '../column.interface';

export interface IColumnWeight<T> extends Omit<IColumn<T>, 'title'> {
    readonly type: 'WEIGHT';
    readonly title?: string;
    readonly short?: boolean;
}

export class ColumnWeightMethods<T> extends ColumnMethods<IColumnWeight<T>, number> {
    override column(column: IColumnWeight<T>): IColumnWeight<T> {
        return { ...column, title: column.title || 'وزن' };
    }

    override value(value: any, column?: IColumnWeight<T> | undefined): number | undefined {
        return Helper.IS.number(value) ? value : undefined;
    }
}
