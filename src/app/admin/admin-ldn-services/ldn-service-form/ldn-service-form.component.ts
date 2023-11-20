import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {LdnServicesService} from '../ldn-services-data/ldn-services-data.service';
import {notifyPatterns} from '../ldn-services-patterns/ldn-service-coar-patterns';
import {LDN_SERVICE} from '../ldn-services-model/ldn-service.resource-type';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {getFirstCompletedRemoteData} from '../../../core/shared/operators';
import {RemoteData} from '../../../core/data/remote-data';
import {LdnService} from '../ldn-services-model/ldn-services.model';
import {NotificationsService} from '../../../shared/notifications/notifications.service';
import {TranslateService} from '@ngx-translate/core';
import {PaginatedList} from '../../../core/data/paginated-list.model';
import {Itemfilter} from '../ldn-services-model/ldn-service-itemfilters';
import {Observable} from 'rxjs';
import {FindListOptions} from '../../../core/data/find-list-options.model';
import {PaginationComponentOptions} from '../../../shared/pagination/pagination-component-options.model';
import {LdnItemfiltersService} from '../ldn-services-data/ldn-itemfilters-data.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

/**
 * Angular component representing the form for creating or editing LDN services.
 * This component handles the creation, validation, and submission of LDN service data.
 */
@Component({
  selector: 'ds-ldn-service-form',
  templateUrl: './ldn-service-form.component.html',
  styleUrls: ['./ldn-service-form.component.scss'],
  animations: [
    trigger('toggleAnimation', [
      state('true', style({})),
      state('false', style({})),
      transition('true <=> false', animate('300ms ease-in')),
    ]),
  ],
})
export class LdnServiceFormComponent implements OnInit {
  formModel: FormGroup;
  @ViewChild('confirmModal', {static: true}) confirmModal: TemplateRef<any>;
  @ViewChild('resetFormModal', {static: true}) resetFormModal: TemplateRef<any>;
  public inboundPatterns: string[] = notifyPatterns;
  public outboundPatterns: string[] = notifyPatterns;
  itemfiltersRD$: Observable<RemoteData<PaginatedList<Itemfilter>>>;
  config: FindListOptions = Object.assign(new FindListOptions(), {
    elementsPerPage: 20
  });
  pageConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'po',
    pageSize: 20
  });
  @Input() public name: string;
  @Input() public description: string;
  @Input() public url: string;
  @Input() public score: string;
  @Input() public ldnUrl: string;
  @Input() public inboundPattern: string;
  @Input() public outboundPattern: string;
  @Input() public constraint: string;
  @Input() public automatic: boolean;
  @Input() public headerKey: string;
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  @Output() cancelForm: EventEmitter<any> = new EventEmitter();
  selectedOutboundPatterns: string[];
  selectedInboundPatterns: string[];
  selectedInboundItemfilters: string[];
  selectedOutboundItemfilters: string[];
  hasInboundPattern: boolean;
  hasOutboundPattern: boolean;
  isScoreValid: boolean;
  private modalRef: any;

  constructor(
    private ldnServicesService: LdnServicesService,
    private ldnItemfiltersService: LdnItemfiltersService,
    private formBuilder: FormBuilder,
    private router: Router,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef,
    protected modalService: NgbModal,
  ) {

    this.formModel = this.formBuilder.group({
      enabled: true,
      id: [''],
      name: ['', Validators.required],
      description: [''],
      url: ['', Validators.required],
      score: ['', [Validators.required, Validators.pattern('^0*(\.[0-9]+)?$|^1(\.0+)?$')]],
      ldnUrl: ['', Validators.required],
      inboundPattern: [''],
      outboundPattern: [''],
      constraintPattern: [''],
      notifyServiceInboundPatterns: this.formBuilder.array([this.createInboundPatternFormGroup()]),
      notifyServiceOutboundPatterns: this.formBuilder.array([this.createOutboundPatternFormGroup()]),
      type: LDN_SERVICE.value,
    });
  }

  ngOnInit(): void {
    this.setItemfilters();

  }

  /**
   * Sets up the item filters by fetching and observing the paginated list of item filters.
   */
  setItemfilters() {
    this.itemfiltersRD$ = this.ldnItemfiltersService.findAll().pipe(
      getFirstCompletedRemoteData());
  }

  /**
   * Handles the form submission by opening the confirmation modal.
   */
  onSubmit() {
    this.openConfirmModal(this.confirmModal);
  }

  /**
   * Opens the confirmation modal.
   *
   * @param {any} content - The content of the modal.
   */
  openConfirmModal(content) {
    this.modalRef = this.modalService.open(content);
  }

  /**
   * Opens the reset form modal.
   *
   * @param {any} content - The content of the modal.
   */
  openResetFormModal(content) {
    this.modalRef = this.modalService.open(content);
  }

  /**
   * Handles the creation of an LDN service by retrieving and validating form fields,
   * and submitting the form data to the LDN services endpoint.
   */
  createService() {
    this.formModel.get('name').markAsTouched();
    this.formModel.get('score').markAsTouched();
    this.formModel.get('url').markAsTouched();
    this.formModel.get('ldnUrl').markAsTouched();
    this.formModel.get('notifyServiceInboundPatterns').markAsTouched();
    this.formModel.get('notifyServiceOutboundPatterns').markAsTouched();

    const name = this.formModel.get('name').value;
    const url = this.formModel.get('url').value;
    const score = this.formModel.get('score').value;
    const ldnUrl = this.formModel.get('ldnUrl').value;

    const hasInboundPattern = this.checkPatterns(this.formModel.get('notifyServiceInboundPatterns') as FormArray);
    const hasOutboundPattern = this.checkPatterns(this.formModel.get('notifyServiceOutboundPatterns') as FormArray);

    if (!name || !url || !ldnUrl || !score || (!hasInboundPattern && !hasOutboundPattern)) {
      this.closeModal();
      return;
    }

    this.formModel.value.notifyServiceInboundPatterns = this.formModel.value.notifyServiceInboundPatterns.map((pattern: {
      pattern: string;
      patternLabel: string
    }) => {
      const {patternLabel, ...rest} = pattern;
      return rest;
    });

    this.formModel.value.notifyServiceOutboundPatterns = this.formModel.value.notifyServiceOutboundPatterns.map((pattern: {
      pattern: string;
      patternLabel: string
    }) => {
      const {patternLabel, ...rest} = pattern;
      return rest;
    });

    const values = this.formModel.value;

    const ldnServiceData = this.ldnServicesService.create(values);

    ldnServiceData.pipe(
      getFirstCompletedRemoteData()
    ).subscribe((rd: RemoteData<LdnService>) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get('ldn-service-notification.created.success.title'),
          this.translateService.get('ldn-service-notification.created.success.body'));

        this.sendBack();
        this.closeModal();
      } else {
        this.notificationsService.error(this.translateService.get('ldn-service-notification.created.failure.title'),
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
   * Closes the currently open modal and returns to the services directory..
   */
  resetFormAndLeave() {
    this.sendBack();
    this.closeModal();
  }

  /**
   * Closes the currently open modal and triggers change detection.
   */
  closeModal() {
    this.modalRef.close();
    this.cdRef.detectChanges();
  }

  /**
   * Adds a new inbound pattern form group to the notifyServiceInboundPatterns form array.
   */
  addInboundPattern() {
    const notifyServiceInboundPatternsArray = this.formModel.get('notifyServiceInboundPatterns') as FormArray;
    notifyServiceInboundPatternsArray.push(this.createInboundPatternFormGroup());
  }

  /**
   * Removes the inbound pattern form group at the specified index from the notifyServiceInboundPatterns form array.
   *
   * @param {number} index - The index of the inbound pattern form group to remove.
   * @memberof LdnServiceFormComponent
   */
  removeInboundPattern(index: number) {
    const notifyServiceInboundPatternsArray = this.formModel.get('notifyServiceInboundPatterns') as FormArray;
    notifyServiceInboundPatternsArray.removeAt(index);
  }

  /**
   * Adds a new outbound pattern form group to the notifyServiceOutboundPatterns form array.
   */
  addOutboundPattern() {
    const notifyServiceOutboundPatternsArray = this.formModel.get('notifyServiceOutboundPatterns') as FormArray;
    notifyServiceOutboundPatternsArray.push(this.createOutboundPatternFormGroup());
  }

  /**
   * Removes the outbound pattern form group at the specified index from the notifyServiceOutboundPatterns form array.
   *
   * @param {number} index - The index of the outbound pattern form group to remove.
   */
  removeOutboundPattern(index: number) {
    const notifyServiceOutboundPatternsArray = this.formModel.get('notifyServiceOutboundPatterns') as FormArray;
    notifyServiceOutboundPatternsArray.removeAt(index);
  }

  /**
   * Toggles the value of the 'automatic' control at the specified index in the notifyServiceInboundPatterns form array.
   *
   * @param {number} i - The index of the 'automatic' control to toggle.
   * @memberof LdnServiceFormComponent
   */
  toggleAutomatic(i: number) {
    const automaticControl = this.formModel.get(`notifyServiceInboundPatterns.${i}.automatic`);
    if (automaticControl) {
      automaticControl.setValue(!automaticControl.value);
    }
  }

  /**
   * Selects an outbound pattern for a specific index in the notifyServiceOutboundPatterns form array.
   *
   * @param {string} patternValue - The selected pattern value.
   * @param {number} index - The index of the outbound pattern in the form array.
   */
  selectOutboundPattern(patternValue: string, index: number): void {
    const patternArray = (this.formModel.get('notifyServiceOutboundPatterns') as FormArray);
    patternArray.controls[index].patchValue({pattern: patternValue});
    patternArray.controls[index].patchValue({patternLabel: this.translateService.instant('ldn-service.form.pattern.' + patternValue + '.label')});

  }

  /**
   * Selects an inbound pattern for a specific index in the form array.
   *
   * @param {string} patternValue - The selected pattern value.
   * @param {number} index - The index of the inbound pattern in the form array.
   */
  selectInboundPattern(patternValue: string, index: number): void {
    const patternArray = (this.formModel.get('notifyServiceInboundPatterns') as FormArray);
    patternArray.controls[index].patchValue({pattern: patternValue});
    patternArray.controls[index].patchValue({patternLabel: this.translateService.instant('ldn-service.form.pattern.' + patternValue + '.label')});

  }

  /**
   * Selects an inbound item filter for a specific index in the form array.
   *
   * @param {string} filterValue - The selected item filter value.
   * @param {number} index - The index of the inbound item filter in the form array.
   */
  selectInboundItemFilter(filterValue: string, index: number): void {
    const filterArray = (this.formModel.get('notifyServiceInboundPatterns') as FormArray);
    filterArray.controls[index].patchValue({constraint: filterValue});
  }

  /**
   * Selects an outbound item filter for a specific index in the form array.
   *
   * @param {string} filterValue - The selected item filter value.
   * @param {number} index - The index of the outbound item filter in the form array.
   */
  selectOutboundItemFilter(filterValue: string, index: number) {
    const filterArray = (this.formModel.get('notifyServiceOutboundPatterns') as FormArray);
    filterArray.controls[index].patchValue({constraint: filterValue});
  }

  /**
   * Sends the user back to the LDN services list.
   */
  private sendBack() {
    this.router.navigateByUrl('admin/ldn/services');
  }

  /**
   * Creates a form group for an outbound pattern in the notifyServiceOutboundPatterns form array.
   *
   * @private
   * @returns {FormGroup} - The created form group.
   */
  private createOutboundPatternFormGroup(): FormGroup {
    return this.formBuilder.group({
      pattern: [''],
      constraint: [''],
      patternLabel: 'Select a Pattern',
    });
  }

  /**
   * Creates a form group for an inbound pattern in the notifyServiceInboundPatterns form array.
   *
   * @private
   * @returns {FormGroup} - The created form group.
   */
  private createInboundPatternFormGroup(): FormGroup {
    return this.formBuilder.group({
      pattern: [''],
      constraint: [''],
      automatic: false,
      patternLabel: 'Select a Pattern',
    });
  }


}
