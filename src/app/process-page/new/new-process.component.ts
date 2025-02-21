import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { LinkService } from '@dspace/core';
import { followLink } from '@dspace/core';
import { ProcessDataService } from '@dspace/core';
import { Process } from '@dspace/core';
import { Script } from '@dspace/core';
import { getFirstSucceededRemoteDataPayload } from '@dspace/core';
import { HasValuePipe } from '../../shared/utils/has-value.pipe';
import { VarDirective } from '../../shared/utils/var.directive';
import { ProcessFormComponent } from '../form/process-form.component';

/**
 * Component to create a new script
 */
@Component({
  selector: 'ds-new-process',
  templateUrl: './new-process.component.html',
  styleUrls: ['./new-process.component.scss'],
  standalone: true,
  imports: [VarDirective, ProcessFormComponent, AsyncPipe, HasValuePipe],
})
export class NewProcessComponent implements OnInit {
  /**
   * Emits preselected process if there is one
   */
  fromExisting$?: Observable<Process>;
  /**
   * Emits preselected script if there is one
   */
  script$?: Observable<Script>;

  constructor(private route: ActivatedRoute, private processService: ProcessDataService, private linkService: LinkService) {
  }

  /**
   * If there's an id parameter, use this the process with this identifier as presets for the form
   */
  ngOnInit() {
    const id = this.route.snapshot.queryParams.id;
    if (id) {
      this.fromExisting$ = this.processService.findById(id).pipe(getFirstSucceededRemoteDataPayload());
      this.script$ = this.fromExisting$.pipe(
        map((process: Process) => this.linkService.resolveLink<Process>(process, followLink('script'))),
        switchMap((process: Process) => process.script),
        getFirstSucceededRemoteDataPayload(),
      );
    }
  }
}
