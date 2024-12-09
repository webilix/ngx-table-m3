import { Injectable } from '@angular/core';

import { INgxTable } from '../ngx-table.interface';

@Injectable()
export class ViewService {
    getTitleIndex<T>(ngxTable: INgxTable<T>): number {
        const index: number = ngxTable.columns.findIndex((l) => l.mode === 'TITLE');
        return index === -1 ? 0 : index;
    }

    getSubTitleIndex<T>(ngxTable: INgxTable<T>): number | undefined {
        const index: number = ngxTable.columns.findIndex((l) => l.mode === 'SUBTITLE');
        return index === -1 ? undefined : index;
    }

    getIcons<T>(ngxTable: INgxTable<T>, data: T[]): { icon: string; color?: string }[] {
        const iconFn = ngxTable.rows?.icon;
        if (!iconFn) return [];

        return data.map((item) => {
            const icon = iconFn(item);
            return typeof icon === 'string' ? { icon } : icon;
        });
    }

    getColors<T>(ngxTable: INgxTable<T>, data: T[]): string[] {
        const colorFn = ngxTable.rows?.color;
        if (!colorFn) return [];

        return data.map((item) => colorFn(item));
    }

    getDeactives<T>(ngxTable: INgxTable<T>, data: T[]): number[] {
        const deactives: number[] = [];
        data.forEach((item: T, index: number) => {
            if (ngxTable.rows?.isDeactive?.(item)) deactives.push(index);
        });

        return deactives;
    }
}
