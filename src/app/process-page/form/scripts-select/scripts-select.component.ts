import {
  AsyncPipe,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import {
  ControlContainer,
  FormsModule,
  NgForm,
} from '@angular/forms';
import {
  ActivatedRoute,
  Params,
  Router,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { PaginatedList } from '../../../core/data/paginated-list.model';
import { ScriptDataService } from '../../../core/data/processes/script-data.service';
import {
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
} from '../../../core/shared/operators';
import {
  hasNoValue,
  hasValue,
} from '../../../shared/empty.util';
import { Script } from '../../scripts/script.model';
import { controlContainerFactory } from '../process-form-factory';

const SCRIPT_QUERY_PARAMETER = 'script';

/**
 * Component used to select a script
 */
@Component({
  selector: 'ds-scripts-select',
  templateUrl: './scripts-select.component.html',
  styleUrls: ['./scripts-select.component.scss'],
  viewProviders: [{ provide: ControlContainer,
    useFactory: controlContainerFactory,
    deps: [[new Optional(), NgForm]] }],
  standalone: true,
  imports: [NgIf, FormsModule, NgFor, AsyncPipe, TranslateModule],
})
export class ScriptsSelectComponent implements OnInit, OnDestroy {
  /**
   * Emits the selected script when the selection changes
   */
  @Output() select: EventEmitter<Script> = new EventEmitter<Script>();
  /**
   * All available scripts
   */
  scripts$: Observable<Script[]>;
  private _selectedScript: Script;
  private routeSub: Subscription;

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
    this.scripts$ = this.scriptService.findAll({ elementsPerPage: 9999 })
      .pipe(
        getFirstSucceededRemoteData(),
        getRemoteDataPayload(),
        map((paginatedList: PaginatedList<Script>) => paginatedList.page),
      );

    this.routeSub = this.route.queryParams
      .pipe(
        filter((params: Params) => hasNoValue(params.id)),
        map((params: Params) => params[SCRIPT_QUERY_PARAMETER]),
        distinctUntilChanged(),
        switchMap((id: string) =>
          this.scripts$
            .pipe(
              take(1),
              map((scripts) =>
                scripts.find((script) => script.id === id),
              ),
            ),
        ),
      ).subscribe((script: Script) => {
        this._selectedScript = script;
        this.select.emit(script);
      });
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
      },
    );
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
