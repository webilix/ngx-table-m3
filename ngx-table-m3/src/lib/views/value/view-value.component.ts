import { Component, HostBinding, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';

import { MatIcon } from '@angular/material/icon';

import { Helper } from '@webilix/helper-library';

import { COLUMN_CONFIG, COLUMN_TYPE, COLUMN_VALUE, ColumnInfo, IColumnConfig } from '../../columns';
import { NgxTableColumn } from '../../ngx-table.interface';

import { IViewConfig } from '../view.interface';
import { ViewService } from '../view.service';

@Component({
    selector: 'view-value',
    imports: [NgComponentOutlet, ClipboardModule, MatIcon],
    templateUrl: './view-value.component.html',
    styleUrl: './view-value.component.scss',
})
export class ViewValueComponent<T> implements OnChanges {
    @HostBinding('className') private className: string = 'ngx-table-m3-value';
    @HostBinding('style.text-align') private textAlign: string = 'left';

    @Input({ required: true }) column!: NgxTableColumn<T>;
    @Input({ required: true }) item!: T;
    @Input({ required: true }) viewConfig!: IViewConfig;
    @Input({ required: false }) isDeactive?: boolean;
    @Input({ required: false }) isCard?: boolean;
    @Input({ required: false }) isCardTitle?: boolean;
    @Input({ required: false }) isCardSubTitle?: boolean;

    public columnInfo = ColumnInfo;
    public injector!: Injector;

    public value!: any;
    public subValue?: { value: string; isEN: boolean };
    public color?: string;
    public hasClick!: boolean;
    public copyText?: string;

    public isCopied: boolean = false;
    private copyTimeout: any;

    constructor(private readonly router: Router, private readonly viewService: ViewService) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.textAlign = this.isCard ? 'right' : (this.column.textAlign || 'RIGHT').toLocaleLowerCase();

        this.value = this.viewService.getValue(this.column, this.item);
        this.subValue = this.getSubValue();
        this.color = this.column.color
            ? typeof this.column.color === 'function'
                ? this.column.color(this.item) || undefined
                : this.column.color
            : undefined;
        this.hasClick = 'onClick' in this.column && !!this.column.onClick;
        this.copyText =
            !this.hasClick && 'onCopy' in this.column && this.column.onCopy ? this.column.onCopy(this.item) : undefined;

        const columnConfig: IColumnConfig = {
            isEN:
                'english' in this.column && this.column.english
                    ? typeof this.column.english === 'function'
                        ? this.column.english(this.item)
                        : this.column.english
                    : false,
            isDeactive: !!this.isDeactive,
        };
        this.injector = Injector.create({
            providers: [
                { provide: COLUMN_TYPE, useValue: this.column },
                { provide: COLUMN_VALUE, useValue: this.value },
                { provide: COLUMN_CONFIG, useValue: columnConfig },
            ],
        });
    }

    getSubValue(): { value: string; isEN: boolean } | undefined {
        if (!('subValue' in this.column) || !this.column.subValue) return undefined;

        if (typeof this.column.subValue === 'function') {
            const subValue = this.column.subValue(this.item);
            if (subValue === undefined || Helper.IS.empty(subValue)) return undefined;

            return {
                value: typeof subValue === 'string' ? subValue : subValue.value,
                isEN: typeof subValue === 'string' ? false : !!subValue.english,
            };
        } else {
            const subValue: any = this.item[this.column.subValue];
            if (Helper.IS.empty(subValue)) return undefined;

            return { value: subValue, isEN: false };
        }
    }

    onClick(): void {
        if (!('onClick' in this.column) || !this.column.onClick) return;

        const onClick = this.column.onClick(this.item);
        if (typeof onClick === 'function') onClick();
        else this.router.navigate(onClick);
    }

    onCopy(): void {
        if (!this.copyText) return;
        if (this.copyTimeout) clearTimeout(this.copyTimeout);

        this.isCopied = true;
        this.copyTimeout = setTimeout(() => {
            this.isCopied = false;
            this.copyTimeout = undefined;
        }, 2000);
    }
}
