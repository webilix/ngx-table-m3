import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders, Provider } from '@angular/core';

export interface INgxTableConfig {
    readonly mobileWidth: number;
    readonly alternateRows: boolean;
    readonly iconSize: number;
    readonly emojiSize: number;
    readonly actionMenuTitle?: string;
    readonly stickyView: {
        readonly top?: string | { readonly desktopView: string; readonly mobileView: string };
        readonly bottom?: string | { readonly desktopView: string; readonly mobileView: string };
    };
}

export const NGX_TABLE_CONFIG = new InjectionToken<Partial<INgxTableConfig>>('NGX-TABLE-CONFIG');

export const provideNgxTableConfig = (config: Partial<INgxTableConfig>): EnvironmentProviders => {
    const providers: Provider[] = [{ provide: NGX_TABLE_CONFIG, useValue: config }];

    return makeEnvironmentProviders(providers);
};
