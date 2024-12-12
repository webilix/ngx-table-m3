import { Helper } from '@webilix/helper-library';

import { FilterMethods } from '../filter.interface';

export interface IFilterMultiSelect {
    readonly type: 'MULTI-SELECT';
    readonly options: {
        readonly id: string;
        readonly title: string;
    }[];
    readonly english?: boolean;

    readonly toParam?: (value: string[]) => string;
}

export class FilterMultiSelectMethods<T> extends FilterMethods<IFilterMultiSelect, string[]> {
    override toParam(value: string[]): string {
        return value.join('||');
    }

    override value(value: string, filter: IFilterMultiSelect): string[] | undefined {
        if (!value || !Helper.IS.string(value)) return undefined;

        const ids: string[] = filter.options.map((options) => options.id);
        const values: string[] = value
            .split('||')
            .filter((item: string) => ids.includes(item))
            .filter((item: string, index: number, arr: string[]) => arr.indexOf(item) === index);
        return values.length === 0 ? undefined : values;
    }

    override query(value: string[]): string {
        return this.toParam(value);
    }

    override active(value: string[], filter: IFilterMultiSelect): { value: string; english: boolean } {
        const titles: string[] = value
            .map((value) => filter.options.find((o) => o.id === value)?.title || '')
            .filter((title) => title !== '');
        const selected: string = titles.length > 2 ? `${value.length} گزینه` : titles.join(filter.english ? ', ' : '، ');

        return { value: selected, english: !!filter.english };
    }
}
