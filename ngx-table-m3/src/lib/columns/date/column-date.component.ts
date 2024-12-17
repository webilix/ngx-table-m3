import { Component, inject } from '@angular/core';

import { NgxHelperDatePipe } from '@webilix/ngx-helper-m3';

import { COLUMN_CONFIG, COLUMN_TYPE, COLUMN_VALUE, IColumnConfig } from '../column.interface';

import { IColumnDate } from './column-date.interface';

@Component({
    host: { selector: 'column-date' },
    imports: [NgxHelperDatePipe],
    templateUrl: './column-date.component.html',
    styleUrl: './column-date.component.scss',
})
export class ColumnDateComponent<T> {
    public column: IColumnDate<T> = inject(COLUMN_TYPE);
    public value: Date = inject(COLUMN_VALUE);
    public config: IColumnConfig = inject(COLUMN_CONFIG);
}
