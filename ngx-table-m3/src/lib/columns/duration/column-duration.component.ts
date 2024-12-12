import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';

import { NgxHelperDurationPipe } from '@webilix/ngx-helper-m3';

import { COLUMN_CONFIG, COLUMN_TYPE, COLUMN_VALUE, IColumnConfig } from '../column.interface';

import { IColumnDuration } from './column-duration.interface';

@Component({
    host: { selector: 'column-duration' },
    imports: [NgClass, NgxHelperDurationPipe],
    templateUrl: './column-duration.component.html',
    styleUrl: './column-duration.component.scss',
})
export class ColumnDurationComponent<T> {
    public column: IColumnDuration<T> = inject(COLUMN_TYPE);
    public value: number = inject(COLUMN_VALUE);
    public config: IColumnConfig = inject(COLUMN_CONFIG);
}
