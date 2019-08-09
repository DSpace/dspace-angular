import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ItemComponent } from '../../../../+item-page/simple/item-types/shared/item.component';

@rendersItemType('JournalIssue', ItemViewMode.Detail)
@Component({
  selector: 'ds-journal-issue',
  styleUrls: ['./journal-issue.component.scss'],
  templateUrl: './journal-issue.component.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Journal Issue
 */
export class JournalIssueComponent extends ItemComponent {
  /**
   * The volumes related to this journal issue
   */
  volumes$: Observable<Item[]>;

  /**
   * The publications related to this journal issue
   */
  publications$: Observable<Item[]>;

  ngOnInit(): void {
    super.ngOnInit();
    this.volumes$ = this.relationshipService.getRelatedItemsByLabel(this.item, 'isJournalVolumeOfIssue');
    this.publications$ = this.relationshipService.getRelatedItemsByLabel(this.item, 'isPublicationOfJournalIssue');
  }
}
