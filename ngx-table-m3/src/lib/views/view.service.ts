import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INgxTable } from '../ngx-table.interface';

type OrderType = 'ASC' | 'DESC';
interface IOrder {
    readonly title: string;
    readonly type: 'ORDER' | OrderType;
    readonly initial: OrderType;
    readonly current?: OrderType;
}
export type Orders = { [key: string]: IOrder };

@Injectable()
export class ViewService {
    constructor(private readonly activatedRoute: ActivatedRoute) {}

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
            return typeof icon === 'string' ? { icon } : { icon: icon.icon, color: icon.color || undefined };
        });
    }

    getColors<T>(ngxTable: INgxTable<T>, data: T[]): string[] {
        const colorFn = ngxTable.rows?.color;
        if (!colorFn) return [];

        return data.map((item) => colorFn(item) || '');
    }

    getDescriptions<T>(ngxTable: INgxTable<T>, data: T[]): (string | undefined)[] {
        const descriptionFn = ngxTable.rows?.description;
        if (!descriptionFn) return [];

        return data.map((item) => descriptionFn(item) || undefined);
    }

    getDeactives<T>(ngxTable: INgxTable<T>, data: T[]): number[] {
        const deactives: number[] = [];
        data.forEach((item: T, index: number) => {
            if (ngxTable.rows?.isDeactive?.(item)) deactives.push(index);
        });

        return deactives;
    }

    getOrders<T>(ngxTable: INgxTable<T>): Orders {
        let defaultFound: boolean = false;
        const orders: Orders = {};

        // CHECK COLUMNS
        ngxTable.columns.forEach((column) => {
            if (!column.tools || !('order' in column.tools) || !column.tools.order) return;

            const title: string = column.title || '';
            const key: string = column.tools.id;
            const type: 'ORDER' | OrderType = column.tools.order.type || 'ORDER';
            const initial: OrderType = type !== 'ORDER' ? type : column.tools.order.initial || 'ASC';
            const isDefault: boolean = !defaultFound && !!column.tools.order.isDefault;

            orders[key] = { title, type, initial, current: isDefault ? initial : undefined };
            if (isDefault) defaultFound = true;
        });

        if (Object.keys(orders).length === 0) return {};

        // CHECK QUERY PARAMS
        const queryParams: { [key: string]: any } = { ...this.activatedRoute.snapshot.queryParams };
        if (!!ngxTable.route && queryParams['ngx-table-order']) {
            const param: string = queryParams['ngx-table-order'];
            const index: number = param.lastIndexOf(':');

            if (index !== -1) {
                const id: string = param.substring(0, index);
                const type: 'ASC' | 'DESC' = param.substring(index + 1) as 'ASC' | 'DESC';

                if (
                    orders[id] &&
                    (type === 'ASC' || type === 'DESC') &&
                    (orders[id].type === 'ORDER' || orders[id].type === type)
                ) {
                    Object.keys(orders).forEach((key: string) => {
                        orders[key] = { ...orders[key], current: key === id ? type : undefined };
                    });
                }
            }
        }

        return orders;
    }
}
