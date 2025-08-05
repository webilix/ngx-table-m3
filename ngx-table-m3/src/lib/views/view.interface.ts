export interface IViewConfig {
    readonly alternateRows: boolean;
    readonly iconSize: string;
    readonly emojiSize: string;
    readonly actionMenuTitle: string;
    readonly minimalCardView: boolean;
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
