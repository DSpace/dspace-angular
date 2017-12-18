import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { DynamicTagModel } from './dynamic-tag.model';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { IntegrationData } from '../../../../../../core/integration/integration-data';
import { isNotEmpty } from '../../../../../empty.util';
import {Chips} from "../../../../../chips/chips.model";

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
  placeholder = "Enter tags...";
  inputText: string;

  searching = false;
  searchOptions: IntegrationSearchOptions;
  searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  currentValue: any;

  formatter = (x) => {
    if(x.display) {
      return x.display;
    } else {
      return '';
    }
  };
// (x: {display: string}) => x.display;

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

  constructor(private authorityService: AuthorityService) {}

  ngOnInit() {
    this.currentValue = this.model.value;
    if(this.model.authorityName && this.model.authorityName.length > 0) {
      this.searchOptions = new IntegrationSearchOptions(
        this.model.authorityScope,
        this.model.authorityName,
        this.model.authorityMetadata);
    }
    this.group.valueChanges.subscribe((value) => {
      if (this.currentValue !== value && isNotEmpty(value[this.model.id])) {
        this.currentValue = value[this.model.id];
      }
    })

    this.chips = new Chips();
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
      this.chips.add(event.item);
      this.change.emit(event.item);
      this.currentValue = null;
      this.group.controls[this.model.id].setValue(this.currentValue);
  }

  onKeyUp(event) {
    if (event.keyCode === 13 || event.keyCode === 188) {
      // Key: Enter or , or ;
      this.addTagsToChips(this.inputText);
      this.inputText = '';
    }

  }

  private addTagsToChips(text: string) {
    let res: string[] = [];
    res = text.split(',');

    let res1 = [];
    res.forEach((item) => {
      item.split(';').forEach( (item) => {
        res1.push(item);
      });
    });

    res1.forEach((c) =>{
      c = c.trim();
      if (c.length > 0) {
        this.chips.add(c);
      }
    });
  }

  chipsSelected(event) {
    console.log("Selected chips : "+JSON.stringify(this.chips.chipsItems[event]));
  }

  removeChips(event) {
    console.log("Removed chips index: "+event);
  }
}
