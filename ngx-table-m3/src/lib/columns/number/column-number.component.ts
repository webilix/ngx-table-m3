import { Component, inject } from '@angular/core';

import { NgxHelperNumberPipe } from '@webilix/ngx-helper-m3';

import { COLUMN_CONFIG, COLUMN_TYPE, COLUMN_VALUE, IColumnConfig } from '../column.interface';

import { IColumnNumber } from './column-number.interface';

@Component({
    host: { selector: 'column-number' },
    imports: [NgxHelperNumberPipe],
    templateUrl: './column-number.component.html',
    styleUrl: './column-number.component.scss',
})
export class ColumnNumberComponent<T> {
    public column: IColumnNumber<T> = inject(COLUMN_TYPE);
    public value: number = inject(COLUMN_VALUE);
    public config: IColumnConfig = inject(COLUMN_CONFIG);
}
