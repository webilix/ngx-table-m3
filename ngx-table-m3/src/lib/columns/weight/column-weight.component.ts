import { Component, inject } from '@angular/core';

import { NgxHelperWeightPipe } from '@webilix/ngx-helper-m3';

import { COLUMN_CONFIG, COLUMN_TYPE, COLUMN_VALUE, IColumnConfig } from '../column.interface';

import { IColumnWeight } from './column-weight.interface';

@Component({
    host: { selector: 'column-weight' },
    imports: [NgxHelperWeightPipe],
    templateUrl: './column-weight.component.html',
    styleUrl: './column-weight.component.scss',
})
export class ColumnWeightComponent<T> {
    public column: IColumnWeight<T> = inject(COLUMN_TYPE);
    public value: number = inject(COLUMN_VALUE);
    public config: IColumnConfig = inject(COLUMN_CONFIG);
}
