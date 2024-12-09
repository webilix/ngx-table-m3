import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { INgxTablePagination } from '../../ngx-table.interface';

import { IViewConfig } from '..';

@Component({
    selector: 'view-pagination',
    host: { '(window:scroll)': 'onScroll($event)' },
    imports: [DecimalPipe, MatIconButton, MatIcon, MatMenuModule],
    templateUrl: './view-pagination.component.html',
    styleUrl: './view-pagination.component.scss',
})
export class ViewPaginationComponent implements OnInit, OnChanges {
    @HostBinding('style.position') private stylePosition!: string;
    @HostBinding('style.bottom') private styleBottom!: string;

    @Input({ required: true }) type!: string;
    @Input({ required: true }) pagination!: INgxTablePagination;
    @Input({ required: true }) viewConfig!: IViewConfig;
    @Input({ required: true }) isMobile!: boolean;
    @Input({ required: true }) stickyBottom?: { desktopView: string; mobileView: string };

    public pages: number[] = [];
    public hasShadow: boolean = false;

    constructor(private readonly elementRef: ElementRef) {}

    ngOnInit(): void {
        setTimeout(this.onScroll.bind(this), 0);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const isDefaultPage = (page: number): boolean => page === 1 || page === this.pagination.page.total;

        const period: number = Math.floor(this.pagination.page.total / 8) || 1;
        const trunc: number = period < 100 ? 10 : period < 1000 ? 100 : 1000;

        this.pages = Array(this.pagination.page.total)
            .fill('0')
            .map((_, index: number) => index + 1)
            .filter((page: number) => page !== this.pagination.page.current)
            .filter((page: number) => isDefaultPage(page) || (page - 1) % period === 0)
            .map((page: number) => (isDefaultPage(page) || period < 10 ? page : page - (page % trunc)));

        this.stylePosition = this.stickyBottom ? 'sticky' : 'static';
        this.styleBottom = this.stickyBottom
            ? this.isMobile
                ? this.stickyBottom.mobileView
                : this.stickyBottom.desktopView
            : '';
    }

    onScroll(): void {
        if (!this.elementRef) return;

        const element: HTMLElement = this.elementRef.nativeElement;
        const elementPosition: number = element.offsetTop + element.offsetHeight + 8;

        const parentHeight = element.parentElement?.offsetHeight;
        this.hasShadow = !!parentHeight && elementPosition < parentHeight;
    }
}
