import { ComponentType } from '@angular/cdk/portal';

import {
    Filter,
    FilterDateComponent,
    FilterDateMethods,
    FilterMethods,
    FilterMultiSelectComponent,
    FilterMultiSelectMethods,
    FilterNumberComponent,
    FilterNumberMethods,
    FilterSearchComponent,
    FilterSearchMethods,
    FilterSelectComponent,
    FilterSelectMethods,
} from '.';

export const FilterInfo: {
    [key in Filter['type']]: {
        readonly methods: FilterMethods<any, any>;
        readonly component: ComponentType<any>;
    };
} = {
    DATE: { methods: new FilterDateMethods(), component: FilterDateComponent },
    'MULTI-SELECT': { methods: new FilterMultiSelectMethods(), component: FilterMultiSelectComponent },
    NUMBER: { methods: new FilterNumberMethods(), component: FilterNumberComponent },
    SEARCH: { methods: new FilterSearchMethods(), component: FilterSearchComponent },
    SELECT: { methods: new FilterSelectMethods(), component: FilterSelectComponent },
};
