import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  @Output() cancelForm: EventEmitter<any> = new EventEmitter();

  constructor(
    private ldnServicesService: LdnServicesService,
    private ldnDirectoryService: LdnDirectoryService,
    private formBuilder: FormBuilder,
    private router: Router,
    private notificationsService: NotificationsService,
    private translateService: TranslateService
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
    this.ldnDirectoryService.getItemFilters().subscribe((itemFilters) => {
      console.log(itemFilters);
      this.itemFilterList = itemFilters._embedded.itemfilters.map((filter: { id: string; }) => ({
        name: filter.id
      }));
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
                  this.submitForm.emit(values);
              } else {
                  this.notificationsService.error(this.translateService.get('notification.created.failure', ));
                  this.cancelForm.emit();
              }
          });
      });
  }*/

  onSubmit() {
    this.formModel.get('name').markAsTouched();
    this.formModel.get('url').markAsTouched();
    this.formModel.get('ldnUrl').markAsTouched();

    const name = this.formModel.get('name').value;
    const url = this.formModel.get('url').value;
    const ldnUrl = this.formModel.get('ldnUrl').value;

    if (!name || !url || !ldnUrl) {
      return;
    }

    const values = this.formModel.value;

    const ldnServiceData = this.ldnServicesService.create(values);

    ldnServiceData.pipe(
      getFirstCompletedRemoteData()
    ).subscribe((ldnNewService) => {
      console.log(ldnNewService);
    });

    ldnServiceData.pipe(
      getFirstCompletedRemoteData()
    ).subscribe((rd: RemoteData<LdnService>) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get('notification.created.success'));
        this.submitForm.emit();
        this.sendBack();
      } else {
        this.notificationsService.error(this.translateService.get('notification.created.failure'));
        this.cancelForm.emit();
      }
    });

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
