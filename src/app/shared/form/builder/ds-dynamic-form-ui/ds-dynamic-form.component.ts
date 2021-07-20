import {
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input, OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {
  DynamicFormComponent,
  DynamicFormControlContainerComponent,
  DynamicFormControlEvent,
  DynamicFormControlModel,
  DynamicFormLayout,
  DynamicFormComponentService,
  DynamicTemplateDirective,
} from '@ng-dynamic-forms/core';
import {DsDynamicFormControlContainerComponent} from './ds-dynamic-form-control-container.component';
import {getFirstCompletedRemoteData} from "../../../../core/shared/operators";
import {ConfigurationDataService} from "../../../../core/data/configuration-data.service";
import {FormService} from "../../form.service";

@Component({
  selector: 'ds-dynamic-form',
  templateUrl: './ds-dynamic-form.component.html'
})
export class DsDynamicFormComponent extends DynamicFormComponent implements OnInit {

  @Input() formId: string;
  @Input() formGroup: FormGroup;
  @Input() formModel: DynamicFormControlModel[];
  @Input() formLayout: DynamicFormLayout;
  @Input() entityType: String;
  /* tslint:disable:no-output-rename */
  @Output('dfBlur') blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfChange') change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfFocus') focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  /* tslint:enable:no-output-rename */

  @Output() ngbEvent: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @ContentChildren(DynamicTemplateDirective) templates: QueryList<DynamicTemplateDirective>;

  @ViewChildren(DsDynamicFormControlContainerComponent) components: QueryList<DynamicFormControlContainerComponent>;

  constructor(changeDetectorRef: ChangeDetectorRef, componentService: DynamicFormComponentService,
              private configurationDataService: ConfigurationDataService,
              private formService: FormService) {
    super(changeDetectorRef, componentService);
  }

  ngOnInit() {
    // for the metadata security we first check if we have group type to make requests
    if (this.entityType) {
      this.configurationDataService.findByPropertyName("metadatavalue.visibility." + this.entityType + ".settings").pipe(
        getFirstCompletedRemoteData(),
      ).subscribe(res1 => {
        if (res1.state == "Error") {
          //default fallback lookup
          this.configurationDataService.findByPropertyName("metadatavalue.visibility.settings").pipe(
            getFirstCompletedRemoteData(),
          ).subscribe(res => {
            const notifyForEntityAndSecurity ={
              entityType: this.entityType,
              securityConfig: parseInt(res.payload.values[0])
            }
            this.formService.entityTypeAndSecurityfallBack.next(notifyForEntityAndSecurity)
          })
        } else {
          if (res1.state == "Success") {
            const notifyForEntityAndSecurity ={
              entityType: this.entityType,
              securityConfig: parseInt(res1.payload.values[0])
            }
            this.formService.entityTypeAndSecurityfallBack.next(notifyForEntityAndSecurity)
          }
        }
      })
    }
  }

}
