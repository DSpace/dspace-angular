import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { CommunityListComponent as BaseComponent } from '../../../../../app/community-list-page/community-list/community-list.component';
import { FlatNode } from '../../../../../app/community-list-page/flat-node.model';

/**
 * A tree-structured list of nodes representing the communities, their subCommunities and collections.
 * Initially only the page-restricted top communities are shown.
 * Each node can be expanded to show its children and all children are also page-limited.
 * More pages of a page-limited result can be shown by pressing a show more node/link.
 * Which nodes were expanded is kept in the store, so this persists across pages.
 */
@Component({
  selector: 'ds-community-list',
  // styleUrls: ['./community-list.component.scss'],
  templateUrl: './community-list.component.html',
  // templateUrl: '../../../../../app/community-list-page/community-list/community-list.component.html'
})
export class CommunityListComponent extends BaseComponent implements OnInit {

  @Input() scopeId!: string;

  @Input() enableExpandCollapseAll = false;

  private expanding: BehaviorSubject<boolean>;

  get loading(): Observable<boolean> {
    return combineLatest([
      this.expanding.asObservable(),
      this.dataSource.loading$
    ]).pipe(
      map(([expanding, loading]) => {
        console.log(expanding, loading, (expanding || loading));
        return expanding || loading;
      })
    );
  }

  ngOnInit(): void {
    this.paginationConfig.scopeID = this.scopeId;
    this.expanding = new BehaviorSubject<boolean>(false);
    super.ngOnInit();
  }

  expandAll(): void {
    this.expanding.next(true);
    this.getNodes()
      .filter((node: FlatNode) => !node.isExpanded)
      .forEach((node: FlatNode) => {
        this.toggleExpanded(node);
      });
    setTimeout(() => {
      this.expanding.next(false);
    }, 250);
  }

  collapseAll(): void {
    this.getNodes().reverse()
      .filter((node: FlatNode) => node.isExpanded)
      .forEach((node: FlatNode) => {
        this.toggleExpanded(node);
      });
  }

  private getNodes(): FlatNode[] {
    return (this.dataSource as any).communityList$.value
      .filter((node: FlatNode) => !node.isShowMoreNode);
  }

}

