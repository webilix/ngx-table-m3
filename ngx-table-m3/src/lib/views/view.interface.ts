export interface IViewConfig {
    readonly alternateRows: boolean;
    readonly iconSize: string;
    // CSS CLASSES
    readonly enClass: string;
    readonly deactiveClass: string;
    // COLORS
    readonly borderColor: string;
    readonly backgroundColor: string;
    readonly headerTextColor: string;
    readonly headerBackgroundColor: string;
    readonly oddRowsBackgroundColor: string;
    readonly evenRowsBackgroundColor: string;
    readonly cardBackgroundColor: string;
    readonly paginationBackgroundColor: string;
    readonly highlightText: string;
    readonly highlightBackground: string;
    readonly inputText: string;
    readonly inputBackground: string;
    // ACTION
    readonly actionButtonSize: string;
    readonly actionButtonColor: string;
    readonly actionMenuColor: string;
    readonly actionWarnColor: string;
    readonly actionMenuTitle: string;
    // STICKY
    readonly stickyView?: {
        readonly top?: { readonly desktopView: string; readonly mobileView: string };
        readonly bottom?: { readonly desktopView: string; readonly mobileView: string };
    };
}

export interface IViewOrder {
    readonly id: string;
    readonly type: 'ASC' | 'DESC';
}

export interface IViewFilter {
    readonly id: string;
    readonly value: any;
}
