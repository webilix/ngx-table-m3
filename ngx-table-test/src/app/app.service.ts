import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export type Page = 'INDEX' | 'GROUP';

@Injectable({ providedIn: 'root' })
export class AppService {
    private _page: Page = 'INDEX';
    get page(): Page {
        return this._page;
    }

    private pageChanged: Subject<Page> = new Subject<Page>();
    get onPageChanged(): Observable<Page> {
        return this.pageChanged.asObservable();
    }

    setPage(page: Page) {
        if (page === this._page) return;

        this._page = page;
        this.pageChanged.next(this._page);
    }
}
