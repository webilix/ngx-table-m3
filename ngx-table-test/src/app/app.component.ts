import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit, RendererFactory2 } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { AppService, Page } from './app.service';

type ColorMode = 'LIGHT' | 'DARK';

@Component({
    selector: 'app-root',
    host: { '(window:keydown)': 'onKeydown($event)', '(window:resize)': 'onResize($event)' },
    imports: [RouterOutlet, MatButton, MatIcon],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
    @HostBinding('style.--header-height') headerHeight: string = '95px';

    public isMobile!: boolean;
    public colorMode!: ColorMode;

    public page!: Page;
    private onPageChanged!: Subscription;

    constructor(
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly router: Router,
        private readonly rendererFactory: RendererFactory2,
        private readonly appService: AppService,
    ) {
        this.router.events.forEach((event) => {
            if (event instanceof NavigationError || event instanceof NavigationEnd || event instanceof NavigationCancel)
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        });
    }

    ngOnInit(): void {
        this.page = this.appService.page;
        this.onPageChanged = this.appService.onPageChanged.subscribe({
            next: (page: Page) => {
                this.page = page;
                this.changeDetectorRef.detectChanges();
            },
        });

        let colorMode: ColorMode = 'LIGHT';
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) colorMode = 'DARK';
        const mode = localStorage.getItem('ColorMode');
        if (mode === 'DARK') colorMode = 'DARK';
        if (mode === 'LIGHT') colorMode = 'LIGHT';
        this.toggleMode(colorMode);

        this.onResize();
    }

    ngOnDestroy(): void {
        this.onPageChanged.unsubscribe();
    }

    onKeydown(event: any): void {
        if (!(event instanceof KeyboardEvent)) return;

        // Use CTRL + SHIFT + ALT + C to toggle mode
        if (event.ctrlKey && event.shiftKey && event.altKey && event.code === 'KeyC') {
            event.preventDefault();
            this.toggleMode();
        }
    }

    onResize(): void {
        this.isMobile = window.innerWidth <= 600;
        this.headerHeight = this.isMobile ? '55px' : '95px';
    }

    togglePage(): void {
        console.log(this.page);
        const route: string[] = this.page === 'INDEX' ? ['/group'] : ['/'];
        this.router.navigate(route);
    }

    toggleMode(colorMode?: ColorMode): void {
        this.colorMode = colorMode || (this.colorMode === 'DARK' ? 'LIGHT' : 'DARK');
        localStorage.setItem('ColorMode', this.colorMode);

        const renderer = this.rendererFactory.createRenderer(null, null);
        if (this.colorMode === 'LIGHT') {
            renderer.removeClass(document.body, 'dark');
        } else {
            renderer.addClass(document.body, 'dark');
        }
    }
}
