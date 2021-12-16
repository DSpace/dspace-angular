import { Component } from '@angular/core';
import { VocabularyTreeviewComponent } from '../../../../../app/shared/vocabulary-treeview/vocabulary-treeview.component';
import { filter, startWith } from 'rxjs/operators';
import { PageInfo } from '../../../../../app/core/shared/page-info.model';

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

    const descriptionLabel = 'vocabulary-treeview.tree.description.' + this.vocabularyOptions.name;
    this.description = this.translate.get(descriptionLabel).pipe(
      filter((msg) => msg !== descriptionLabel),
      startWith('')
    );

    this.loading = this.vocabularyTreeviewService.isLoading();

    this.vocabularyTreeviewService.initialize(this.vocabularyOptions, new PageInfo(), null);
  }
}
