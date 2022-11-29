import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertType } from '../../shared/alert/aletr-type';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { DsoEditMetadataChangeType, DsoEditMetadataForm } from './dso-edit-metadata-form';
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
import { getFirstSucceededRemoteData, metadataFieldsToString } from '../../core/shared/operators';

@Component({
  selector: 'ds-dso-edit-metadata',
  styleUrls: ['./dso-edit-metadata.component.scss'],
  templateUrl: './dso-edit-metadata.component.html',
})
export class DsoEditMetadataComponent implements OnInit, OnDestroy {
  @Input() dso: DSpaceObject;
  dsoType: string;

  form: DsoEditMetadataForm;
  newMdField: string;

  isReinstatable: boolean;
  hasChanges: boolean;
  isEmpty: boolean;

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

  constructor(protected route: ActivatedRoute) {
  }

  ngOnInit(): void {
    if (hasNoValue(this.dso)) {
      this.dsoUpdateSubscription = observableCombineLatest([this.route.data, this.route.parent.data]).pipe(
        map(([data, parentData]: [Data, Data]) => Object.assign({}, data, parentData)),
        map((data: any) => data.dso)
      ).subscribe((rd: RemoteData<DSpaceObject>) => {
        this.dso = rd.payload;
        this.initForm();
      });
    } else {
      this.initForm();
    }
  }

  initForm(): void {
    this.dsoType = typeof this.dso.type === 'string' ? this.dso.type as any : this.dso.type.value;
    this.form = new DsoEditMetadataForm(this.dso.metadata);
    this.onDebounce();
  }

  onDebounce(): void {
    this.hasChanges = this.form.hasChanges();
    this.isReinstatable = this.form.isReinstatable();
    this.isEmpty = Object.keys(this.form.fields).length === 0;
  }

  submit(): void {

  }

  add(): void {
    this.newMdField = undefined;
    this.form.add();
  }

  discard(): void {
    this.form.discard();
  }

  reinstate(): void {
    this.form.reinstate();
  }

  ngOnDestroy() {
    if (hasValue(this.dsoUpdateSubscription)) {
      this.dsoUpdateSubscription.unsubscribe();
    }
  }

}
