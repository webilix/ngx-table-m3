import { Helper } from '@webilix/helper-library';

import { FilterMethods } from '../filter.interface';

export interface IFilterSelect {
    readonly type: 'SELECT';
    readonly options: {
        readonly id: string;
        readonly title: string;
        readonly icon?: string;
    }[];
    readonly english?: boolean;

    readonly toParam?: (value: string) => string;
}

export class FilterSelectMethods<T> extends FilterMethods<IFilterSelect, string> {
    override toParam(value: string): string {
        return value;
    }

    override value(value: string, filter: IFilterSelect): string | undefined {
        if (!value || !Helper.IS.string(value)) return undefined;

        const ids: string[] = filter.options.map((options) => options.id);
        return ids.includes(value) ? value : undefined;
    }

    override query(value: string): string {
        return this.toParam(value);
    }

    override active(value: string, filter: IFilterSelect): { value: string; english: boolean } {
        return { value: filter.options.find((o) => o.id === value)?.title || '', english: !!filter.english };
    }
}
