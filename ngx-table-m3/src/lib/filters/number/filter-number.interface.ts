import { Helper } from '@webilix/helper-library';

import { FilterMethods } from '../filter.interface';

type Mode = 'EQUAL' | 'GREATER' | 'LESS' | 'BETWEEN';
const modeList: Mode[] = ['EQUAL', 'GREATER', 'LESS', 'BETWEEN'];

export interface IFilterNumberValue {
    readonly query: string;
    readonly mode: Mode;
}

export interface IFilterNumber {
    readonly type: 'NUMBER';
    readonly mode?: Mode;

    readonly toParam?: (value: IFilterNumberValue) => string;
}

export class FilterNumberMethods<T> extends FilterMethods<IFilterNumber, IFilterNumberValue> {
    override toParam(value: IFilterNumberValue): string {
        return `${value.query}:${value.mode}`;
    }

    override value(value: string, filter: IFilterNumber): IFilterNumberValue | undefined {
        if (!value || !Helper.IS.string(value)) return undefined;

        const index: number = value.lastIndexOf(':');
        if (index === -1) return undefined;

        const query: string = value.substring(0, index);
        if (!query || !Helper.IS.string(query)) return undefined;

        const mode: Mode = value.substring(index + 1) as Mode;
        if (!modeList.includes(mode)) return undefined;
        if (filter.mode && filter.mode !== mode) return undefined;

        const isNumeric = (value: string): boolean => {
            if (value.substring(0, 1) === '-') value = value.substring(1);
            return Helper.IS.STRING.numeric(value);
        };
        switch (mode) {
            case 'EQUAL':
            case 'GREATER':
            case 'LESS':
                if (!isNumeric(query) || isNaN(+query)) return undefined;
                break;

            case 'BETWEEN':
                const [from, to] = query.split(':', 2);
                if (!from || !isNumeric(from) || isNaN(+from) || !to || !isNumeric(to) || isNaN(+to)) return undefined;
                if (+from >= +to) return undefined;
                break;
        }

        return { query, mode };
    }

    override query(value: IFilterNumberValue): string {
        return this.toParam(value);
    }

    override active(value: IFilterNumberValue, filter: IFilterNumber): { value: string; english: boolean } {
        let title: string = '';
        switch (value.mode) {
            case 'EQUAL':
                title = Helper.NUMBER.format(+value.query);
                break;
            case 'LESS':
                title = `کمتر از ${Helper.NUMBER.format(+value.query)}`;
                break;
            case 'GREATER':
                title = `بیشتر از ${Helper.NUMBER.format(+value.query)}`;
                break;
            case 'BETWEEN':
                const [from, to] = value.query.split(':');
                title = `${Helper.NUMBER.format(+from)} تا ${Helper.NUMBER.format(+to)}`;
        }
        return { value: title, english: false };
    }
}
