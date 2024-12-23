import { Component, inject } from '@angular/core';

import { NgxHelperFileSizePipe } from '@webilix/ngx-helper-m3';

import { COLUMN_CONFIG, COLUMN_TYPE, COLUMN_VALUE, IColumnConfig } from '../column.interface';

import { IColumnFileSize } from './column-file-size.interface';

@Component({
    host: { selector: 'column-file-size' },
    imports: [NgxHelperFileSizePipe],
    templateUrl: './column-file-size.component.html',
    styleUrl: './column-file-size.component.scss',
})
export class ColumnFileSizeComponent<T> {
    public column: IColumnFileSize<T> = inject(COLUMN_TYPE);
    public value: number = inject(COLUMN_VALUE);
    public config: IColumnConfig = inject(COLUMN_CONFIG);
}
