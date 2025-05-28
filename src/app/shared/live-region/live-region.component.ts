import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';

import { LiveRegionService } from './live-region.service';

/**
 * The Live Region Component is an accessibility tool for screenreaders. When a change occurs on a page when the changed
 * section is not in focus, a message should be displayed by this component so it can be announced by a screen reader.
 *
 * This component should not be used directly. Use the {@link LiveRegionService} to add messages.
 */
@Component({
  selector: `ds-live-region`,
  templateUrl: './live-region.component.html',
  styleUrls: ['./live-region.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
  ],
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
