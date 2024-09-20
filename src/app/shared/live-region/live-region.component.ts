import {
  AsyncPipe,
  NgClass,
  NgFor,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';

import { LiveRegionService } from './live-region.service';

@Component({
  selector: `ds-live-region`,
  templateUrl: './live-region.component.html',
  styleUrls: ['./live-region.component.scss'],
  standalone: true,
  imports: [NgClass, NgFor, AsyncPipe],
})
export class LiveRegionComponent implements OnInit {

  protected isVisible: boolean;

  protected messages$: Observable<string[]>;

  constructor(
    protected liveRegionService: LiveRegionService,
  ) {
  }

  ngOnInit() {
    this.isVisible = this.liveRegionService.getLiveRegionVisibility();
    this.messages$ = this.liveRegionService.getMessages$();
  }
}
