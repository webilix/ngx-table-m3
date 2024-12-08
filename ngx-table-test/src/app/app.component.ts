import { Component, HostBinding, OnInit, RendererFactory2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatIcon } from '@angular/material/icon';

type ColorMode = 'LIGHT' | 'DARK';

@Component({
    selector: 'app-root',
    host: { '(window:keydown)': 'onKeydown($event)', '(window:resize)': 'onResize($event)' },
    imports: [RouterOutlet, MatIcon],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    @HostBinding('style.--header-height') headerHeight: string = '95px';

    public isMobile!: boolean;
    public colorMode!: ColorMode;

    constructor(private readonly rendererFactory: RendererFactory2) {}

    ngOnInit(): void {
        let colorMode: ColorMode = 'LIGHT';
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) colorMode = 'DARK';
        const mode = localStorage.getItem('ColorMode');
        if (mode === 'DARK') colorMode = 'DARK';
        if (mode === 'LIGHT') colorMode = 'LIGHT';
        this.toggleMode(colorMode);

        this.onResize();
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
