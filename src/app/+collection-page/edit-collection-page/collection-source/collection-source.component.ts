import { Component, OnInit } from '@angular/core';
import { AbstractTrackableComponent } from '../../../shared/trackable/abstract-trackable.component';
import {
  DynamicFormControlModel, DynamicFormGroupModel, DynamicFormLayout, DynamicFormService,
  DynamicInputModel, DynamicRadioGroupModel,
  DynamicSelectModel,
  DynamicTextAreaModel
} from '@ng-dynamic-forms/core';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { FormGroup } from '@angular/forms';
import { isNotEmpty } from '../../../shared/empty.util';
import { ContentSource } from '../../../core/shared/content-source.model';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { Collection } from '../../../core/shared/collection.model';
import { first, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

/**
 * Component for managing the content source of the collection
 */
@Component({
  selector: 'ds-collection-source',
  templateUrl: './collection-source.component.html',
})
export class CollectionSourceComponent extends AbstractTrackableComponent implements OnInit {
  /**
   * The current collection's remote data
   */
  collectionRD$: Observable<RemoteData<Collection>>;

  /**
   * The current collection's content source
   */
  contentSource: ContentSource;

  /**
   * @type {string} Key prefix used to generate form labels
   */
  LABEL_KEY_PREFIX = 'collection.edit.tabs.source.form.';

  /**
   * @type {string} Key prefix used to generate form error messages
   */
  ERROR_KEY_PREFIX = 'collection.edit.tabs.source.form.errors.';

  /**
   * The dynamic form fields used for editing the content source of a collection
   * @type {(DynamicInputModel | DynamicTextAreaModel)[]}
   */
  formModel: DynamicFormControlModel[] = [
    new DynamicFormGroupModel({
      id: 'providerContainer',
      group: [
        new DynamicInputModel({
          id: 'provider',
          name: 'provider',
          required: true,
          validators: {
            required: null
          },
          errorMessages: {
            required: 'You must provide a set id of the target collection.'
          },
          disabled: true
        })
      ]
    }),
    new DynamicFormGroupModel({
      id: 'setContainer',
      group: [
        new DynamicInputModel({
          id: 'set',
          name: 'set',
          disabled: true
        }),
        new DynamicSelectModel({
          id: 'format',
          name: 'format',
          value: 'dc',
          options: [
            {
              value: 'dc',
              label: 'Simple Dublin Core'
            },
            {
              value: 'qdc',
              label: 'Qualified Dublin Core'
            },
            {
              value: 'dim',
              label: 'DSpace Intermediate Metadata'
            }
          ],
          disabled: true
        })
      ]
    }),
    new DynamicFormGroupModel({
      id: 'harvestContainer',
      group: [
        new DynamicRadioGroupModel<number>({
          id: 'harvest',
          name: 'harvest',
          value: 3,
          options: [
            {
              value: 1,
              label: 'Harvest metadata only.'
            },
            {
              value: 2,
              label: 'Harvest metadata and references to bitstreams (requires ORE support).'
            },
            {
              value: 3,
              label: 'Harvest metadata and bitstreams (requires ORE support).'
            }
          ]
        })
      ]
    })
  ];

  /**
   * Layout used for structuring the form inputs
   */
  formLayout: DynamicFormLayout = {
    provider: {
      grid: {
        host: 'col-12 d-inline-block'
      }
    },
    set: {
      grid: {
        host: 'col col-sm-6 d-inline-block'
      }
    },
    format: {
      grid: {
        host: 'col col-sm-6 d-inline-block'
      }
    },
    harvest: {
      grid: {
        host: 'col-12'
      }
    },
    setContainer: {
      grid: {
        host: 'row'
      }
    },
    providerContainer: {
      grid: {
        host: 'row'
      }
    },
    harvestContainer: {
      grid: {
        host: 'row'
      }
    }
  };

  /**
   * The form group of this form
   */
  formGroup: FormGroup;

  public constructor(public objectUpdatesService: ObjectUpdatesService,
                     public notificationsService: NotificationsService,
                     protected location: Location,
                     protected formService: DynamicFormService,
                     protected translate: TranslateService,
                     protected route: ActivatedRoute) {
    super(objectUpdatesService, notificationsService, translate);
  }

  ngOnInit(): void {
    this.formGroup = this.formService.createFormGroup(this.formModel);
    this.collectionRD$ = this.route.parent.data.pipe(first(), map((data) => data.dso));

    /* Create a new ContentSource object - TODO: Update to be fetched from the collection */
    this.contentSource = new ContentSource();

    this.updateFieldTranslations();
    this.translate.onLangChange
      .subscribe(() => {
        this.updateFieldTranslations();
      });
  }

  /**
   * Used the update translations of errors and labels on init and on language change
   */
  private updateFieldTranslations() {
    this.formModel.forEach(
      (fieldModel: DynamicFormControlModel) => {
        if (fieldModel instanceof DynamicFormGroupModel) {
          fieldModel.group.forEach((childModel: DynamicFormControlModel) => {
            this.updateFieldTranslation(childModel);
          });
        } else {
          this.updateFieldTranslation(fieldModel);
        }
      }
    );
  }

  /**
   * Update the translations of a DynamicInputModel
   * @param fieldModel
   */
  private updateFieldTranslation(fieldModel: DynamicFormControlModel) {
    fieldModel.label = this.translate.instant(this.LABEL_KEY_PREFIX + fieldModel.id);
    if (isNotEmpty(fieldModel.validators)) {
      fieldModel.errorMessages = {};
      Object.keys(fieldModel.validators).forEach((key) => {
        fieldModel.errorMessages[key] = this.translate.instant(this.ERROR_KEY_PREFIX + fieldModel.id + '.' + key);
      });
    }
  }

  onChange(event) {
    // TODO: Update ContentSource object and add to field update
    console.log(event);
  }

  onSubmit() {
    // TODO: Fetch field update and send to REST API
    console.log('submit');
  }

  onCancel() {
    this.location.back();
  }

  changeExternalSource() {
    this.contentSource.enabled = !this.contentSource.enabled;
    if (this.contentSource.enabled) {
      this.formGroup.enable();
    } else {
      this.formGroup.disable();
    }
  }
}
