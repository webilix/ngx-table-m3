export interface IViewConfig {
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
