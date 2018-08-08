import { Component } from '@angular/core';
import { Community } from '../../core/shared/community.model';

@Component({
  selector: 'ds-create-community',
  styleUrls: ['./create-community-page.component.scss'],
  templateUrl: './create-community-page.component.html'
})
export class CreateCommunityPageComponent {

  onSubmit(data: any) {
    Object.assign(new Community(), {
      // TODO: Create community object to add to rest
    });
  }

}
