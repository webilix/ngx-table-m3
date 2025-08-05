import { Helper } from '@webilix/helper-library';

import { ColumnMethods, IColumn } from '../column.interface';

export interface IColumnTag<T>
    extends Omit<IColumn<T>, 'title' | 'english' | 'subValue' | 'english' | 'mode' | 'onClick' | 'onCopy'> {
    readonly type: 'TAG';
    readonly title?: string;
    readonly onTagClick?: (id: string) => string[] | void;
}

export class ColumnTagMethods<T> extends ColumnMethods<IColumnTag<T>, { id: string; title: string }[]> {
    override column(column: IColumnTag<T>): IColumnTag<T> {
        return { ...column, title: column.title || 'تگ' };
    }

    override value(value: any, column?: IColumnTag<T> | undefined): { id: string; title: string }[] | undefined {
        const list: { id: string; title: string }[] = (
            (Helper.IS.array(value) ? value : []) as { id: string; title: string }[]
        )
            .filter((item) => !!item.id && !!item.title)
            .sort((i1, i2) => i1.title.localeCompare(i2.title));

        return list.length > 0 ? list : undefined;
    }
}
