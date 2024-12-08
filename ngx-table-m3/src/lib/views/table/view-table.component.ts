import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { INgxTable, NgxTableColumn } from '../../ngx-table.interface';

import { ViewValueComponent } from '../value/view-value.component';
import { IViewConfig } from '../view.interface';

interface IColumn<T> {
    readonly title: string;
    readonly columns: NgxTableColumn<T>[];
}

@Component({
    selector: 'view-table',
    imports: [ViewValueComponent],
    templateUrl: './view-table.component.html',
    styleUrl: './view-table.component.scss',
})
export class ViewTableComponent<T> implements OnChanges {
    @Input({ required: true }) ngxTable!: INgxTable<T>;
    @Input({ required: true }) data!: T[];
    @Input({ required: true }) viewConfig!: IViewConfig;

    public hasGroup: boolean = false;
    public columns: IColumn<T>[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        this.hasGroup = this.ngxTable.columns.some((column) => 'columns' in column);
        this.columns = this.ngxTable.columns.map((column) =>
            'columns' in column ? column : { title: '', columns: [column] },
        );
    }
}
