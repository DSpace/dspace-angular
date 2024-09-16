import { Component, OnInit } from '@angular/core';
import { LiveRegionService } from './live-region.service';
import { Observable } from 'rxjs';

@Component({
  selector: `ds-live-region`,
  templateUrl: './live-region.component.html',
  styleUrls: ['./live-region.component.scss'],
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
