import { Component } from '@angular/core';

@Component({
  selector: 'ds-create-community',
  styleUrls: ['./create-community-page.component.scss'],
  templateUrl: './create-community-page.component.html'
})
export class CreateCommunityPageComponent {

  onSubmit(data: any) {
    console.log('yay, made it with name: ' + data.name);
  }

}
