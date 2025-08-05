import { ComponentType } from '@angular/cdk/portal';

import { NgxTableColumn } from '../ngx-table.interface';

import {
    ColumnDateComponent,
    ColumnDateMethods,
    ColumnDurationComponent,
    ColumnDurationMethods,
    ColumnFileSizeComponent,
    ColumnFileSizeMethods,
    ColumnMethods,
    ColumnMobileComponent,
    ColumnMobileMethods,
    ColumnNumberComponent,
    ColumnNumberMethods,
    ColumnPeriodComponent,
    ColumnPeriodMethods,
    ColumnTagComponent,
    ColumnTagMethods,
    ColumnTextComponent,
    ColumnTextMethods,
    ColumnWeightComponent,
    ColumnWeightMethods,
} from '.';

export const ColumnInfo: {
    [key in NgxTableColumn<any>['type']]: {
        readonly methods: ColumnMethods<any, any>;
        readonly component: ComponentType<any>;
    };
} = {
    DATE: { methods: new ColumnDateMethods(), component: ColumnDateComponent },
    DURATION: { methods: new ColumnDurationMethods(), component: ColumnDurationComponent },
    'FILE-SIZE': { methods: new ColumnFileSizeMethods(), component: ColumnFileSizeComponent },
    MOBILE: { methods: new ColumnMobileMethods(), component: ColumnMobileComponent },
    NUMBER: { methods: new ColumnNumberMethods(), component: ColumnNumberComponent },
    PERIOD: { methods: new ColumnPeriodMethods(), component: ColumnPeriodComponent },
    TAG: { methods: new ColumnTagMethods(), component: ColumnTagComponent },
    TEXT: { methods: new ColumnTextMethods(), component: ColumnTextComponent },
    WEIGHT: { methods: new ColumnWeightMethods(), component: ColumnWeightComponent },
};
