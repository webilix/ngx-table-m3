import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatIcon } from '@angular/material/icon';

import { COLUMN_CONFIG, COLUMN_TYPE, COLUMN_VALUE, IColumnConfig } from '../column.interface';

import { IColumnTag } from './column-tag.interface';

@Component({
    host: { selector: 'column-tag' },
    imports: [MatIcon],
    templateUrl: './column-tag.component.html',
    styleUrl: './column-tag.component.scss',
})
export class ColumnTagComponent<T> {
    public column: IColumnTag<T> = inject(COLUMN_TYPE);
    public value: { id: string; title: string }[] = inject(COLUMN_VALUE);
    public config: IColumnConfig = inject(COLUMN_CONFIG);

    constructor(private readonly router: Router) {}

    onTagClick(id: string): void {
        if (!this.column.onTagClick) return;

        const action = this.column.onTagClick(id);
        if (action) this.router.navigate(action);
    }
}
