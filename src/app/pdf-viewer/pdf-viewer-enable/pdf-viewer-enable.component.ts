import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { PdfViewerService } from '../pdf-viewer-service/pdf-viewer-service';

@Component({
  selector: 'ds-pdf-viewer-enable',
  templateUrl: './pdf-viewer-enable.component.html',
  styleUrls: ['./pdf-viewer-enable.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    UiSwitchModule,
  ],
})
export class PdfViewerEnableComponent implements OnInit {

  @Input()
  dso: DSpaceObject;

  isEnabled$: Observable<boolean>;

  isViewerConfigAllowed$: Observable<boolean>;

  @Output()
  onChange: EventEmitter<string> = new EventEmitter();


  constructor(
    protected pdfViewerService: PdfViewerService,
  ) {
  }

  ngOnInit() {
    this.isEnabled$ = this.pdfViewerService.isViewerEnabled(this.dso);
    this.isEnabled$.pipe(
      take(1),
    ).subscribe((isEnabled) => this.update(isEnabled));
    this.isViewerConfigAllowed$ = this.pdfViewerService.viewerAllowedForBitstreamFormat(this.dso);
  }

  update($event: boolean) {
    this.onChange.emit($event.toString());
  }
}
