import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders, Provider } from '@angular/core';

export interface INgxTableConfig {
    readonly mobileWidth: number;
    readonly alternateRows: boolean;
    readonly iconSize: number;
    readonly cssClasses: {
        readonly loader?: string;
        readonly empty?: string;
        readonly en?: string;
        readonly deactive?: string;
    };
    readonly colors: {
        readonly border?: string;
        readonly background?: string;
        readonly headerText?: string;
        readonly headerBackground?: string;
        readonly oddRowsBackground?: string;
        readonly evenRowsBackground?: string;
        readonly cardBackground?: string;
        readonly paginationBackground?: string;
        readonly highlightText?: string;
        readonly highlightBackground?: string;
        readonly inputText?: string;
        readonly inputBackground?: string;
    };
    readonly action: {
        readonly buttonSize?: string;
        readonly buttonColor?: string;
        readonly menuColor?: string;
        readonly warnColor?: string;
        readonly menuTitle?: string;
    };
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
