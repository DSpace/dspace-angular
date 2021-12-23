import { Component } from '@angular/core';
import { VocabularyTreeviewComponent } from '../../../../../app/shared/vocabulary-treeview/vocabulary-treeview.component';
import { filter, map, startWith } from 'rxjs/operators';
import { PageInfo } from '../../../../../app/core/shared/page-info.model';
import { lowerCase } from 'lodash';

/**
 * Component that show a hierarchical vocabulary in a tree view.
 * Worldbank customization which omits the authentication check.
 */
@Component({
  selector: 'ds-okr-vocabulary-treeview',
  templateUrl: '../../../../../app/shared/vocabulary-treeview/vocabulary-treeview.component.html',
  styleUrls: [
    './okr-vocabulary-treeview.component.scss',
    '../../../../../app/shared/vocabulary-treeview/vocabulary-treeview.component.scss',
  ]
})
export class OkrVocabularyTreeviewComponent extends VocabularyTreeviewComponent {

  /**
   * Initialize the component, setting up the data to build the tree
   */
  ngOnInit(): void {
    this.subs.push(
      this.vocabularyTreeviewService.getData().subscribe((data) => {
        this.dataSource.data = data;
      })
    );

    this.translate.get(`search.filters.filter.${this.vocabularyOptions.name}.head`).pipe(
      map((type) => lowerCase(type)),
    ).subscribe(
      (type) => this.description = this.translate.get('okr-vocabulary-treeview.info', { type })
    );

    this.loading = this.vocabularyTreeviewService.isLoading();

    this.vocabularyTreeviewService.initialize(this.vocabularyOptions, new PageInfo(), null);
  }
}
