import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ScriptDataService } from '../../scripts/script-data.service';
import { Script } from '../../scripts/script.model';
import { Observable, Subscription } from 'rxjs';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../core/shared/operators';
import { PaginatedList } from '../../../core/data/paginated-list';
import { distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { hasValue, hasValueOperator } from '../../../shared/empty.util';

const SCRIPT_QUERY_PARAMETER = 'script';

@Component({
  selector: 'ds-scripts-select',
  templateUrl: './scripts-select.component.html',
  styleUrls: ['./scripts-select.component.scss']
})
export class ScriptsSelectComponent implements OnInit, OnDestroy {
  @Output() select: EventEmitter<Script> = new EventEmitter<Script>();
  scripts$: Observable<Script[]>;
  private _selectedScript: Script;
  private routeSub: Subscription;

  constructor(
    private scriptService: ScriptDataService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.scripts$ = this.scriptService.findAll({ elementsPerPage: Number.MAX_SAFE_INTEGER })
      .pipe(
        getSucceededRemoteData(),
        getRemoteDataPayload(),
        map((paginatedList: PaginatedList<Script>) => paginatedList.page)
      );

    this.routeSub = this.route.queryParams
      .pipe(
        map((params: Params) => params[SCRIPT_QUERY_PARAMETER]),
        distinctUntilChanged(),
        switchMap((id: string) =>
          this.scripts$
            .pipe(
              take(1),
              map((scripts) =>
                scripts.find((script) => script.id === id)
              )
            )
        )
      ).subscribe((script: Script) => {
        this._selectedScript = script;
        this.select.emit(script);
      });
  }

  get selectedScript(): string {
    return this._selectedScript ? this._selectedScript.id : undefined;
  }

  set selectedScript(value: string) {
    this.router.navigate([],
      {
        queryParams: { [SCRIPT_QUERY_PARAMETER]: value },
        queryParamsHandling: 'merge'
      }
    );
  }

  ngOnDestroy(): void {
    if (hasValue(this.routeSub)) {
      this.routeSub.unsubscribe();
    }
  }
}
