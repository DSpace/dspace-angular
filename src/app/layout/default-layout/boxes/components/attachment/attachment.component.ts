import { Component, OnInit } from '@angular/core';
import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { BitstreamRenderingModel } from '../bitstream-rendering.model';
import { BitstreamDataService } from '../../../../../core/data/bitstream-data.service';
import { Observable } from 'rxjs';
import { Bitstream } from '../../../../../core/shared/bitstream.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.ATTACHMENT)
export class AttachmentComponent extends BitstreamRenderingModel implements OnInit {

  bitstreams$: Observable<Bitstream[]>;

  constructor(protected bitstreamDataService: BitstreamDataService, protected translateService: TranslateService) {
    super(bitstreamDataService, translateService);
  }

  ngOnInit() {
    this.bitstreams$ = this.getBitstream();
  }

}
