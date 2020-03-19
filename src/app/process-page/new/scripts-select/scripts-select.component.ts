import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ScriptDataService } from '../../scripts/script-data.service';
import { Script } from '../../scripts/script.model';
import { Observable } from 'rxjs';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../core/shared/operators';
import { PaginatedList } from '../../../core/data/paginated-list';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ds-scripts-select',
  templateUrl: './scripts-select.component.html',
  styleUrls: ['./scripts-select.component.scss']
})
export class ScriptsSelectComponent implements OnInit {
  @Output() select: EventEmitter<Script> = new EventEmitter<Script>();
  scripts: Observable<Script[]>;
  private _selectedScript;

  constructor(
    private scriptService: ScriptDataService
  ) {
  }

  ngOnInit() {
    this.scripts = this.scriptService.findAll({ elementsPerPage: Number.MAX_SAFE_INTEGER })
      .pipe(
        getSucceededRemoteData(),
        getRemoteDataPayload(),
        map((paginatedList: PaginatedList<Script>) => paginatedList.page)
      )
  }

  get selectedScript() {
    return this._selectedScript;
  }

  set selectedScript(value) {
    this._selectedScript = value;
    this.select.emit(value);
  }
}
