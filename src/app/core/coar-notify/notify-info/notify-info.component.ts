import { Component, OnInit } from '@angular/core';
import { NotifyInfoService } from './notify-info.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'ds-notify-info',
  templateUrl: './notify-info.component.html',
  styleUrls: ['./notify-info.component.scss'],
})
/**
 * Component for displaying COAR notification information.
 */
export class NotifyInfoComponent implements OnInit {
  /**
   * Observable containing the COAR REST INBOX API URLs.
   */
  coarRestApiUrl: Observable<string[]> = of([]);

  constructor(private notifyInfoService: NotifyInfoService) {}

  ngOnInit() {
    this.coarRestApiUrl = this.notifyInfoService.getCoarLdnLocalInboxUrls();
  }
}
