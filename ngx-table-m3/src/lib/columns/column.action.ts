export interface IAction<T> {
    readonly type: 'ACTION';
    readonly title: string;
    readonly icon: string;
    readonly action: (data: T) => string[] | void;
    readonly color?: 'primary' | 'error';
    readonly inRow?: boolean;

    disableOn?: (data: T) => boolean;
    hideOn?: (data: T) => boolean;
}

export interface IActionUpdate<T> extends Omit<IAction<T>, 'type' | 'title' | 'icon' | 'color'> {
    readonly type: 'UPDATE';
}

export interface IActionDelete<T> extends Omit<IAction<T>, 'type' | 'title' | 'icon' | 'color'> {
    readonly type: 'DELETE';
}

export interface IActionStatus<T> extends Omit<IAction<T>, 'type' | 'title' | 'icon' | 'action' | 'color'> {
    readonly type: 'STATUS';
    readonly action: (data: T, active: boolean) => string[] | void;
    readonly isActive: (data: T) => boolean;
}

export interface IActionLog<T> extends Omit<IAction<T>, 'type' | 'title' | 'icon' | 'color'> {
    readonly type: 'LOG';
}
