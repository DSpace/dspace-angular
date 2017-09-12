import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { isNullOrUndefined } from 'util';

const mockCollections = [
  {
    communities: ['OR2017 - Demonstration'],
    collection: 'Collection of Sample Items'
  },
  {
    communities: ['Sample Community'],
    collection: 'Collection with embargo feature enabled (use only with XMLUI)'
  },
  {
    communities: ['Sample Community'],
    collection: 'DSpace related records in PubMed Europe'
  },
  {
    communities: ['OR2017 - Demonstration'],
    collection: 'Collection 4'
  },
  {
    communities: ['Sample Community'],
    collection: 'Collection 5'
  },
  {
    communities: ['Sample Community'],
    collection: 'Collection 6'
  },
  {
    communities: ['OR2017 - Demonstration'],
    collection: 'Collection 7'
  },
  {
    communities: ['Sample Community'],
    collection: 'Collection 8'
  },
  {
    communities: ['Sample Community'],
    collection: 'Collection 9'
  }
];

@Component({
  selector: 'ds-submission-submit-form-collection',
  styleUrls: ['./submission-submit-form-collection.component.scss'],
  templateUrl: './submission-submit-form-collection.component.html'
})
export class SubmissionSubmitFormCollectionComponent implements OnInit  {
  @Input() currentCollection: string;

  public selectedCollection: string;
  public listCollection: any;
  public model: any;

  private searchField: FormControl;

  ngOnInit() {
    this.selectedCollection = this.currentCollection;
    this.listCollection = mockCollections;
    this.searchField = new FormControl();
    this.searchField.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe((term) => {
        this.search(term);
      });
  }

  search(text: string) {
    if (text === '' || isNullOrUndefined(text)) {
      this.listCollection = mockCollections;
    } else {
      this.listCollection = mockCollections.filter((v) => v.collection.toLowerCase().indexOf(text.toLowerCase()) > -1).slice(0, 5);
    }
  }

  formatter = (x: {collection: string}) => x.collection;

  onSelect(event) {
    this.searchField.reset();
    this.selectedCollection = event.collection;
    this.listCollection = mockCollections;
    /*event.preventDefault();
    this.selectedCollection = event.item.collection;
    this.model = null;
    this.listCollection = mockCollections;*/
    console.log(event);
  }

  onClose(event) {
    this.searchField.reset();
  }
}
