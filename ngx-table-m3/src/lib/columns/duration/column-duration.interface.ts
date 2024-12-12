import { Helper } from '@webilix/helper-library';

import { ColumnMethods, IColumn } from '../column.interface';

export interface IColumnDuration<T> extends IColumn<T> {
    readonly type: 'DURATION';
    readonly format?: 'FULL' | 'DAY' | 'HOUR' | 'MINUTE' | 'SECOND';
}

export class ColumnDurationMethods<T> extends ColumnMethods<IColumnDuration<T>, number> {
    override column(column: IColumnDuration<T>): IColumnDuration<T> {
        return { ...column };
    }

    override value(value: any, column?: IColumnDuration<T> | undefined): number | undefined {
        if (Helper.IS.number(value)) return Math.abs(value);
        else if (Helper.IS.date(value)) return Math.floor(Math.abs(new Date().getTime() - value.getTime()) / 1000);
        else if (Helper.IS.object(value)) {
            const from: Date | undefined = Helper.IS.date(value?.from) ? value.from : undefined;
            const to: Date | undefined = Helper.IS.date(value?.to) ? value.to : undefined;

            if (!from && !to) return undefined;
            return Math.floor(Math.abs((from || new Date()).getTime() - (to || new Date()).getTime()) / 1000);
        }

        return undefined;
    }
}
