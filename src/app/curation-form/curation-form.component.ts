import {
  NgFor,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  Observable,
  Subscription,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { ScriptDataService } from '../core/data/processes/script-data.service';
import { RemoteData } from '../core/data/remote-data';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../core/shared/operators';
import { getProcessDetailRoute } from '../process-page/process-page-routing.paths';
import { Process } from '../process-page/processes/process.model';
import {
  hasValue,
  isEmpty,
  isNotEmpty,
} from '../shared/empty.util';
import { HandleService } from '../shared/handle.service';
import { NotificationsService } from '../shared/notifications/notifications.service';

export const CURATION_CFG = 'plugin.named.org.dspace.curate.CurationTask';

/**
 * Component responsible for rendering the Curation Task form
 */
@Component({
  selector: 'ds-curation-form',
  templateUrl: './curation-form.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf, TranslateModule],
})
export class CurationFormComponent implements OnDestroy, OnInit {

  config: Observable<RemoteData<ConfigurationProperty>>;
  tasks: string[];
  form: UntypedFormGroup;

  @Input()
  dsoHandle: string;

  subs: Subscription[] = [];

  constructor(
    private scriptDataService: ScriptDataService,
    private configurationDataService: ConfigurationDataService,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    private handleService: HandleService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.form = new UntypedFormGroup({
      task: new UntypedFormControl(''),
      handle: new UntypedFormControl(''),
    });

    this.config = this.configurationDataService.findByPropertyName(CURATION_CFG);
    this.subs.push(this.config.pipe(
      getFirstSucceededRemoteDataPayload(),
    ).subscribe((configProperties: ConfigurationProperty) => {
      this.tasks = configProperties.values
        .filter((value) => isNotEmpty(value) && value.includes('='))
        .map((value) => value.split('=')[1].trim());
      this.form.get('task').patchValue(this.tasks[0]);
      this.cdr.detectChanges();
    }));
  }

  /**
   * Determines whether the inputted dsoHandle has a value
   */
  hasHandleValue() {
    return hasValue(this.dsoHandle);
  }

  /**
   * Submit the selected taskName and handle to the script data service to run the corresponding curation script
   * Navigate to the process page on success
   */
  submit() {
    const taskName = this.form.get('task').value;
    let handle$: Observable<string | null>;
    if (this.hasHandleValue()) {
      handle$ = this.handleService.normalizeHandle(this.dsoHandle).pipe(
        map((handle: string | null) => {
          if (isEmpty(handle)) {
            this.notificationsService.error(this.translateService.get('curation.form.submit.error.head'),
              this.translateService.get('curation.form.submit.error.invalid-handle'));
          }
          return handle;
        }),
      );
    } else {
      handle$ = this.handleService.normalizeHandle(this.form.get('handle').value).pipe(
        map((handle: string | null) => isEmpty(handle) ? 'all' : handle),
      );
    }

    this.subs.push(handle$.subscribe((handle: string) => {
      if (hasValue(handle)) {
        this.subs.push(this.scriptDataService.invoke('curate', [
          { name: '-t', value: taskName },
          { name: '-i', value: handle },
        ], []).pipe(
          getFirstCompletedRemoteData(),
        ).subscribe((rd: RemoteData<Process>) => {
          if (rd.hasSucceeded) {
            this.notificationsService.success(this.translateService.get('curation.form.submit.success.head'),
              this.translateService.get('curation.form.submit.success.content'));
            void this.router.navigateByUrl(getProcessDetailRoute(rd.payload.processId));
          } else {
            this.notificationsService.error(this.translateService.get('curation.form.submit.error.head'),
              this.translateService.get('curation.form.submit.error.content'));
          }
        }));
      }
    }));
  }
}
