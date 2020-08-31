import { Component, OnInit } from '@angular/core';
import { MetadataBoxFieldRendering, FieldRendetingType } from '../metadata-box.decorator';
import { BitstreamRenderingModel } from '../bitstream-rendering.model';
import { BitstreamDataService } from 'src/app/core/data/bitstream-data.service';
import { Observable } from 'rxjs';
import { Bitstream } from 'src/app/core/shared/bitstream.model';

@Component({
  selector: 'ds-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
@MetadataBoxFieldRendering(FieldRendetingType.ATTACHMENT)
export class AttachmentComponent extends BitstreamRenderingModel implements OnInit {

  bitstreams$: Observable<Bitstream[]>;

  constructor(protected bitstreamDataService: BitstreamDataService) {
    super(bitstreamDataService);
  }

  ngOnInit() {
    this.bitstreams$ = this.getBitstream();
  }

}
