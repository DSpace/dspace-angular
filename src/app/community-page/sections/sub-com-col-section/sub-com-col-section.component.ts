import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Data,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RemoteData } from '../../../core/data/remote-data';
import { Community } from '../../../core/shared/community.model';

@Component({
  selector: 'ds-sub-com-col-section',
  templateUrl: './sub-com-col-section.component.html',
  styleUrls: ['./sub-com-col-section.component.scss'],
})
export class SubComColSectionComponent implements OnInit {

  community$: Observable<Community>;

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.community$ = this.route.parent.data.pipe(
      map((data: Data) => (data.dso as RemoteData<Community>).payload),
    );
  }

}
