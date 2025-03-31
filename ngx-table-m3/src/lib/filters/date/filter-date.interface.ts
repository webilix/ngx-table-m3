import { Helper } from '@webilix/helper-library';
import { JalaliDateTime } from '@webilix/jalali-date-time';

import { FilterMethods } from '../filter.interface';

export interface IFilterDate {
    readonly type: 'DATE';
    readonly minDate?: Date;
    readonly maxDate?: Date;

    readonly toParam?: (value: Date) => string;
}

export class FilterDateMethods<T> extends FilterMethods<IFilterDate, Date> {
    override toParam(value: Date): string {
        return value.toJSON();
    }

    override value(value: string, filter: IFilterDate): Date | undefined {
        if (!value || !Helper.IS.STRING.date(value)) return undefined;

        const jalali = JalaliDateTime();
        const gregorian = jalali.gregorian(value).date;
        const date: Date = jalali.periodDay(1, new Date(`${gregorian}T00:00:00.000Z`)).from;

        if (filter.minDate && date.getTime() < filter.minDate.getTime()) return undefined;
        if (filter.maxDate && date.getTime() > filter.maxDate.getTime()) return undefined;

        return date;
    }

    override query(value: Date): string {
        const jalali = JalaliDateTime();
        return jalali.toString(value, { format: 'Y-M-D' });
    }

    override active(value: Date, filter: IFilterDate): { value: string; english: boolean } {
        const jalali = JalaliDateTime();
        return { value: jalali.toFullText(value, { format: 'Y/M/D' }), english: false };
    }
}
