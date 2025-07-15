import { CdkTreeModule } from '@angular/cdk/tree';
import { AsyncPipe } from '@angular/common';
import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, lastValueFrom, take } from 'rxjs';

import { CommunityListComponent as BaseComponent } from '../../../../../app/community-list-page/community-list/community-list.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { TruncatablePartComponent } from '../../../../../app/shared/truncatable/truncatable-part/truncatable-part.component';
import { TruncatableComponent } from '../../../../../app/shared/truncatable/truncatable.component';

@Component({
  selector: 'ds-community-list',
  styleUrls: ['./community-list.component.scss'],
  // styleUrls: ['../../../../../app/community-list-page/community-list/community-list.component.scss'],
  templateUrl: './community-list.component.html',
  // templateUrl: '../../../../../app/community-list-page/community-list/community-list.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    CdkTreeModule,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
})
export class CommunityListComponent extends BaseComponent {

  @Input() scopeId!: string;

  @Input() enableExpandCollapseAll = false;

  @ViewChildren('toggle') toggle!: QueryList<any>;

  isExpanding: BehaviorSubject<boolean>;

  ngOnInit(): void {
    this.paginationConfig.scopeID = this.scopeId;
    this.isExpanding = new BehaviorSubject<boolean>(false);
    super.ngOnInit();
  }

  async expandAll(): Promise<void> {
    this.isExpanding.next(true);

    const expandableNodes = this.toggle.filter((node: any) => {
      return !!node.nativeElement.querySelector('.fa-chevron-right');
    });

    for (const node of expandableNodes) {
      node.nativeElement.click();

      await lastValueFrom(this.dataSource.loading$.pipe(
        distinctUntilChanged(),
        debounceTime(100),
        filter(loading => loading === false),
        take(1)
      ));
    }

    this.isExpanding.next(false);
  }

  collapseAll(): void {
    this.toggle.filter((node: any) => {
      return !!node.nativeElement.querySelector('.fa-chevron-down');
    }).reverse().forEach((node: any) => {
      node.nativeElement.click();
    });
  }

}
