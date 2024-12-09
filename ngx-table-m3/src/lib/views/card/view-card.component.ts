import { Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';

import { MatIcon } from '@angular/material/icon';

import { INgxTable } from '../../ngx-table.interface';

import { ViewActionComponent } from '../action/view-action.component';
import { ViewValueComponent } from '../value/view-value.component';
import { ViewService } from '../view.service';
import { IViewConfig } from '..';

@Component({
    selector: 'view-card',
    imports: [MatIcon, ViewActionComponent, ViewValueComponent],
    providers: [ViewService],
    templateUrl: './view-card.component.html',
    styleUrl: './view-card.component.scss',
})
export class ViewCardComponent<T> implements OnChanges {
    @HostBinding('style.--oddRowsBackgroundColor') private oddRowsBackgroundColor!: string;
    @HostBinding('style.--evenRowsBackgroundColor') private evenRowsBackgroundColor!: string;

    @Input({ required: true }) ngxTable!: INgxTable<T>;
    @Input({ required: true }) data!: T[];
    @Input({ required: true }) viewConfig!: IViewConfig;

    public hasIcon: boolean = false;
    public hasAction: boolean = false;

    public titleIndex!: number;
    public subTitleIndex?: number;

    public icons: { icon: string; color?: string }[] = [];
    public colors: string[] = [];
    public deactives: number[] = [];

    public hasContent!: boolean;

    constructor(private readonly viewService: ViewService) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.oddRowsBackgroundColor = this.viewConfig.alternateRows ? this.viewConfig.oddRowsBackgroundColor : '';
        this.evenRowsBackgroundColor = this.viewConfig.alternateRows ? this.viewConfig.evenRowsBackgroundColor : '';

        this.hasIcon = !!this.ngxTable.rows?.icon;
        this.hasAction = (this.ngxTable.actions || []).length > 0;

        this.titleIndex = this.viewService.getTitleIndex(this.ngxTable);
        this.subTitleIndex = this.viewService.getSubTitleIndex(this.ngxTable);

        this.icons = this.viewService.getIcons(this.ngxTable, this.data);
        this.colors = this.viewService.getColors(this.ngxTable, this.data);
        this.deactives = this.viewService.getDeactives(this.ngxTable, this.data);

        this.hasContent = this.ngxTable.columns.some(
            (_, index: number) => index != this.titleIndex && index !== this.subTitleIndex,
        );
    }
}
