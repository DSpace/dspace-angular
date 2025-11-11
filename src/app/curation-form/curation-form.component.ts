
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
import { ConfigurationDataService } from '@dspace/core/data/configuration-data.service';
import { ScriptDataService } from '@dspace/core/data/processes/script-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Process } from '@dspace/core/processes/process.model';
import { ConfigurationProperty } from '@dspace/core/shared/configuration-property.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '@dspace/core/shared/operators';
import {
  hasValue,
  isEmpty,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  Observable,
  Subscription,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { getProcessDetailRoute } from '../process-page/process-page-routing.paths';
import { HandleService } from '../shared/handle.service';

export const CURATION_CFG = 'plugin.named.org.dspace.curate.CurationTask';

/**
 * Component responsible for rendering the Curation Task form
 */
@Component({
  selector: 'ds-curation-form',
  templateUrl: './curation-form.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
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
