import { Component, Input } from '@angular/core';

import { INgxTable } from '../../ngx-table.interface';

import { IViewConfig } from '../view.interface';

@Component({
    selector: 'view-card',
    imports: [],
    templateUrl: './view-card.component.html',
    styleUrl: './view-card.component.scss',
})
export class ViewCardComponent<T> {
    @Input({ required: true }) ngxTable!: INgxTable<T>;
    @Input({ required: true }) data!: T[];
    @Input({ required: true }) viewConfig!: IViewConfig;
}
