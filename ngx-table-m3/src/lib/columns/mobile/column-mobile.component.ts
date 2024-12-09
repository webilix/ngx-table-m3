import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';

import { NgxHelperMobilePipe } from '@webilix/ngx-helper-m3';

import { COLUMN_CONFIG, COLUMN_TYPE, COLUMN_VALUE, IColumnConfig } from '../column.interface';

import { IColumnMobile } from './column-mobile.interface';

@Component({
    host: { selector: 'column-mobile' },
    imports: [NgClass, NgxHelperMobilePipe],
    templateUrl: './column-mobile.component.html',
    styleUrl: './column-mobile.component.scss',
})
export class ColumnMobileComponent<T> {
    public column: IColumnMobile<T> = inject(COLUMN_TYPE);
    public value: string = inject(COLUMN_VALUE);
    public config: IColumnConfig = inject(COLUMN_CONFIG);
}
