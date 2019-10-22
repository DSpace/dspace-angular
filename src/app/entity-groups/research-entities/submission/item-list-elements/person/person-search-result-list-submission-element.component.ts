import { Component, OnInit } from '@angular/core';
import { SearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/search-result-list-element.component';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { Item } from '../../../../../core/shared/item.model';
import { Context } from '../../../../../core/shared/context.model';

@listableObjectComponent('PersonSearchResult', ViewMode.ListElement, Context.Submission)
@Component({
  selector: 'ds-person-search-result-list-submission-element',
  styleUrls: ['./person-search-result-list-submission-element.component.scss'],
  templateUrl: './person-search-result-list-submission-element.component.html'
})
/**
 * The component for displaying a list element for an item search result of the type Person
 */
export class PersonSearchResultListSubmissionElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> implements OnInit {
  suggestions: string[];
  allSuggestions: string[];

  ngOnInit() {
    super.ngOnInit();
    const defaultValue = this.firstMetadataValue('person.familyName') + ', ' + this.firstMetadataValue('person.givenName')
    const alternatives = this.allMetadataValues('dc.title.alternative');
    this.allSuggestions = [defaultValue, ...alternatives];
    this.suggestions = this.allSuggestions;
  }

  filter(query) {
    this.suggestions = this.allSuggestions.filter((suggestion) => suggestion.includes(query));
  }
}
