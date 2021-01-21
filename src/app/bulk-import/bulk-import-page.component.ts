import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { getCollectionPageRoute } from '../+collection-page/collection-page-routing-paths';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { ScriptDataService } from '../core/data/processes/script-data.service';
import { RemoteData } from '../core/data/remote-data';
import { RequestService } from '../core/data/request.service';
import { Collection } from '../core/shared/collection.model';
import { getFirstCompletedRemoteData, redirectOn4xx } from '../core/shared/operators';
import { ProcessParameter } from '../process-page/processes/process-parameter.model';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { AuthService } from '../core/auth/auth.service';
import { Process } from '../process-page/processes/process.model';

/**
 * Page to perform an items bulk imports into the given collection.
 */
@Component({
  selector: 'ds-bulk-import-page',
  templateUrl: './bulk-import-page.component.html',
})
export class BulkImportPageComponent implements OnInit, OnDestroy {

  collectionId: string;

  form: FormGroup;

  subs: Subscription[] = [];

  /**
   * A boolean representing if a create delete operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  processingImport$: BehaviorSubject<boolean>  = new BehaviorSubject<boolean>(false);

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
      name: new FormControl({value:'', disabled: true}),
      file: new FormControl(),
      workflow: new FormControl(false),
      abortOnError: new FormControl(false)
    });

    this.subs.push(this.route.data.pipe(
      map((data) => data.collection as RemoteData<Collection>),
      redirectOn4xx(this.router, this.authService),
      take(1)
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

    const values: any = this.form.value;

    const files: FileList = values.file;
    const file: File = files.item(0);

    const stringParameters: ProcessParameter[] = [
      { name: '-c', value: this.collectionId },
      { name: '-f', value: file.name }
    ];

    if (values.abortOnError) {
      stringParameters.push( { name: '-e', value: values.abortOnError } );
    }
    if (values.workflow) {
      stringParameters.push( { name: '-w', value: values.workflow } );
    }

    this.scriptService.invoke('bulk-import', stringParameters, [file])
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

  /**
   * Return a boolean representing if t import operation is pending.
   *
   * @return {Observable<boolean>}
   */
  isProcessingImport(): Observable<boolean> {
    return this.processingImport$.asObservable();
  }

  private navigateToProcesses() {
    this.requestService.setStaleByHrefSubstring('/processes');
    this.router.navigateByUrl('/processes');
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

}
