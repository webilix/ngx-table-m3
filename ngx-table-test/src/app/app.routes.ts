import { Routes } from '@angular/router';

import { PageGroupComponent, PageIndexComponent } from './pages';

export const routes: Routes = [
    { path: '', component: PageIndexComponent },
    { path: 'group', component: PageGroupComponent },
    { path: '**', redirectTo: '/' },
];
