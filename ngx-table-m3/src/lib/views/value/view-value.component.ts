import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Helper } from '@webilix/helper-library';

import { NgxTableColumn } from '../../ngx-table.interface';

@Component({
    selector: 'view-value',
    imports: [],
    templateUrl: './view-value.component.html',
    styleUrl: './view-value.component.scss',
})
export class ViewValueComponent<T> implements OnChanges {
    @Input({ required: true }) column!: NgxTableColumn<T>;
    @Input({ required: true }) item!: T;

    public value!: any;

    ngOnChanges(changes: SimpleChanges): void {
        this.value = this.getValue();
    }

    getValue(): any {
        const value: any =
            typeof this.column.value === 'function' ? this.column.value(this.item) : this.item[this.column.value];
        if (Helper.IS.empty(value)) return undefined;

        return value;
    }
}
