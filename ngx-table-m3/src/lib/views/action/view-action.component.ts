import { Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { NgxTableAction } from '../../ngx-table.interface';

import { IViewConfig } from '../view.interface';

interface Action<T> {
    readonly title: string;
    readonly icon: string;
    readonly action: (data: T) => string[] | void;
    readonly color?: string;
    readonly isDisabled: boolean;
}

@Component({
    selector: 'view-action',
    imports: [MatButton, MatDivider, MatIconButton, MatIcon, MatMenuModule],
    templateUrl: './view-action.component.html',
    styleUrl: './view-action.component.scss',
})
export class ViewActionComponent<T> implements OnChanges {
    @HostBinding('className') protected className: string = 'ngx-table-m3-action';

    @Input({ required: true }) actions!: NgxTableAction<T>[];
    @Input({ required: true }) item!: T;
    @Input({ required: true }) viewConfig!: IViewConfig;
    @Input({ required: true }) isMobile!: boolean;

    public inRow: Action<T>[] = [];
    public inMenu: ('DIVIDER' | Action<T>)[] = [];

    constructor(private readonly router: Router) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.inRow = [];
        this.inMenu = [];

        this.actions.forEach((action: NgxTableAction<T>) => {
            if (action === 'DIVIDER') {
                if (this.inMenu.length === 0) return;
                if (this.inMenu[this.inMenu.length - 1] === 'DIVIDER') return;

                this.inMenu.push('DIVIDER');
                return;
            }

            if (action.hideOn && action.hideOn(this.item)) return;

            let item: Action<T> | undefined = undefined;
            const isDisabled: boolean = !!action.disableOn && action.disableOn(this.item);

            switch (action.type) {
                case 'ACTION':
                    item = {
                        title: action.title,
                        icon: action.icon,
                        action: action.action,
                        color: action.color,
                        isDisabled,
                    };
                    break;

                case 'UPDATE':
                    item = { title: 'ویرایش', icon: 'edit', action: action.action, isDisabled };
                    break;

                case 'DELETE':
                    item = {
                        title: 'حذف',
                        icon: 'delete',
                        color: 'var(--error)',
                        action: action.action,
                        isDisabled,
                    };
                    break;

                case 'STATUS':
                    const isDeactive: boolean = action.isDeactive(this.item);
                    item = {
                        title: isDeactive ? 'فعال کردن' : 'غیرفعال کردن',
                        icon: isDeactive ? 'check_box' : 'disabled_by_default',
                        color: isDeactive ? undefined : 'var(--error)',
                        action: (data: T) => action.action(data, isDeactive),
                        isDisabled,
                    };
                    break;

                case 'LOG':
                    item = {
                        title: 'گزارش تغییرات',
                        icon: 'published_with_changes',
                        action: action.action,
                        isDisabled,
                    };
                    break;
            }

            if (!item) return;
            action.standalone ? this.inRow.push(item) : this.inMenu.push(item);
        });

        while (this.inMenu[this.inMenu.length - 1] === 'DIVIDER') this.inMenu.splice(this.inMenu.length - 1, 1);

        if (this.inMenu.length === 1 && this.inMenu[0] !== 'DIVIDER') {
            this.inRow.push(this.inMenu[0]);
            this.inMenu = [];
        }
    }

    onClick(action: (data: T) => string[] | void): void {
        const result = action(this.item);
        if (result) this.router.navigate(result);
    }
}
