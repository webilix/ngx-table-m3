import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders, Provider } from '@angular/core';

export interface INgxTableConfig {
    readonly mobileWidth: number;
    readonly loaderClass: string;
    readonly emptyClass: string;
    readonly headerClass: string;
    readonly subValueClass: string;
    readonly enClass: string;
    readonly stickyView: {
        readonly headerTop?:
            | string
            | {
                  readonly desktopView: string;
                  readonly mobileView: string;
              };
        readonly paginationBottom?:
            | string
            | {
                  readonly desktopView: string;
                  readonly mobileView: string;
              };
    };
}

export const NGX_TABLE_CONFIG = new InjectionToken<Partial<INgxTableConfig>>('NGX-TABLE-CONFIG');

export const provideNgxTableConfig = (config: Partial<INgxTableConfig>): EnvironmentProviders => {
    const providers: Provider[] = [{ provide: NGX_TABLE_CONFIG, useValue: config }];

    return makeEnvironmentProviders(providers);
};
