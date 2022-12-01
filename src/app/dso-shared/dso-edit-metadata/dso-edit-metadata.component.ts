import { Component, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertType } from '../../shared/alert/aletr-type';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { DsoEditMetadataChangeType, DsoEditMetadataForm, DsoEditMetadataValue } from './dso-edit-metadata-form';
import { map, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Data } from '@angular/router';
import { combineLatest as observableCombineLatest } from 'rxjs/internal/observable/combineLatest';
import { Subscription } from 'rxjs/internal/Subscription';
import { RemoteData } from '../../core/data/remote-data';
import { hasNoValue, hasValue } from '../../shared/empty.util';
import { RegistryService } from '../../core/registry/registry.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { followLink } from '../../shared/utils/follow-link-config.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  metadataFieldsToString
} from '../../core/shared/operators';
import { UpdateDataService } from '../../core/data/update-data.service';
import { getDataServiceFor } from '../../core/cache/builders/build-decorators';
import { ResourceType } from '../../core/shared/resource-type';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../core/data/data.service';
import { MetadataFieldSelectorComponent } from './metadata-field-selector/metadata-field-selector.component';

@Component({
  selector: 'ds-dso-edit-metadata',
  styleUrls: ['./dso-edit-metadata.component.scss'],
  templateUrl: './dso-edit-metadata.component.html',
})
export class DsoEditMetadataComponent implements OnInit, OnDestroy {
  @Input() dso: DSpaceObject;
  @ViewChild(MetadataFieldSelectorComponent) metadataFieldSelectorComponent: MetadataFieldSelectorComponent;
  updateDataService: UpdateDataService<DSpaceObject>;
  dsoType: string;

  form: DsoEditMetadataForm;
  newMdField: string;

  isReinstatable: boolean;
  hasChanges: boolean;
  isEmpty: boolean;
  saving$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loadingFieldValidation$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The AlertType enumeration for access in the component's template
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;

  /**
   * The DsoEditMetadataChangeType enumeration for access in the component's template
   * @type {DsoEditMetadataChangeType}
   */
  public DsoEditMetadataChangeTypeEnum = DsoEditMetadataChangeType;

  dsoUpdateSubscription: Subscription;

  constructor(protected route: ActivatedRoute,
              protected notificationsService: NotificationsService,
              protected translateService: TranslateService,
              protected parentInjector: Injector) {
  }

  ngOnInit(): void {
    if (hasNoValue(this.dso)) {
      this.dsoUpdateSubscription = observableCombineLatest([this.route.data, this.route.parent.data]).pipe(
        map(([data, parentData]: [Data, Data]) => Object.assign({}, data, parentData)),
        map((data: any) => data.dso)
      ).subscribe((rd: RemoteData<DSpaceObject>) => {
        this.dso = rd.payload;
        this.initDataService();
        this.initForm();
      });
    } else {
      this.initDataService();
      this.initForm();
    }
  }

  initDataService(): void {
    let type: ResourceType;
    if (typeof this.dso.type === 'string') {
      type = new ResourceType(this.dso.type);
    } else {
      type = this.dso.type;
    }
    const provider = getDataServiceFor(type);
    this.updateDataService = Injector.create({
      providers: [],
      parent: this.parentInjector
    }).get(provider);
    this.dsoType = type.value;
  }

  initForm(): void {
    this.form = new DsoEditMetadataForm(this.dso.metadata);
    this.onValueSaved();
  }

  onValueSaved(): void {
    this.hasChanges = this.form.hasChanges();
    this.isReinstatable = this.form.isReinstatable();
    this.isEmpty = Object.keys(this.form.fields).length === 0;
  }

  submit(): void {
    this.saving$.next(true);
    this.updateDataService.patch(this.dso, this.form.getOperations()).pipe(
      getFirstCompletedRemoteData()
    ).subscribe((rd: RemoteData<DSpaceObject>) => {
      this.saving$.next(false);
      if (rd.hasFailed) {
        this.notificationsService.error('error', rd.errorMessage);
      } else {
        this.notificationsService.success('saved', 'saved');
        this.dso = rd.payload;
        this.initForm();
      }
    });
  }

  setMetadataField() {
    this.loadingFieldValidation$.next(true);
    this.metadataFieldSelectorComponent.validate().subscribe((valid) => {
      this.loadingFieldValidation$.next(false);
      if (valid) {
        this.form.setMetadataField(this.newMdField);
        this.onValueSaved();
      }
    });
  }

  add(): void {
    this.newMdField = undefined;
    this.form.add();
  }

  discard(): void {
    this.form.discard();
    this.onValueSaved();
  }

  reinstate(): void {
    this.form.reinstate();
    this.onValueSaved();
  }

  ngOnDestroy() {
    if (hasValue(this.dsoUpdateSubscription)) {
      this.dsoUpdateSubscription.unsubscribe();
    }
  }

}
