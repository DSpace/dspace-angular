import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LdnService } from "../ldn-services-model/ldn-services.model";
import { ActivatedRoute } from "@angular/router";
import { ProcessDataService } from "../../../core/data/processes/process-data.service";
import { LinkService } from "../../../core/cache/builders/link.service";
import { getFirstSucceededRemoteDataPayload } from "../../../core/shared/operators";

@Component({
  selector: 'ds-ldn-service-new',
  templateUrl: './ldn-service-new.component.html',
  styleUrls: ['./ldn-service-new.component.scss']
})
export class LdnServiceNewComponent implements OnInit {
  /**
   * Emits preselected process if there is one
   */
  ldnService$?: Observable<LdnService>;

  constructor(private route: ActivatedRoute, private processService: ProcessDataService, private linkService: LinkService) {
  }

  /**
   * If there's an id parameter, use this the process with this identifier as presets for the form
   */
  ngOnInit() {
  }
}
