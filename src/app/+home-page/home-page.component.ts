import { Component } from '@angular/core';
import { GroupEpersonService } from '../core/eperson/group-eperson.service';

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {
  constructor(private s: GroupEpersonService) {}

  ngOnInit() {
    this.s.findById('11cc35e5-a11d-4b64-b5b9-0052a5d15509')
      .subscribe((r) => {
        console.log(r);
      })
  }
}
