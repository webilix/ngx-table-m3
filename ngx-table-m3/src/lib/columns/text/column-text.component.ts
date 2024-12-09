import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';

import { COLUMN_CONFIG, COLUMN_TYPE, COLUMN_VALUE, IColumnConfig } from '../column.interface';

import { IColumnText } from './column-text.interface';

@Component({
    host: { selector: 'column-text' },
    imports: [NgClass],
    templateUrl: './column-text.component.html',
    styleUrl: './column-text.component.scss',
})
export class ColumnTextComponent<T> {
    public column: IColumnText<T> = inject(COLUMN_TYPE);
    public value: string = inject(COLUMN_VALUE);
    public config: IColumnConfig = inject(COLUMN_CONFIG);
}
