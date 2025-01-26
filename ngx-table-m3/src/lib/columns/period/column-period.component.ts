import { Component, inject } from '@angular/core';

import { NgxHelperPeriodPipe } from '@webilix/ngx-helper-m3';

import { COLUMN_CONFIG, COLUMN_TYPE, COLUMN_VALUE, IColumnConfig } from '../column.interface';

import { IColumnPeriod } from './column-period.interface';

@Component({
    host: { selector: 'column-period' },
    imports: [NgxHelperPeriodPipe],
    templateUrl: './column-period.component.html',
    styleUrl: './column-period.component.scss',
})
export class ColumnPeriodComponent<T> {
    public column: IColumnPeriod<T> = inject(COLUMN_TYPE);
    public value: { from: Date; to: Date } = inject(COLUMN_VALUE);
    public config: IColumnConfig = inject(COLUMN_CONFIG);
}
