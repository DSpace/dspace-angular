import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import {NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';

import {AuthorityService} from '../../../../../../core/integration/authority.service';
import {DynamicTagModel} from './dynamic-tag.model';
import {IntegrationSearchOptions} from '../../../../../../core/integration/models/integration-options.model';
import {isNotEmpty} from '../../../../../empty.util';
import {Chips} from '../../../../../chips/chips.model';
import {AuthorityModel} from '../../../../../../core/integration/models/authority.model';

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

  // chips: Chips;
  placeholder = 'Enter tags...';
  inputText: string;

  searching = false;
  searchOptions: IntegrationSearchOptions;
  searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  currentValue: any;

  formatter = (x: {display: string}) => x.display;

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
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
              }
            })
            .do(() => this.searchFailed = false)
            .catch(() => {
              this.searchFailed = true;
              return Observable.of({list: []});
            })
        }
      })
      .map((results) => results.list)
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed);

  constructor(private authorityService: AuthorityService) {
  }

  ngOnInit() {
    const withAuthority = this.model.authorityName && this.model.authorityName.length > 0;
    if (withAuthority) {
      this.searchOptions = new IntegrationSearchOptions(
        this.model.authorityScope,
        this.model.authorityName,
        this.model.authorityMetadata);
    }

    if (this.model.storedValue && this.model.storedValue.length > 0) {
      // Values found in edit
      this.model.storedValue.forEach( (v) => {
        let item;
        if (withAuthority) {
          item = {
            id: v.authority || v.value,
            value: v.value,
            display: v.value
          } as AuthorityModel;
        } else {
          item = v.value;
        }
        this.model.chips.add(item);
      });
    }
  }

  onInput(event) {
    if (event.data) {
      this.group.markAsDirty();
    }
  }

  onBlurEvent(event: Event) {
    this.blur.emit(event);
  }

  onFocusEvent($event) {
    this.focus.emit(event);
  }

  onSelectItem(event: NgbTypeaheadSelectItemEvent) {
    this.model.chips.add(event.item);
    // this.group.controls[this.model.id].setValue(this.model.value);
    this.updateModel(event);

    setTimeout(() => {
      // Reset the input text after x ms, mandatory or the formatter overwrite it
      this.currentValue = null;
    }, 50);
  }

  updateModel(event) {
    this.model.valueUpdates.next(this.model.chips.getItems());
    this.change.emit(event);
  }

  onKeyUp(event) {
    if (event.keyCode === 13 || event.keyCode === 188) {
      // Key: Enter or , or ;
      this.addTagsToChips(this.inputText);
      this.inputText = '';
      this.updateModel(event);
    }

  }

  private addTagsToChips(text: string) {
    let res: string[] = [];
    res = text.split(',');

    const res1 = [];
    res.forEach((item) => {
      item.split(';').forEach((i) => {
        res1.push(i);
      });
    });

    res1.forEach((c) => {
      c = c.trim();
      if (c.length > 0) {
        this.model.chips.add(c);
      }
    });
  }

  chipsSelected(event) {
    // console.log("Selected chips : "+JSON.stringify(this.chips.chipsItems[event]));
  }

  removeChips(event) {
    // console.log("Removed chips index: "+event);
    this.model.valueUpdates.next(this.model.chips.getItems());
    this.change.emit(event);
  }

  changeChips(event) {
    this.model.valueUpdates.next(this.model.chips.getItems());
    this.change.emit(event);
  }
}
