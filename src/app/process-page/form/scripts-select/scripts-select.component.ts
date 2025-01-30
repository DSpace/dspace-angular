import { Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { ScriptDataService } from '../../../core/data/processes/script-data.service';
import { Script } from '../../scripts/script.model';
import { BehaviorSubject, Subscription, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  getRemoteDataPayload,
  getFirstCompletedRemoteData
} from '../../../core/shared/operators';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { ActivatedRoute, Router } from '@angular/router';
import { hasValue } from '../../../shared/empty.util';
import { ControlContainer, NgForm } from '@angular/forms';
import { controlContainerFactory } from '../process-form.component';
import { FindListOptions } from '../../../core/data/find-list-options.model';

const SCRIPT_QUERY_PARAMETER = 'script';

/**
 * Component used to select a script
 */
@Component({
  selector: 'ds-scripts-select',
  templateUrl: './scripts-select.component.html',
  styleUrls: ['./scripts-select.component.scss'],
  viewProviders: [ { provide: ControlContainer,
    useFactory: controlContainerFactory,
    deps: [[new Optional(), NgForm]] } ]
})
export class ScriptsSelectComponent implements OnInit, OnDestroy {
  /**
   * Emits the selected script when the selection changes
   */
  @Output() select: EventEmitter<Script> = new EventEmitter<Script>();
  /**
   * All available scripts
   */
  scripts: Script[] = [];

  private _selectedScript: Script;
  private routeSub: Subscription;

  private _isLastPage = false;

  scriptOptions: FindListOptions = {
    elementsPerPage: 20,
    currentPage: 1,
  };

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private scriptService: ScriptDataService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  /**
   * Sets all available scripts
   * Checks if the route contains a script ID and auto selects this scripts
   */
  ngOnInit() {
    this.loadScripts();
  }

  /**
   * Load the scripts and check if the route contains a script
   */
  loadScripts() {
    if (this.isLoading$.value) {return;}
    this.isLoading$.next(true);

    this.routeSub = this.scriptService.findAll(this.scriptOptions).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      tap((paginatedList: PaginatedList<Script>) => {
        this._isLastPage = paginatedList?.pageInfo?.currentPage >= paginatedList?.pageInfo?.totalPages;
      }),
      map((paginatedList: PaginatedList<Script>) => paginatedList.page),
    ).subscribe((newScripts: Script[]) => {
      this.scripts = [...this.scripts, ...newScripts];
      this.isLoading$.next(false);

      const param = this.route.snapshot.queryParams[SCRIPT_QUERY_PARAMETER];
      if (hasValue(param)) {
        this._selectedScript = this.scripts.find((script) => script.id === param);
        this.select.emit(this._selectedScript);
      }
    });
  }

  /**
   * Load more scripts when the user scrolls to the bottom of the list
   * @param event The scroll event
   */
  onScroll(event: any) {
    if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight) {
      if (!this.isLoading$.value && !this._isLastPage) {
        this.scriptOptions.currentPage++;
        this.loadScripts();
      }
    }
  }

  /**
   * Returns the identifier of the selected script
   */
  get selectedScript(): string {
    return this._selectedScript ? this._selectedScript.id : undefined;
  }

  /**
   * Sets the currently selected script by navigating to the correct route using the scripts ID
   * @param value The identifier of the script
   */
  set selectedScript(value: string) {
    this.router.navigate([],
      {
        queryParams: { [SCRIPT_QUERY_PARAMETER]: value },
      }
    );
  }

  selectScript(script: Script) {
    this._selectedScript = script;
  }

  onSelect(newScript: Script) {
    this.selectScript(newScript);
    // this._selectedScript = newScript;
    this.select.emit(newScript);
    this.selectedScript = newScript.name;
  }

  @Input()
  set script(value: Script) {
     this._selectedScript = value;
  }

  ngOnDestroy(): void {
    if (hasValue(this.routeSub)) {
      this.routeSub.unsubscribe();
    }
  }
}
