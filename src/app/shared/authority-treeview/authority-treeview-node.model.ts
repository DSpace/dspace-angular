import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AuthorityEntry } from '../../core/integration/models/authority-entry.model';
import { PageInfo } from '../../core/shared/page-info.model';

export const LOAD_MORE = 'LOAD_MORE';
export const LOAD_MORE_ROOT = 'LOAD_MORE_ROOT';
export const LOAD_MORE_NODE: any = { id: LOAD_MORE };
export const LOAD_MORE_ROOT_NODE: any = { id: LOAD_MORE_ROOT };

/* tslint:disable:max-classes-per-file */
/** Nested node */
export class TreeviewNode {
  childrenChange = new BehaviorSubject<TreeviewNode[]>([]);

  get children(): TreeviewNode[] {
    return this.childrenChange.value;
  }

  constructor(public item: AuthorityEntry,
              public hasChildren = false,
              public pageInfo: PageInfo = new PageInfo(),
              public loadMoreParentItem: AuthorityEntry | null = null,
              public isSearchNode = false) {
  }

  updatePageInfo(pageInfo: PageInfo) {
    this.pageInfo = pageInfo
  }
}

/** Flat node with expandable and level information */
export class TreeviewFlatNode {
  constructor(public item: AuthorityEntry,
              public level = 1,
              public expandable = false,
              public pageInfo: PageInfo = new PageInfo(),
              public loadMoreParentItem: AuthorityEntry | null = null,
              public isSearchNode = false) {
  }
}

/* tslint:enable:max-classes-per-file */
