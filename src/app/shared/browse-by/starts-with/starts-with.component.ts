import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { PageInfo } from '../../../core/shared/page-info.model';
import { isNotEmpty } from '../../empty.util';
import { Router } from '@angular/router';
import { debounceTime, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'ds-starts-with',
    styleUrls: ['./starts-with.component.scss'],
    templateUrl: './starts-with.component.html'
})
/**
 * Filter browse lists with starts-with character(s)
 */
export class StartsWithComponent implements OnInit {
    @Input() currentUrl: string;
    @Input() pageInfo: PageInfo;
    alphabets: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    constructor(private router: Router) {
    }

    ngOnInit(): void {
        const startsWithInput  = document.getElementById('starts-with-input');
        Observable.fromEvent(startsWithInput, 'keyup')
            .pipe(map((i: any) => i.currentTarget.value))
            .pipe(debounceTime(300))
            .distinctUntilChanged()
            .subscribe((startsWith) => {
                this.updateUrl(startsWith);
            })
    }

    onSubmit(data: any) {
        if (isNotEmpty(data)) {
            this.updateUrl(this.pageInfo.startsWith);
        }
    }

    updateUrl(startsWith: string) {
        this.router.navigate([this.currentUrl], {
            queryParams: { startsWith: startsWith },
            queryParamsHandling: 'merge'
        });
    }
}
