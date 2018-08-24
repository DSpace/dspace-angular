import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { DynamicTagModel } from './dynamic-tag.model';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { Chips } from '../../../../../chips/models/chips.model';
import { hasValue, isNotEmpty } from '../../../../../empty.util';
import { isEqual } from 'lodash';
import { GlobalConfig } from '../../../../../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../../../../../config';

@Component({
  selector: 'ds-dynamic-tag',
  styleUrls: ['./dynamic-tag.component.scss'],
  templateUrl: './dynamic-tag.component.html'
})
export class DsDynamicTagComponent implements OnInit {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: DynamicTagModel;
  @Input() showErrorMessages = false;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  chips: Chips;
  hasAuthority: boolean;

  searching = false;
  searchOptions: IntegrationSearchOptions;
  searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.changeSearchingStatus(false));
  currentValue: any;

  formatter = (x: { display: string }) => x.display;

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.changeSearchingStatus(true))
      .switchMap((term) => {
        if (term === '' || term.length < this.model.minChars) {
          return Observable.of({list: []});
        } else {
          this.searchOptions.query = term;
          return this.authorityService.getEntriesByName(this.searchOptions)
            .map((authorities) => {
              // @TODO Pagination for authority is not working, to refactor when it will be fixed
              return {
                list: authorities.payload,
                pageInfo: authorities.pageInfo
              };
            })
            .do(() => this.searchFailed = false)
            .catch(() => {
              this.searchFailed = true;
              return Observable.of({list: []});
            });
        }
      })
      .map((results) => results.list)
      .do(() => this.changeSearchingStatus(false))
      .merge(this.hideSearchingWhenUnsubscribed);

  constructor(@Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              private authorityService: AuthorityService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.hasAuthority = this.model.authorityOptions && hasValue(this.model.authorityOptions.name);
    if (this.hasAuthority) {
      this.searchOptions = new IntegrationSearchOptions(
        this.model.authorityOptions.scope,
        this.model.authorityOptions.name,
        this.model.authorityOptions.metadata);
    }

    this.chips = new Chips(this.model.value, 'display');

    this.chips.chipsItems
      .subscribe((subItems: any[]) => {
        const items = this.chips.getChipsItems();
        // Does not emit change if model value is equal to the current value
        if (!isEqual(items, this.model.value)) {
          this.model.valueUpdates.next(items);
          this.change.emit(event);
        }
      })
  }

  changeSearchingStatus(status: boolean) {
    this.searching = status;
    this.cdr.detectChanges();
  }

  onInput(event) {
    if (event.data) {
      this.group.markAsDirty();
    }
    this.cdr.detectChanges();
  }

  onBlur(event: Event) {
    if (isNotEmpty(this.currentValue)) {
      this.addTagsToChips();
    }
    this.blur.emit(event);
  }

  onFocus(event) {
    this.focus.emit(event);
  }

  onSelectItem(event: NgbTypeaheadSelectItemEvent) {
    this.chips.add(event.item);
    // this.group.controls[this.model.id].setValue(this.model.value);
    this.updateModel(event);

    setTimeout(() => {
      // Reset the input text after x ms, mandatory or the formatter overwrite it
      this.currentValue = null;
      this.cdr.detectChanges();
    }, 50);
  }

  updateModel(event) {
    this.model.valueUpdates.next(this.chips.getChipsItems());
    this.change.emit(event);
  }

  onKeyUp(event) {
    if (event.keyCode === 13 || event.keyCode === 188) {
      event.preventDefault();
      // Key: Enter or ',' or ';'
      this.addTagsToChips();
      event.stopPropagation();
    }
  }

  preventEventsPropagation(event) {
    event.stopPropagation();
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  }

  private addTagsToChips() {
    if (!this.hasAuthority || !this.model.authorityOptions.closed) {
      let res: string[] = [];
      res = this.currentValue.split(',');

      const res1 = [];
      res.forEach((item) => {
        item.split(';').forEach((i) => {
          res1.push(i);
        });
      });

      res1.forEach((c) => {
        c = c.trim();
        if (c.length > 0) {
          this.chips.add(c);
        }
      });

      // this.currentValue = '';
      setTimeout(() => {
        // Reset the input text after x ms, mandatory or the formatter overwrite it
        this.currentValue = null;
        this.cdr.detectChanges();
      }, 50);
      this.updateModel(event);
    }
  }
}
