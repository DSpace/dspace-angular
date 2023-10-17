import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LDN_SERVICE } from '../ldn-services-model/ldn-service.resource-type';
import { ActivatedRoute, Router } from '@angular/router';
import { LdnDirectoryService } from '../ldn-services-services/ldn-directory.service';
import { LdnServicesService } from '../ldn-services-data/ldn-services-data.service';
import { notifyPatterns } from '../ldn-services-patterns/ldn-service-coar-patterns';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { LdnService } from '../ldn-services-model/ldn-services.model';
import { RemoteData } from 'src/app/core/data/remote-data';
import { Operation } from 'fast-json-patch';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';

@Component({
  selector: 'ds-ldn-service-form-edit',
  templateUrl: './ldn-service-form-edit.component.html',
  styleUrls: ['./ldn-service-form-edit.component.scss'],
  animations: [
    trigger('toggleAnimation', [
      state('true', style({})),
      state('false', style({})),
      transition('true <=> false', animate('300ms ease-in')),
    ]),
  ],
})
export class LdnServiceFormEditComponent implements OnInit {
  formModel: FormGroup;
  @ViewChild('confirmModal', {static: true}) confirmModal: TemplateRef<any>;
  @ViewChild('resetFormModal', {static: true}) resetFormModal: TemplateRef<any>;

  public inboundPatterns: object[] = notifyPatterns;
  public outboundPatterns: object[] = notifyPatterns;
  public itemFilterList: any[];
  @Input() public name: string;
  @Input() public description: string;
  @Input() public url: string;
  @Input() public ldnUrl: string;
  @Input() public inboundPattern: string;
  @Input() public outboundPattern: string;
  @Input() public constraint: string;
  @Input() public automatic: boolean;
  @Input() public headerKey: string;
  private originalInboundPatterns: any[] = [];
  private originalOutboundPatterns: any[] = [];
  private modalRef: any;
  private service: LdnService;
  protected serviceId: string;

  constructor(
    protected ldnServicesService: LdnServicesService,
    private ldnDirectoryService: LdnDirectoryService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    protected modalService: NgbModal,
    private notificationService: NotificationsService,
    private translateService: TranslateService,
  ) {

    this.formModel = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      url: ['', Validators.required],
      ldnUrl: ['', Validators.required],
      inboundPattern: [''],
      outboundPattern: [''],
      constraintPattern: [''],
      enabled: [''],
      notifyServiceInboundPatterns: this.formBuilder.array([this.createInboundPatternFormGroup()]),
      notifyServiceOutboundPatterns: this.formBuilder.array([this.createOutboundPatternFormGroup()]),
      type: LDN_SERVICE.value,
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.serviceId = params.serviceId;
      if (this.serviceId) {
        this.fetchServiceData(this.serviceId);
      }
    });
    this.ldnDirectoryService.getItemFilters().subscribe((itemFilters) => {
      this.itemFilterList = itemFilters._embedded.itemfilters.map((filter: { id: string; }) => ({
        name: filter.id
      }));
      this.cdRef.detectChanges();
    });
  }

  fetchServiceData(serviceId: string): void {
    this.ldnServicesService.findById(serviceId).pipe(
        getFirstCompletedRemoteData()
    ).subscribe(
      (data: RemoteData<LdnService>) => {
        if (data.hasSucceeded) {
          this.service = data.payload;

          console.log(this.service);

          this.formModel.patchValue({
            id: this.service.id,
            name: this.service.name,
            description: this.service.description,
            url: this.service.url,
            ldnUrl: this.service.ldnUrl,
            type: this.service.type,
            enabled: this.service.enabled
          });

          const inboundPatternsArray = this.formModel.get('notifyServiceInboundPatterns') as FormArray;
          inboundPatternsArray.clear();

          this.service.notifyServiceInboundPatterns.forEach((pattern: any) => {
            const patternFormGroup = this.initializeInboundPatternFormGroup();
            patternFormGroup.patchValue(pattern);
            inboundPatternsArray.push(patternFormGroup);
            this.cdRef.detectChanges();
          });

          const outboundPatternsArray = this.formModel.get('notifyServiceOutboundPatterns') as FormArray;
          outboundPatternsArray.clear();

          this.service.notifyServiceOutboundPatterns.forEach((pattern: any) => {
            const patternFormGroup = this.initializeOutboundPatternFormGroup();
            patternFormGroup.patchValue(pattern);
            outboundPatternsArray.push(patternFormGroup);

            this.cdRef.detectChanges();
          });
          this.originalInboundPatterns = [...this.service.notifyServiceInboundPatterns];
          this.originalOutboundPatterns = [...this.service.notifyServiceOutboundPatterns];
        } else {
          console.error('Error fetching service data:', data.errorMessage);
        }
      },
      (error) => {
        console.error('Error fetching service data:', error);
      }
    );
  }

  generatePatchOperations(): any[] {
    const patchOperations: any[] = [];

    this.createReplaceOperation(patchOperations, 'name', '/name');
    this.createReplaceOperation(patchOperations, 'description', '/description');
    this.createReplaceOperation(patchOperations, 'ldnUrl', '/ldnurl');
    this.createReplaceOperation(patchOperations, 'url', '/url');

    this.handlePatterns(patchOperations, 'notifyServiceInboundPatterns');

    this.handlePatterns(patchOperations, 'notifyServiceOutboundPatterns');

    return patchOperations;
  }

  submitForm() {
    this.openConfirmModal(this.confirmModal);
  }

  addInboundPattern() {
    const notifyServiceInboundPatternsArray = this.formModel.get('notifyServiceInboundPatterns') as FormArray;
    notifyServiceInboundPatternsArray.push(this.createInboundPatternFormGroup());
  }

  removeInboundPattern(index: number): void {
    const patternsArray = this.formModel.get('notifyServiceInboundPatterns') as FormArray;
    const patternGroup = patternsArray.at(index) as FormGroup;
    const patternValue = patternGroup.value;

    if (index < 0 || index >= patternsArray.length || patternValue.isNew) {
      patternsArray.removeAt(index);
      return;
    }

    const patchOperation: Operation = {
      op: 'remove',
      path: `notifyServiceInboundPatterns[${index}]`
    };

    this.ldnServicesService.patch(this.service, [patchOperation]).pipe(
        getFirstCompletedRemoteData()
    ).subscribe(
        (data: RemoteData<LdnService>) => {
          if (data.hasSucceeded) {
            this.notificationService.success(this.translateService.get('ldn-service.notification.remove-inbound-pattern.success.title'),
                this.translateService.get('ldn-service.notification.remove-inbound-pattern.success.content'));
          } else {
            this.notificationService.error(this.translateService.get('ldn-service.notification.remove-inbound-pattern.error.title'),
                this.translateService.get('ldn-service.notification.remove-inbound-pattern.error.content'));
          }
          patternsArray.removeAt(index);
          this.cdRef.detectChanges();
        },
        (error) => {
          console.error('Error removing pattern:', error);
        }
    );
  }



  addOutboundPattern() {
    const notifyServiceOutboundPatternsArray = this.formModel.get('notifyServiceOutboundPatterns') as FormArray;
    notifyServiceOutboundPatternsArray.push(this.createOutboundPatternFormGroup());
  }

  removeOutboundPattern(index: number): void {
    const patternsArray = this.formModel.get('notifyServiceOutboundPatterns') as FormArray;
    const patternGroup = patternsArray.at(index) as FormGroup;
    const patternValue = patternGroup.value;

    if (index < 0 || index >= patternsArray.length || patternValue.isNew) {
      patternsArray.removeAt(index);
      return;
    }

    const patchOperation: Operation = {
      op: 'remove',
      path: `notifyServiceOutboundPatterns[${index}]`
    };

    this.ldnServicesService.patch(this.service, [patchOperation]).pipe(
        getFirstCompletedRemoteData()
    ).subscribe(
        (data: RemoteData<LdnService>) => {
          if (data.hasSucceeded) {
            this.notificationService.success(this.translateService.get('ldn-service.notification.remove-outbound-pattern.success.title'),
                this.translateService.get('ldn-service.notification.remove-outbound-pattern.success.content'));
          } else {
            this.notificationService.error(this.translateService.get('ldn-service.notification.remove-outbound-pattern.error.title'),
                this.translateService.get('ldn-service.notification.remove-outbound-pattern.error.content'));
          }
          patternsArray.removeAt(index);
          this.cdRef.detectChanges();
        },
        (error) => {
          console.error('Error removing pattern:', error);
        }
    );
  }


  toggleAutomatic(i: number) {
    const automaticControl = this.formModel.get(`notifyServiceInboundPatterns.${i}.automatic`);
    if (automaticControl) {
      automaticControl.setValue(!automaticControl.value);
    }
  }

  toggleEnabled() {
    const newStatus = !this.formModel.get('enabled').value;
    const serviceId = this.formModel.get('id').value;

    const patchOperation: Operation = {
      op: 'replace',
      path: '/enabled',
      value: newStatus,
    };

    this.ldnServicesService.patch(this.service, [patchOperation]).pipe(
        getFirstCompletedRemoteData()
    ).subscribe(
        () => {
          console.log('Status updated successfully.');
          this.formModel.get('enabled').setValue(newStatus);
          this.cdRef.detectChanges();
        },
        (error) => {
          console.error('Error updating status:', error);
        }
    );
  }


  closeModal() {
    this.modalRef.close();
    this.cdRef.detectChanges();
  }

  openConfirmModal(content) {
    this.modalRef = this.modalService.open(content);
  }

  openResetFormModal(content) {
    this.modalRef = this.modalService.open(content);
  }

  patchService() {
    const patchOperations = this.generatePatchOperations();

    this.ldnServicesService.patch(this.service, patchOperations).subscribe(
        (response) => {
          console.log('Service updated successfully:', response);
          this.closeModal();
          this.sendBack();
          this.notificationService.success(this.translateService.get('admin.registries.services-formats.modify.success.head'),
              this.translateService.get('admin.registries.services-formats.modify.success.content'));
        },
        (error) => {
          this.notificationService.error(this.translateService.get('admin.registries.services-formats.modify.failure.head'),
              this.translateService.get('admin.registries.services-formats.modify.failure.content'));
          console.error('Error updating service:', error);
        }
    );
  }

  private createReplaceOperation(patchOperations: any[], formControlName: string, path: string): void {
    if (this.formModel.get(formControlName).dirty) {
      patchOperations.push({
        op: 'replace',
        path,
        value: this.formModel.get(formControlName).value,
      });
    }
  }

  private handlePatterns(patchOperations: any[], formArrayName: string): void {
    const patternsArray = this.formModel.get(formArrayName) as FormArray;

    for (let i = 0; i < patternsArray.length; i++) {
      const patternGroup = patternsArray.at(i) as FormGroup;
      const patternValue = patternGroup.value;

      if (patternGroup.dirty) {
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

  private sendBack() {
    this.router.navigateByUrl('admin/ldn/services');
  }

  resetFormAndLeave() {
    this.sendBack();
    this.closeModal();
  }

  private createOutboundPatternFormGroup(): FormGroup {
    return this.formBuilder.group({
      pattern: '',
      constraint: '',
      isNew: true,
    });
  }

  private createInboundPatternFormGroup(): FormGroup {
    return this.formBuilder.group({
      pattern: '',
      constraint: '',
      automatic: false,
      isNew: true
    });
  }

  private initializeOutboundPatternFormGroup(): FormGroup {
    return this.formBuilder.group({
      pattern: '',
      constraint: '',
    });
  }

  private initializeInboundPatternFormGroup(): FormGroup {
    return this.formBuilder.group({
      pattern: '',
      constraint: '',
      automatic: '',
    });
  }
}
