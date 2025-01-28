import { Routes } from '@angular/router';

import { PageIndexComponent } from './pages';

export const routes: Routes = [
    { path: '', component: PageIndexComponent },
    { path: '**', redirectTo: '/' },
];
