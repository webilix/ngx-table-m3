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
    // ACTION
    readonly actionButtonSize: string;
    readonly actionButtonColor: string;
    readonly actionMenuColor: string;
    readonly actionWarnColor: string;
    readonly actionMenuTitle: string;
    // STICKY
    readonly stickyView?: {
        readonly headerTop?: {
            readonly desktopView: string;
            readonly mobileView: string;
        };
        readonly paginationBottom?: {
            readonly desktopView: string;
            readonly mobileView: string;
        };
    };
}

export interface IViewOrder {
    readonly id: string;
    readonly type: 'ASC' | 'DESC';
}
