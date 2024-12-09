import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { provideNgxTableConfig } from '@webilix/ngx-table-m3';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideNgxTableConfig({
            mobileWidth: 900,
            alternateRows: true,
            stickyView: {
                headerTop: { desktopView: 'calc(95px + 1rem)', mobileView: 'calc(55px + 1rem)' },
                paginationBottom: { desktopView: '1rem', mobileView: 'calc(50px + 1rem)' },
            },
        }),
    ],
};
