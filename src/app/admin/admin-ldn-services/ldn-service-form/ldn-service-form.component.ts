import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  NgbDropdownModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Operation } from 'fast-json-patch';
import {
  combineLatestWith,
  Observable,
  Subscription,
} from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';

import { FindListOptions } from '../../../core/data/find-list-options.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { IpV4Validator } from '../../../shared/utils/ipV4.validator';
import { LdnItemfiltersService } from '../ldn-services-data/ldn-itemfilters-data.service';
import { LdnServicesService } from '../ldn-services-data/ldn-services-data.service';
import { LDN_SERVICE } from '../ldn-services-model/ldn-service.resource-type';
import { Itemfilter } from '../ldn-services-model/ldn-service-itemfilters';
import { NotifyServicePattern } from '../ldn-services-model/ldn-service-patterns.model';
import { LdnService } from '../ldn-services-model/ldn-services.model';
import { notifyPatterns } from '../ldn-services-patterns/ldn-service-coar-patterns';

/**
 * Component for editing LDN service through a form that allows to create or edit the properties of a service
 */
@Component({
  selector: 'ds-ldn-service-form',
  templateUrl: './ldn-service-form.component.html',
  styleUrls: ['./ldn-service-form.component.scss'],
  standalone: true,
  animations: [
    trigger('toggleAnimation', [
      state('true', style({})),
      state('false', style({})),
      transition('true <=> false', animate('300ms ease-in')),
    ]),
  ],
  imports: [
    AsyncPipe,
    NgbDropdownModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class LdnServiceFormComponent implements OnInit, OnDestroy {
  formModel: FormGroup;

  @ViewChild('confirmModal', { static: true }) confirmModal: TemplateRef<any>;
  @ViewChild('resetFormModal', { static: true }) resetFormModal: TemplateRef<any>;

  public inboundPatterns: string[] = notifyPatterns;
  public isNewService: boolean;
  public areControlsInitialized: boolean;
  public itemFiltersRD$: Observable<RemoteData<PaginatedList<Itemfilter>>>;
  public config: FindListOptions = Object.assign(new FindListOptions(), {
    elementsPerPage: 20,
  });
  public markedForDeletionInboundPattern: number[] = [];
  public selectedInboundPatterns: string[];

  protected serviceId: string;

  private deletedInboundPatterns: number[] = [];
  private modalRef: any;
  private ldnService: LdnService;
  private selectPatternDefaultLabelI18Key = 'ldn-service.form.label.placeholder.default-select';
  private routeSubscription: Subscription;

  constructor(
    protected ldnServicesService: LdnServicesService,
    private ldnItemFiltersService: LdnItemfiltersService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    protected modalService: NgbModal,
    private notificationService: NotificationsService,
    private translateService: TranslateService,
    protected paginationService: PaginationService,
  ) {

    this.formModel = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
      url: ['', Validators.required],
      ldnUrl: ['', Validators.required],
      lowerIp: ['', [Validators.required, new IpV4Validator()]],
      upperIp: ['', [Validators.required, new IpV4Validator()]],
      score: ['', [Validators.required, Validators.pattern('^0*(\.[0-9]+)?$|^1(\.0+)?$')]], inboundPattern: [''],
      constraintPattern: [''],
      enabled: [''],
      usesActorEmailId: [''],
      type: LDN_SERVICE.value,
    });
  }

  ngOnInit(): void {
    this.routeSubscription =  this.route.params.pipe(
      combineLatestWith(this.route.url),
    ).subscribe(([params, segment]) => {
      this.serviceId = params.serviceId;
      this.isNewService = segment[0].path === 'new';
      this.formModel.addControl('notifyServiceInboundPatterns', this.formBuilder.array([this.createInboundPatternFormGroup()]));
      this.areControlsInitialized = true;
      if (this.serviceId && !this.isNewService) {
        this.fetchServiceData(this.serviceId);
      }
    });
    this.setItemFilters();
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  /**
   * Sets item filters using LDN item filters service
   */
  setItemFilters() {
    this.itemFiltersRD$ = this.ldnItemFiltersService.findAll().pipe(
      getFirstCompletedRemoteData());
  }

  /**
   * Handles the creation of an LDN service by retrieving and validating form fields,
   * and submitting the form data to the LDN services endpoint.
   */
  createService() {
    this.formModel.markAllAsTouched();

    if (this.formModel.invalid) {
      this.closeModal();
      return;
    }

    this.formModel.value.notifyServiceInboundPatterns = this.formModel.value.notifyServiceInboundPatterns.map((pattern: {
      pattern: string;
      patternLabel: string,
      constraintFormatted: string;
    }) => {
      const { patternLabel, ...rest } = pattern;
      delete rest.constraintFormatted;
      return rest;
    });

    const values = { ...this.formModel.value, enabled: true,
      usesActorEmailId: this.formModel.get('usesActorEmailId').value };

    const ldnServiceData = this.ldnServicesService.create(values);

    ldnServiceData.pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((rd: RemoteData<LdnService>) => {
      if (rd.hasSucceeded) {
        this.notificationService.success(this.translateService.get('ldn-service-notification.created.success.title'),
          this.translateService.get('ldn-service-notification.created.success.body'));
        this.closeModal();
        this.sendBack();
      } else {
        if (!this.formModel.errors) {
          this.setLdnUrlError();
        }
        this.notificationService.error(this.translateService.get('ldn-service-notification.created.failure.title'),
          this.translateService.get('ldn-service-notification.created.failure.body'));
        this.closeModal();
      }
    });
  }

  /**
   * Checks if at least one pattern in the specified form array has a value.
   *
   * @param {FormArray} formArray - The form array containing patterns to check.
   * @returns {boolean} - True if at least one pattern has a value, otherwise false.
   */
  checkPatterns(formArray: FormArray): boolean {
    for (let i = 0; i < formArray.length; i++) {
      const pattern = formArray.at(i).get('pattern').value;
      if (pattern) {
        return true;
      }
    }
    return false;
  }

  /**
   * Fetches LDN service data by ID and updates the form
   * @param serviceId - The ID of the LDN service
   */
  fetchServiceData(serviceId: string): void {
    this.ldnServicesService.findById(serviceId).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe(
      (data: RemoteData<LdnService>) => {
        if (data.hasSucceeded) {
          this.ldnService = data.payload;
          this.formModel.patchValue({
            id: this.ldnService.id,
            name: this.ldnService.name,
            description: this.ldnService.description,
            url: this.ldnService.url,
            score: this.ldnService.score,
            ldnUrl: this.ldnService.ldnUrl,
            type: this.ldnService.type,
            enabled: this.ldnService.enabled,
            usesActorEmailId: this.ldnService.usesActorEmailId,
            lowerIp: this.ldnService.lowerIp,
            upperIp: this.ldnService.upperIp,
          });
          this.filterPatternObjectsAndAssignLabel('notifyServiceInboundPatterns');
          const notifyServiceInboundPatternsFormArray = this.formModel.get('notifyServiceInboundPatterns') as FormArray;
          notifyServiceInboundPatternsFormArray.controls.forEach(
            control => {
              const controlFormGroup = control as FormGroup;
              const controlConstraint = controlFormGroup.get('constraint').value;
              controlFormGroup.patchValue({
                constraintFormatted: controlConstraint ? this.translateService.instant((controlConstraint as string) + '.label') : '',
              });
            },
          );
        }
      },
    );
  }

  /**
   * Filters pattern objects, initializes form groups, assigns labels, and adds them to the specified form array so the correct string is shown in the dropdown.
   * @param formArrayName - The name of the form array to be populated
   */
  filterPatternObjectsAndAssignLabel(formArrayName: string) {
    const PatternsArray = this.formModel.get(formArrayName) as FormArray;
    PatternsArray.clear();

    const servicesToUse = [...this.ldnService.notifyServiceInboundPatterns];
    if (servicesToUse.length === 0) {
      servicesToUse.push({ pattern: '', constraint: '', automatic: 'false' });
    }

    servicesToUse.forEach((patternObj: NotifyServicePattern) => {
      const patternFormGroup = this.initializeInboundPatternFormGroup();
      const patternLabel = patternObj?.pattern ? 'ldn-service.form.pattern.' + patternObj?.pattern + '.label' : 'ldn-service.form.label.placeholder.default-select';
      const newPatternObjWithLabel = Object.assign(new NotifyServicePattern(), {
        ...patternObj,
        patternLabel: this.translateService.instant(patternLabel),
      });
      patternFormGroup.patchValue(newPatternObjWithLabel);

      PatternsArray.push(patternFormGroup);
      this.cdRef.detectChanges();
    });
  }

  /**
   * Generates an array of patch operations based on form changes
   * @returns Array of patch operations
   */
  generatePatchOperations(): any[] {
    const patchOperations: any[] = [];

    this.createReplaceOperation(patchOperations, 'name', '/name');
    this.createReplaceOperation(patchOperations, 'description', '/description');
    this.createReplaceOperation(patchOperations, 'ldnUrl', '/ldnurl');
    this.createReplaceOperation(patchOperations, 'url', '/url');
    this.createReplaceOperation(patchOperations, 'score', '/score');
    this.createReplaceOperation(patchOperations, 'lowerIp', '/lowerIp');
    this.createReplaceOperation(patchOperations, 'upperIp', '/upperIp');

    this.handlePatterns(patchOperations, 'notifyServiceInboundPatterns');
    this.deletedInboundPatterns.forEach(index => {
      const removeOperation: Operation = {
        op: 'remove',
        path: `notifyServiceInboundPatterns[${index}]`,
      };
      patchOperations.push(removeOperation);
    });

    return patchOperations;
  }

  /**
   * Submits the form by opening the confirmation modal
   */
  onSubmit() {
    this.openConfirmModal(this.confirmModal);
  }

  /**
   * Adds a new inbound pattern form group to the array of inbound patterns in the form
   */
  addInboundPattern() {
    const notifyServiceInboundPatternsArray = this.formModel.get('notifyServiceInboundPatterns') as FormArray;
    notifyServiceInboundPatternsArray.push(this.createInboundPatternFormGroup());
  }

  /**
   * Selects an inbound pattern by updating its values based on the provided pattern value and index
   * @param patternValue - The selected pattern value
   * @param index - The index of the inbound pattern in the array
   */
  selectInboundPattern(patternValue: string, index: number): void {
    const patternArray = (this.formModel.get('notifyServiceInboundPatterns') as FormArray);
    patternArray.controls[index].patchValue({ pattern: patternValue });
    patternArray.controls[index].patchValue({ patternLabel: this.translateService.instant('ldn-service.form.pattern.' + patternValue + '.label') });
  }

  /**
   * Selects an inbound item filter by updating its value based on the provided filter value and index
   * @param filterValue - The selected filter value
   * @param index - The index of the inbound pattern in the array
   */
  selectInboundItemFilter(filterValue: string, index: number): void {
    const filterArray = (this.formModel.get('notifyServiceInboundPatterns') as FormArray);
    filterArray.controls[index].patchValue({
      constraint: filterValue,
      constraintFormatted: this.translateService.instant((filterValue !== '' ? filterValue : 'ldn.no-filter') + '.label'),
    });
    filterArray.markAllAsTouched();
  }

  /**
   * Toggles the automatic property of an inbound pattern at the specified index
   * @param i - The index of the inbound pattern in the array
   */
  toggleAutomatic(i: number) {
    const automaticControl = this.formModel.get(`notifyServiceInboundPatterns.${i}.automatic`);
    if (automaticControl) {
      automaticControl.markAsTouched();
      automaticControl.setValue(!automaticControl.value);
    }
  }

  /**
   * Toggles the enabled status of the LDN service by sending a patch request
   */
  toggleEnabled() {
    const newStatus = !this.formModel.get('enabled').value;

    const patchOperation: Operation = {
      op: 'replace',
      path: '/enabled',
      value: newStatus,
    };

    this.ldnServicesService.patch(this.ldnService, [patchOperation]).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe(
      () => {
        this.formModel.get('enabled').setValue(newStatus);
        this.cdRef.detectChanges();
      },
    );
  }

  /**
   * Toggles the usesActorEmailId field of the LDN service by sending a patch request
   */
  toggleUsesActorEmailId() {
    const newStatus = !this.formModel.get('usesActorEmailId').value;
    if (!this.isNewService) {
      const patchOperation: Operation = {
        op: 'replace',
        path: '/usesActorEmailId',
        value: newStatus,
      };

      this.ldnServicesService.patch(this.ldnService, [patchOperation]).pipe(
        getFirstCompletedRemoteData(),
      ).subscribe(
        () => {
          this.formModel.get('usesActorEmailId').setValue(newStatus);
          this.cdRef.detectChanges();
        },
      );
    } else {
      this.formModel.get('usesActorEmailId').setValue(newStatus);
      this.cdRef.detectChanges();
    }
  }

  /**
   * Closes the modal
   */
  closeModal() {
    this.modalRef.close();
    this.cdRef.detectChanges();
  }

  /**
   * Opens a confirmation modal with the specified content
   * @param content - The content to be displayed in the modal
   */
  openConfirmModal(content) {
    this.modalRef = this.modalService.open(content);
  }

  /**
   * Patches the LDN service by retrieving and sending patch operations generated in generatePatchOperations()
   */
  patchService() {
    this.deleteMarkedInboundPatterns();

    const patchOperations = this.generatePatchOperations();
    this.formModel.markAllAsTouched();
    // If the form is invalid, close the modal and return
    if (this.formModel.invalid) {
      this.closeModal();
      return;
    }

    this.ldnServicesService.patch(this.ldnService, patchOperations).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe(
      (rd: RemoteData<LdnService>) => {
        if (rd.hasSucceeded) {
          this.closeModal();
          this.sendBack();
          this.notificationService.success(this.translateService.get('admin.registries.services-formats.modify.success.head'),
            this.translateService.get('admin.registries.services-formats.modify.success.content'));
        } else {
          if (!this.formModel.errors) {
            this.setLdnUrlError();
          }
          this.notificationService.error(this.translateService.get('admin.registries.services-formats.modify.failure.head'),
            this.translateService.get('admin.registries.services-formats.modify.failure.content'));
          this.closeModal();
        }
      });
  }

  /**
   * Resets the form and navigates back to the LDN services page
   */
  resetFormAndLeave() {
    this.sendBack();
  }

  /**
   * Marks the specified inbound pattern for deletion
   * @param index - The index of the inbound pattern in the array
   */
  markForInboundPatternDeletion(index: number) {
    if (!this.markedForDeletionInboundPattern.includes(index)) {
      this.markedForDeletionInboundPattern.push(index);
    }
  }

  /**
   * Unmarks the specified inbound pattern for deletion
   * @param index - The index of the inbound pattern in the array
   */
  unmarkForInboundPatternDeletion(index: number) {
    const i = this.markedForDeletionInboundPattern.indexOf(index);
    if (i !== -1) {
      this.markedForDeletionInboundPattern.splice(i, 1);
    }
  }

  /**
   * Deletes marked inbound patterns from the form model
   */
  deleteMarkedInboundPatterns() {
    this.markedForDeletionInboundPattern.sort((a, b) => b - a);
    const patternsArray = this.formModel.get('notifyServiceInboundPatterns') as FormArray;

    for (const index of this.markedForDeletionInboundPattern) {
      if (index >= 0 && index < patternsArray.length) {
        const patternGroup = patternsArray.at(index) as FormGroup;
        const patternValue = patternGroup.value;
        if (patternValue.isNew) {
          patternsArray.removeAt(index);
        } else {
          this.deletedInboundPatterns.push(index);
        }
      }
    }

    this.markedForDeletionInboundPattern = [];
  }

  /**
   * Creates a replace operation and adds it to the patch operations if the form control is dirty
   * @param patchOperations - The array to store patch operations
   * @param formControlName - The name of the form control
   * @param path - The JSON Patch path for the operation
   */
  private createReplaceOperation(patchOperations: any[], formControlName: string, path: string): void {
    if (this.formModel.get(formControlName).dirty) {
      patchOperations.push({
        op: 'replace',
        path,
        value: this.formModel.get(formControlName).value.toString(),
      });
    }
  }

  /**
   * Handles patterns in the form array, checking if an add or replace operations is required
   * @param patchOperations - The array to store patch operations
   * @param formArrayName - The name of the form array
   */
  private handlePatterns(patchOperations: any[], formArrayName: string): void {
    const patternsArray = this.formModel.get(formArrayName) as FormArray;

    for (let i = 0; i < patternsArray.length; i++) {
      const patternGroup = patternsArray.at(i) as FormGroup;

      const patternValue = patternGroup.value;
      delete patternValue.constraintFormatted;
      if (patternGroup.touched && patternGroup.valid) {
        delete patternValue?.patternLabel;
        if (patternValue.isNew) {
          delete patternValue.isNew;
          const addOperation = {
            op: 'add',
            path: `${formArrayName}/-`,
            value: patternValue,
          };
          patchOperations.push(addOperation);
        } else {
          const replaceOperation = {
            op: 'replace',
            path: `${formArrayName}[${i}]`,
            value: patternValue,
          };
          patchOperations.push(replaceOperation);
        }
      }
    }
  }

  /**
   * Navigates back to the LDN services page
   */
  private sendBack() {
    this.router.navigateByUrl('admin/ldn/services');
  }

  /**
   * Creates a form group for inbound patterns
   * @returns The form group for inbound patterns
   */
  private createInboundPatternFormGroup(): FormGroup {
    const inBoundFormGroup = {
      pattern: '',
      patternLabel: this.translateService.instant(this.selectPatternDefaultLabelI18Key),
      constraint: '',
      constraintFormatted: '',
      automatic: false,
      isNew: true,
    };

    if (this.isNewService) {
      delete inBoundFormGroup.isNew;
    }

    return this.formBuilder.group(inBoundFormGroup);
  }

  /**
   * Initializes an existing form group for inbound patterns
   * @returns The initialized form group for inbound patterns
   */
  private initializeInboundPatternFormGroup(): FormGroup {
    return this.formBuilder.group({
      pattern: '',
      patternLabel: '',
      constraint: '',
      constraintFormatted: '',
      automatic: '',
    });
  }


  /**
   * set ldnUrl error in case of unprocessable entity and provided value
   */
  private setLdnUrlError(): void {
    const control = this.formModel.controls.ldnUrl;
    const controlErrors = control.errors || {};
    control.setErrors({ ...controlErrors, ldnUrlAlreadyAssociated: true });
  }
}
