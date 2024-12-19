import { Component, OnInit } from '@angular/core';

import { INgxHelperPageGroup, NgxHelperPageGroupComponent } from '@webilix/ngx-helper-m3';

import { AppService } from '../../app.service';

import { PageGroupContentComponent } from './content/page-group-content.component';

@Component({
    host: { selector: 'page-group' },
    imports: [NgxHelperPageGroupComponent],
    templateUrl: './page-group.component.html',
    styleUrl: './page-group.component.scss',
})
export class PageGroupComponent implements OnInit {
    public pageGroup: INgxHelperPageGroup = {
        route: ['/group'],
        pages: {
            info: { title: 'مشخصات عضو', icon: 'account_circle', component: PageGroupContentComponent },
            birth: { title: 'اطلاعات تولد', icon: 'cake', component: PageGroupContentComponent },
        },
    };

    constructor(private readonly appService: AppService) {}

    ngOnInit(): void {
        this.appService.setPage('GROUP');
    }
}
