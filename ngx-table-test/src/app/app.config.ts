import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideNgxHelperConfig } from '@webilix/ngx-helper-m3';
import { provideNgxTableConfig } from '@webilix/ngx-table-m3';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),

        // NGX-TABLE
        provideNgxHelperConfig({
            mobileWidth: 900,
            pageGroupSidebarWidth: '275px',
            stickyView: {
                top: { desktopView: 'calc(95px + 1rem)', mobileView: 'calc(55px + 1rem)' },
                bottom: { desktopView: '1rem', mobileView: 'calc(50px + 1rem)' },
            },
        }),
        provideNgxTableConfig({
            mobileWidth: 900,
            alternateRows: true,
            stickyView: {
                top: { desktopView: 'calc(95px + 1rem)', mobileView: 'calc(55px + 1rem)' },
                bottom: { desktopView: '1rem', mobileView: 'calc(50px + 1rem)' },
            },
        }),
    ],
};
