import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LdnServicesService } from '../ldn-services-data/ldn-services-data.service';
import { notifyPatterns } from '../ldn-services-patterns/ldn-service-coar-patterns';
import { LdnDirectoryService } from '../ldn-services-services/ldn-directory.service';
import { LDN_SERVICE } from '../ldn-services-model/ldn-service.resource-type';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { LdnService } from '../ldn-services-model/ldn-services.model';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { Itemfilter } from '../ldn-services-model/ldn-service-itemfilters';
import { Observable } from 'rxjs';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { LdnItemfiltersService } from '../ldn-services-data/ldn-itemfilters-data.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";


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
  private modalRef: any;
  @ViewChild('confirmModal', {static: true}) confirmModal: TemplateRef<any>;
  @ViewChild('resetFormModal', {static: true}) resetFormModal: TemplateRef<any>;


  public inboundPatterns: object[] = notifyPatterns;
  public outboundPatterns: object[] = notifyPatterns;
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
  @Input() public ldnUrl: string;
  @Input() public inboundPattern: string;
  @Input() public outboundPattern: string;
  @Input() public constraint: string;
  @Input() public automatic: boolean;

  @Input() public headerKey: string;
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  @Output() cancelForm: EventEmitter<any> = new EventEmitter();

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
  setItemfilters() {
    this.itemfiltersRD$ =  this.ldnItemfiltersService.findAll().pipe(
        getFirstCompletedRemoteData());
    console.log(this.itemfiltersRD$);
    this.itemfiltersRD$.subscribe((rd: RemoteData<PaginatedList<Itemfilter>>) => {
      if (rd.hasSucceeded) {
        console.log(rd);
      }
    });
  }
  /*createLdnService(values: any) {
      this.formModel.get('name').markAsTouched();
      this.formModel.get('url').markAsTouched();
      this.formModel.get('ldnUrl').markAsTouched();

      const ldnServiceData = this.ldnServicesService.create(this.formModel.value);

      ldnServiceData.subscribe((ldnNewService) => {
          console.log(ldnNewService);
          const name = ldnNewService.payload.name;
          const url = ldnNewService.payload.url;
          const ldnUrl = ldnNewService.payload.ldnUrl;

          if (!name || !url || !ldnUrl) {
              return;
          }

          ldnServiceData.pipe(
              getFirstCompletedRemoteData()
          ).subscribe((rd: RemoteData<LdnService>) => {
              if (rd.hasSucceeded) {
                  this.notificationsService.success(this.translateService.get('notification.created.success'));
                  this.onSubmit.emit(values);
              } else {
                  this.notificationsService.error(this.translateService.get('notification.created.failure', ));
                  this.cancelForm.emit();
              }
          });
      });
  }*/

  onSubmit() {
    this.openConfirmModal(this.confirmModal);
  }

  openConfirmModal(content) {
    this.modalRef = this.modalService.open(content);
  }

  openResetFormModal(content) {
    this.modalRef = this.modalService.open(content);
  }
  createService(){
    this.formModel.get('name').markAsTouched();
    this.formModel.get('url').markAsTouched();
    this.formModel.get('ldnUrl').markAsTouched();

    const name = this.formModel.get('name').value;
    const url = this.formModel.get('url').value;
    const ldnUrl = this.formModel.get('ldnUrl').value;

    if (!name || !url || !ldnUrl) {
      this.closeModal();
      return;
    }

    const values = this.formModel.value;

    const ldnServiceData = this.ldnServicesService.create(values);

    ldnServiceData.pipe(
        getFirstCompletedRemoteData()
    ).subscribe((rd: RemoteData<LdnService>) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get('notification.created.success'));
        this.sendBack();
      } else {
        this.notificationsService.error(this.translateService.get('notification.created.failure'));
      }
    });

  }

  resetFormAndLeave() {
    this.sendBack();
    this.closeModal();
  }

  closeModal() {
    this.modalRef.close();
    this.cdRef.detectChanges();
  }

  addInboundPattern() {
    const notifyServiceInboundPatternsArray = this.formModel.get('notifyServiceInboundPatterns') as FormArray;
    notifyServiceInboundPatternsArray.push(this.createInboundPatternFormGroup());
  }

  removeInboundPattern(index: number) {
    const notifyServiceInboundPatternsArray = this.formModel.get('notifyServiceInboundPatterns') as FormArray;
    notifyServiceInboundPatternsArray.removeAt(index);
  }

  addOutboundPattern() {
    const notifyServiceOutboundPatternsArray = this.formModel.get('notifyServiceOutboundPatterns') as FormArray;
    notifyServiceOutboundPatternsArray.push(this.createOutboundPatternFormGroup());
  }

  removeOutboundPattern(index: number) {
    const notifyServiceOutboundPatternsArray = this.formModel.get('notifyServiceOutboundPatterns') as FormArray;
    notifyServiceOutboundPatternsArray.removeAt(index);
  }

  toggleAutomatic(i: number) {
    const automaticControl = this.formModel.get(`notifyServiceInboundPatterns.${i}.automatic`);
    if (automaticControl) {
      automaticControl.setValue(!automaticControl.value);
    }
  }

  private sendBack() {
    this.router.navigateByUrl('admin/ldn/services');
  }



  private createOutboundPatternFormGroup(): FormGroup {
    return this.formBuilder.group({
      pattern: [''],
      constraint: [''],
    });
  }

  private createInboundPatternFormGroup(): FormGroup {
    return this.formBuilder.group({
      pattern: [''],
      constraint: [''],
      automatic: false
    });
  }


}
