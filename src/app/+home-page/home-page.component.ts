import { Component, OnInit } from '@angular/core';
import { GroupEpersonService } from '../core/eperson/group-eperson.service';
import { PlatformService } from '../shared/services/platform.service';

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {
  constructor(private gs: GroupEpersonService, private ps: PlatformService) {}

  ngOnInit() {
    if (this.ps.isBrowser) {
      this.gs.getDataByUuid('c849bed6-5f55-49c3-a8bb-e998a1145e30')
        .subscribe((gg) => {
          console.log(gg);
        })
    }
  }
}
