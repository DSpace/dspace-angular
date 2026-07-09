import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Process } from '@dspace/core/processes/process.model';
import { ProcessParameter } from '@dspace/core/processes/process-parameter.model';
import { getCollectionPageRoute } from '@dspace/core/router/utils/dso-route.utils';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';
import { BtnDisabledDirective } from 'src/app/shared/btn-disabled.directive';

import { AuthService } from '../core/auth/auth.service';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { ScriptDataService } from '../core/data/processes/script-data.service';
import { RemoteData } from '../core/data/remote-data';
import { RequestService } from '../core/data/request.service';
import { redirectOn4xx } from '../core/shared/authorized.operators';
import { Collection } from '../core/shared/collection.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { FileValidator } from '../shared/utils/require-file.validator';

/**
 * Form values for bulk import page
 */
interface BulkImportFormValues {
  name: string;
  file?: File;
  abortOnError: boolean;
}

/**
 * Page to perform an items bulk imports into the given collection.
 */
@Component({
  selector: 'ds-bulk-import-page',
  templateUrl: './bulk-import-page.component.html',
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    FileValidator,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class BulkImportPageComponent implements OnInit, OnDestroy {

  collectionId: string;

  form: FormGroup;

  subs: Subscription[] = [];

  private selectedFile: File;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private dsoNameService: DSONameService,
    private scriptService: ScriptDataService,
    private notificationsService: NotificationsService,
    private translationService: TranslateService,
    private requestService: RequestService,
    private route: ActivatedRoute,
    private router: Router) {

  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      name: new FormControl({ value:'', disabled: true }),
      file: new FormControl(),
      abortOnError: new FormControl(false),
    });

    this.subs.push(this.route.data.pipe(
      map((data) => data.collection as RemoteData<Collection>),
      redirectOn4xx(this.router, this.authService),
      take(1),
    ).subscribe((remoteData) => {
      if (remoteData.payload) {
        const collection = remoteData.payload;
        this.collectionId = collection.id;
        this.form.controls.name.setValue(this.dsoNameService.getName(collection));
      }
    }));

  }

  /**
   * Validates the form, sets the parameters to correct values and invokes the script with the correct parameters
   * @param form
   */
  submit() {
    if (!this.selectedFile) {
      this.notificationsService.error(this.translationService.get('bulk-import.error.no-file'));
      return;
    }

    const values: BulkImportFormValues = this.form.value;

    const stringParameters: ProcessParameter[] = [
      { name: '-c', value: this.collectionId },
      { name: '-f', value: this.selectedFile.name },
    ];

    if (values.abortOnError) {
      stringParameters.push( { name: '-er', value: values.abortOnError } );
    }

    this.scriptService.invoke('bulk-import', stringParameters, [this.selectedFile])
      .pipe(getFirstCompletedRemoteData())
      .subscribe((rd: RemoteData<Process>) => {
        if (rd.isSuccess) {
          this.notificationsService.success(this.translationService.get('bulk-import.success'));
          this.navigateToProcesses();
        } else {
          this.notificationsService.error(this.translationService.get('bulk-import.error'));
        }
      });
  }

  goBack(): void {
    this.router.navigateByUrl(getCollectionPageRoute(this.collectionId));
  }


  private navigateToProcesses() {
    this.requestService.setStaleByHrefSubstring('/processes');
    this.router.navigateByUrl('/processes');
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  public handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setFile(input.files);
    }
  }

  public setFile(files: FileList) {
    this.selectedFile = files.length > 0 ? files.item(0) : undefined;
  }

}
