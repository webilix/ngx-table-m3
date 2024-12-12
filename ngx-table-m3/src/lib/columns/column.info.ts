import { ComponentType } from '@angular/cdk/portal';

import { NgxTableColumn } from '../ngx-table.interface';

import {
    ColumnDateComponent,
    ColumnDateMethods,
    ColumnMethods,
    ColumnMobileComponent,
    ColumnMobileMethods,
    ColumnTextComponent,
    ColumnTextMethods,
} from '.';

export const ColumnInfo: {
    [key in NgxTableColumn<any>['type']]: {
        readonly methods: ColumnMethods<any, any>;
        readonly component: ComponentType<any>;
    };
} = {
    DATE: { methods: new ColumnDateMethods(), component: ColumnDateComponent },
    MOBILE: { methods: new ColumnMobileMethods(), component: ColumnMobileComponent },
    TEXT: { methods: new ColumnTextMethods(), component: ColumnTextComponent },
};
