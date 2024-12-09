export interface IViewConfig {
    readonly alternateRows: boolean;
    readonly iconSize: string;
    // CSS CLASSES
    readonly enClass: string;
    readonly deactiveClass: string;
    // COLORS
    readonly borderColor: string;
    readonly headerTextColor: string;
    readonly headerBackgroundColor: string;
    readonly oddRowsBackgroundColor: string;
    readonly evenRowsBackgroundColor: string;
    readonly paginationBackgroundColor: string;
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
