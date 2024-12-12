import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Helper } from '@webilix/helper-library';
import { NgxHelperContainerService } from '@webilix/ngx-helper-m3';

import { IViewConfig } from '../views';
import { INgxTable } from '../ngx-table.interface';

import { FilterComponent } from './filter.component';
import { FilterInfo } from './filter.info';
import { IFilter } from './filter.interface';

export type Filters = { [key: string]: IFilter };

@Injectable()
export class FilterService {
    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly ngxHelperContainerService: NgxHelperContainerService,
    ) {}

    getFilters<T>(ngxTable: INgxTable<T>): Filters {
        const filters: Filters = {};

        // CHECK COLUMNS
        ngxTable.columns.forEach((column) => {
            if (!column.tools || !('filter' in column.tools) || !column.tools.filter) return;

            const title: string = column.title || '';
            const key: string = column.tools.id;
            filters[key] = { title, filter: column.tools.filter };
        });

        if (Object.keys(filters).length === 0) return {};

        // CHECK QUERY PARAMS
        const queryParams: { [key: string]: any } = { ...this.activatedRoute.snapshot.queryParams };
        Object.keys(filters).forEach((id: string) => {
            const param: string = queryParams[`ngx-table-filter-${id}`];
            if (!param || !Helper.IS.string(param)) return;

            const column = ngxTable.columns.find((column) => column.tools?.id === id);
            if (!column || !column.tools || !('filter' in column.tools) || !column.tools.filter) return;

            const value = FilterInfo[column.tools.filter.type].methods.value(param, column.tools.filter);
            filters[id] = { ...filters[id], value };
        });

        return filters;
    }

    updateFilter(filter: IFilter, viewConfig: IViewConfig): Promise<IFilter | undefined> {
        return new Promise<IFilter | undefined>((resolve) => {
            this.ngxHelperContainerService
                .init(FilterComponent, filter.title, { data: { filter, viewConfig }, padding: '0' })
                .bottomSheet<{ value: any }>(
                    (response) => resolve({ ...filter, value: response.value }),
                    () => resolve(undefined),
                );
        });
    }
}
