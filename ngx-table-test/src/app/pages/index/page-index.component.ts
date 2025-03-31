import { Component } from '@angular/core';

import { INgxHelperPageGroup, NgxHelperPageGroupComponent } from '@webilix/ngx-helper-m3';

import { PageIndexContentComponent } from './content/page-index-content.component';

@Component({
    host: { selector: 'page-index' },
    imports: [NgxHelperPageGroupComponent],
    templateUrl: './page-index.component.html',
    styleUrl: './page-index.component.scss',
})
export class PageIndexComponent {
    public pageGroup: INgxHelperPageGroup = {
        route: ['/'],
        pages: {
            user: { title: 'مشخصات عضو', icon: 'account_circle', component: PageIndexContentComponent },
            birth: { title: 'اطلاعات تولد', icon: 'cake', component: PageIndexContentComponent },
            others: { title: 'سایر موارد', icon: 'description', component: PageIndexContentComponent },
        },
    };
}
