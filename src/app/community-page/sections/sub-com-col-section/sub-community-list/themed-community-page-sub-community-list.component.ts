import {
  Component,
  Input,
} from '@angular/core';

import { Community } from '../../../../core/shared/community.model';
import { ThemedComponent } from '../../../../shared/theme-support/themed.component';
import { CommunityPageSubCommunityListComponent } from './community-page-sub-community-list.component';

@Component({
  selector: 'ds-community-page-sub-community-list',
  styleUrls: [],
  templateUrl: '../../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [CommunityPageSubCommunityListComponent],
})
export class ThemedCommunityPageSubCommunityListComponent extends ThemedComponent<CommunityPageSubCommunityListComponent> {

  @Input() community: Community;
  @Input() pageSize: number;
  protected inAndOutputNames: (keyof CommunityPageSubCommunityListComponent & keyof this)[] = ['community', 'pageSize'];

  protected getComponentName(): string {
    return 'CommunityPageSubCommunityListComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/community-page/sections/sub-com-col-section/sub-community-list/community-page-sub-community-list.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./community-page-sub-community-list.component`);
  }

}
