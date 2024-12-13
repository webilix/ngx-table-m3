import { Helper } from '@webilix/helper-library';

import { FilterMethods } from '../filter.interface';

export interface IFilterSearchValue {
    readonly query: string;
    readonly mode: 'PHRASE' | 'ALL' | 'EACH';
}

export interface IFilterSearch {
    readonly type: 'SEARCH';
    readonly mode?: 'PHRASE' | 'ALL' | 'EACH';
    readonly english?: boolean;

    readonly toParam?: (value: IFilterSearchValue) => string;
}

export class FilterSearchMethods<T> extends FilterMethods<IFilterSearch, IFilterSearchValue> {
    override toParam(value: IFilterSearchValue): string {
        return `${value.query}:${value.mode}`;
    }

    override value(value: string, filter: IFilterSearch): IFilterSearchValue | undefined {
        if (!value || !Helper.IS.string(value)) return undefined;

        const index: number = value.lastIndexOf(':');
        if (index === -1) return undefined;

        const query: string = value.substring(0, index);
        if (!query || !Helper.IS.string(query)) return undefined;

        const mode: 'PHRASE' | 'ALL' | 'EACH' = value.substring(index + 1) as 'PHRASE' | 'ALL' | 'EACH';
        if (!['PHRASE', 'EACH', 'ALL'].includes(mode)) return undefined;
        if (filter.mode && filter.mode !== mode) return undefined;

        return { query, mode };
    }

    override query(value: IFilterSearchValue): string {
        return this.toParam(value);
    }

    override active(value: IFilterSearchValue, filter: IFilterSearch): { value: string; english: boolean } {
        return { value: value.query, english: !!filter.english };
    }
}