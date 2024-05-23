import {
  AsyncPipe,
  NgClass,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormControlModel,
  DynamicFormService,
  DynamicInputModel,
} from '@ng-dynamic-forms/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Operation } from 'fast-json-patch';
import { ReplaceOperation } from 'fast-json-patch/module/core';
import { FileUploader } from 'ng2-file-upload';
import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
  Observable,
  Subscription,
  switchMap,
} from 'rxjs';
import {
  filter,
  take,
} from 'rxjs/operators';

import { LangConfig } from '../../../../../config/lang-config.interface';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/auth/auth.service';
import { ObjectCacheService } from '../../../../core/cache/object-cache.service';
import { ComColDataService } from '../../../../core/data/comcol-data.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { RequestService } from '../../../../core/data/request.service';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Collection } from '../../../../core/shared/collection.model';
import { Community } from '../../../../core/shared/community.model';
import {
  MetadataMap,
  MetadataValue,
} from '../../../../core/shared/metadata.models';
import { NoContent } from '../../../../core/shared/NoContent.model';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { ResourceType } from '../../../../core/shared/resource-type';
import { ConfirmationModalComponent } from '../../../confirmation-modal/confirmation-modal.component';
import {
  hasValue,
  isNotEmpty,
} from '../../../empty.util';
import { FormComponent } from '../../../form/form.component';
import { NotificationsService } from '../../../notifications/notifications.service';
import { UploaderComponent } from '../../../upload/uploader/uploader.component';
import { UploaderOptions } from '../../../upload/uploader/uploader-options.model';
import { followLink } from '../../../utils/follow-link-config.model';
import { VarDirective } from '../../../utils/var.directive';
import { ComcolPageLogoComponent } from '../../comcol-page-logo/comcol-page-logo.component';

/**
 * A form for creating and editing Communities or Collections
 */
@Component({
  selector: 'ds-comcol-form',
  styleUrls: ['./comcol-form.component.scss'],
  templateUrl: './comcol-form.component.html',
  imports: [
    FormComponent,
    TranslateModule,
    UploaderComponent,
    AsyncPipe,
    ComcolPageLogoComponent,
    NgIf,
    NgClass,
    NgForOf,
    VarDirective,
    ReactiveFormsModule,
    FormsModule,
  ],
  standalone: true,
})
export class ComColFormComponent<T extends Collection | Community> implements OnInit, OnDestroy {

  /**
   * The logo uploader component
   */
  @ViewChild(UploaderComponent) uploaderComponent: UploaderComponent;

  /**
   * DSpaceObject that the form represents
   */
  @Input() dso: T;

  /**
   * Boolean that represents if the comcol is being created or already exists
   */
  @Input() isCreation!: boolean;

  /**
   * Type of DSpaceObject that the form represents
   */
  type: ResourceType;

  /**
   * @type {string} Key prefix used to generate form labels
   */
  LABEL_KEY_PREFIX = '.form.';

  /**
   * @type {string} Key prefix used to generate form error messages
   */
  ERROR_KEY_PREFIX = '.form.errors.';

  /**
   * The form model that represents the fields in the form
   */
  formModels: Map<string, DynamicFormControlModel[]> = new Map();

  /**
   * The form for the selected current language
   */
  currentAlternativeForm: DynamicFormControlModel[];

  /**
   * The default language from config
   */
  defaultLanguageCode: string;

  /**
   * The current page language string
   */
  defaultLanguage: string | null;

  /**
   * The current page outlet string
   */
  currentLanguageCode: string | null;

  /**
   * All languages used by application
   */
  languages: LangConfig[];

  /**
   * The uploader configuration options
   * @type {UploaderOptions}
   */
  uploadFilesOptions: UploaderOptions = Object.assign(new UploaderOptions(), {
    autoUpload: false,
  });

  /**
   * Emits DSO and Uploader when the form is submitted
   */
  @Output() submitForm: EventEmitter<{
    dso: T,
    operations: Operation[],
    uploader?: FileUploader
  }> = new EventEmitter();

  /**
   * Event emitted on back
   */
  @Output() back: EventEmitter<any> = new EventEmitter();

  /**
   * Event emitted on finish
   */
  @Output() finish: EventEmitter<any> = new EventEmitter();


  /**
   * Observable keeping track whether the uploader has finished initializing
   * Used to start rendering the uploader component
   */
  initializedUploaderOptions = new BehaviorSubject(false);

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * The service used to fetch from or send data to
   */
  protected dsoService: ComColDataService<Community | Collection>;

  public uploader = new FileUploader(this.uploadFilesOptions);

  protected readonly refreshDSO$ = new EventEmitter<void>();

  public constructor(protected formService: DynamicFormService,
                     protected translate: TranslateService,
                     protected notificationsService: NotificationsService,
                     protected authService: AuthService,
                     protected requestService: RequestService,
                     protected objectCache: ObjectCacheService,
                     protected modalService: NgbModal,
                     protected cdr: ChangeDetectorRef){
  }

  ngOnInit(): void {
    this.uploadFilesOptions.autoUpload = !this.isCreation;

    if (this.formModels.size > 0) {
      this.formModels.forEach((formModel, language) => {
        formModel.forEach(
          (fieldModel: DynamicInputModel) => {
            fieldModel.value = this.dso.firstMetadataValue(fieldModel.name, { language });
          },
        );
      });

      this.updateFieldTranslations();
      if (this.currentLanguageCode) {
        this.currentAlternativeForm = this.formModels.get(this.currentLanguageCode);
      }

      this.translate.onLangChange
        .subscribe(() => {
          this.updateFieldTranslations();
        });

      if (hasValue(this.dso.id)) {
        this.subs.push(
          observableCombineLatest([
            this.dsoService.getLogoEndpoint(this.dso.id),
            this.dso.logo,
          ]).subscribe(([href, logoRD]: [string, RemoteData<Bitstream>]) => {
            this.uploadFilesOptions.url = href;
            this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
            this.initializedUploaderOptions.next(true);
          }),
        );
      } else {
        // Set a placeholder URL to not break the uploader component. This will be replaced once the object is created.
        this.uploadFilesOptions.url = 'placeholder';
        this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
        this.initializedUploaderOptions.next(true);
      }
    }

    this.subs.push(
      this.refreshDSO$.pipe(
        switchMap(() => this.refreshDsoCache()),
        filter(rd => rd.hasSucceeded),
      ).subscribe(({ payload }) => this.dso = payload),
    );

  }

  /**
   * Checks which new fields were added and sends the updated version of the DSO to the parent component
   */
  onSubmit() {
    const formMetadata = {}  as MetadataMap;
    const operations: Map<string, ReplaceOperation<{value: string, language: string}[]>> = new Map();

    this.formModels.forEach((formModel, language) => {
      formModel.forEach(
        (fieldModel: DynamicInputModel) => {
          const value: MetadataValue = {
            value: fieldModel.value as string,
            language,
          } as any;

          if (formMetadata.hasOwnProperty(fieldModel.name)) {
            formMetadata[fieldModel.name].push(value);
          } else {
            formMetadata[fieldModel.name] = [value];
          }

          const key = `/metadata/${fieldModel.name}`;

          const keyExistAndAtLeastOneValueIsNotNull: boolean = (fieldModel.value !== null || this.dso.firstMetadataValue(fieldModel.name, { language }) !== null);

          if ( keyExistAndAtLeastOneValueIsNotNull) {
            if (operations.has(key)) {
              const operation: Operation = operations.get(key);
              operation.value.push({
                value: fieldModel.value,
                language,
              });
            } else {
              operations.set(key, {
                op: 'replace',
                path: key,
                value: [{
                  value: fieldModel.value as string,
                  language,
                }],
              });
            }
          }
        },
      );
    });

    const updatedDSO = Object.assign({}, this.dso, {
      metadata: {
        ...this.dso.metadata,
        ...formMetadata,
      },
      type: Community.type,
    });

    if (this.isCreation) {
      this.submitForm.emit({
        dso: updatedDSO,
        uploader: hasValue(this.uploaderComponent) ? this.uploaderComponent.uploader : undefined,
        operations: [...operations.values()],
      });
    } else {
      this.submitForm.emit({
        dso: updatedDSO,
        operations: [...operations.values()],
      });
    }
  }

  changeLanguage() {
    // Because the ds-form require destroy (we cannot change formModel without destroy) we need to remove the component from template
    this.currentAlternativeForm = null;
    // Detect changes push the form to rerender, that cause the destroy of the form
    this.cdr.detectChanges();
    // And then we can add a component again by providing a new language form
    this.currentAlternativeForm = this.formModels.get(this.currentLanguageCode);
  }

  /**
   * Initialize language method that provide all necessary information for creation, validation, labaling & form submission
   */
  initializeLanguage() {
    this.defaultLanguageCode = environment.defaultLanguage;
    this.defaultLanguage = environment.languages.find(lang => lang.code === this.defaultLanguageCode).label;

    this.languages = environment.languages.filter(lang => lang.code !== this.defaultLanguageCode);
    this.currentLanguageCode = this.languages.length > 0 ? this.languages[0].code : null;
  }

  /**
   * Used the update translations of errors and labels on init and on language change
   */
  private updateFieldTranslations() {
    [this.defaultLanguageCode, ...this.languages.map(lang => lang.code)].forEach(lang => {
      const langFormModel = this.formModels.get(lang);
      langFormModel.forEach(
        (fieldModel: DynamicInputModel) => {
          fieldModel.label = this.translate.instant(this.type.value + this.LABEL_KEY_PREFIX + fieldModel.id.replace(`-${lang}`, ''));
          if (isNotEmpty(fieldModel.validators)) {
            fieldModel.errorMessages = {};
            Object.keys(fieldModel.validators).forEach((key) => {
              fieldModel.errorMessages[key] = this.translate.instant(this.type.value + this.ERROR_KEY_PREFIX + fieldModel.id.replace(`-${lang}`, '') + '.' + key);
            });
          }
        },
      );
    });
  }

  /**
   * Helper method that confirms the deletion of the logo opening a confirmation modal
   */
  confirmLogoDeleteWithModal(): void {
    const modalRef = this.createConfirmationModal();
    this.subscribeToConfirmationResponse(modalRef);
  }

  /**
   * Creates and opens the confirmation modal
   * @returns Reference to the opened modal
   */
  createConfirmationModal(): NgbModalRef {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.headerLabel = 'community-collection.edit.logo.delete.title';
    modalRef.componentInstance.infoLabel = 'confirmation-modal.delete-community-collection-logo.info';
    modalRef.componentInstance.cancelLabel = 'form.cancel';
    modalRef.componentInstance.confirmLabel = 'community-collection.edit.logo.delete.title';
    modalRef.componentInstance.confirmIcon = 'fas fa-trash';
    modalRef.componentInstance.brandColor = 'danger';
    return modalRef;
  }

  /**
   * Subscribes to the confirmation modal's response and calls the logo deletion handler if confirmed
   * @param modalRef References to the opened confirmation modal
   */
  subscribeToConfirmationResponse(modalRef: NgbModalRef): void {
    modalRef.componentInstance.response.pipe(
      take(1),
    ).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.handleLogoDeletion();
      }
    });
  }

  /**
   * Method that confirms the deletion of the logo, handling both possible outcomes
   */
  handleLogoDeletion(): void {
    if (hasValue(this.dso.id) && hasValue(this.dso._links.logo)) {
      this.dsoService.deleteLogo(this.dso).pipe(
        getFirstCompletedRemoteData(),
      ).subscribe((response: RemoteData<NoContent>) => {
        const successMessageKey = `${this.type.value}.edit.logo.notifications.delete.success`;
        const errorMessageKey = `${this.type.value}.edit.logo.notifications.delete.error`;

        if (response.hasSucceeded) {
          this.handleSuccessfulDeletion(successMessageKey);
        } else {
          this.handleFailedDeletion(errorMessageKey, response.errorMessage);
        }

      });
    }
  }


  /**
   * Handles successful logo deletion
   * @param successMessageKey Translation key for success message
   */
  private handleSuccessfulDeletion(successMessageKey: string): void {
    this.refreshDSO$.next();
    this.notificationsService.success(
      this.translate.get(`${successMessageKey}.title`),
      this.translate.get(`${successMessageKey}.content`),
    );
  }

  /**
   * Handles failed logo deletion
   * @param errorMessageKey Translation key for error message
   * @param errorMessage Error message from the response
   */
  private handleFailedDeletion(errorMessageKey: string, errorMessage: string): void {
    this.notificationsService.error(
      this.translate.get(`${errorMessageKey}.title`),
      errorMessage,
    );
  }

  /**
   * Refresh the object's cache to obtain the latest version
   */
  private refreshDsoCache() {
    this.clearDsoCache();
    return this.fetchUpdatedDso();
  }

  /**
   * Clears the cache related to the current dso
   */
  private clearDsoCache() {
    this.requestService.setStaleByHrefSubstring(this.dso.id);
    this.objectCache.remove(this.dso._links.self.href);
  }

  /**
   * Fetches the latest data for the dso
   */
  private fetchUpdatedDso(): Observable<RemoteData<T>> {
    return this.dsoService.findById(this.dso.id, false, true, followLink('logo')).pipe(
      getFirstCompletedRemoteData(),
    ) as Observable<RemoteData<T>>;
  }



  /**
   * The request was successful, display a success notification
   */
  public onCompleteItem() {
    if (hasValue(this.dso.id)) {
      this.refreshDSO$.next();
    }
    if (this.isCreation) {
      this.finish.emit();
    }
    this.notificationsService.success(null, this.translate.get(this.type.value + '.edit.logo.notifications.add.success'));
  }

  /**
   * The request was unsuccessful, display an error notification
   */
  public onUploadError() {
    this.notificationsService.error(null, this.translate.get(this.type.value + '.edit.logo.notifications.add.error'));
  }

  /**
   * Unsubscribe from open subscriptions
   */
  ngOnDestroy(): void {
    this.refreshDSO$.complete();
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
