import { Helper } from '@webilix/helper-library';

import { ColumnMethods, IColumn } from '../column.interface';

export interface IColumnPeriod<T> extends Omit<IColumn<T>, 'english'> {
    readonly type: 'PERIOD';
}

export class ColumnPeriodMethods<T> extends ColumnMethods<IColumnPeriod<T>, { from?: Date; to?: Date }> {
    override column(column: IColumnPeriod<T>): IColumnPeriod<T> {
        return { ...column };
    }

    override value(value: any, column?: IColumnPeriod<T> | undefined): { from?: Date; to?: Date } | undefined {
        if (Helper.IS.date(value)) return { from: value };
        else if (Helper.IS.object(value)) {
            const from: Date | undefined = Helper.IS.date(value?.from) ? value.from : undefined;
            const to: Date | undefined = Helper.IS.date(value?.to) ? value.to : undefined;

            return from || to ? { from, to } : undefined;
        }

        return undefined;
    }
}
