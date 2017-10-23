import {
  ComponentFactoryResolver,
  Injectable,
  ReflectiveInjector,
  Type,
  ViewContainerRef
} from '@angular/core';
import { PanelContainerComponent } from './container/panel-container.component';
import { PanelDataModel } from './panel.model';
import { PanelObject } from '../definitions/submission-definitions.reducer';
import { FormPanelComponent } from './form/panel-form.component';
import { FilesPanelComponent } from './files/panel-files.component';
import { DefaultPanelComponent } from './default/panel-default.component';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../submission.reducers';
import { BitstreamService } from './bitstream/bitstream.service';
import { SubmissionService } from '../submission.service';

export interface FactoryDataModel {
  component: Type<any>;
  inputs: PanelDataModel;
}

@Injectable()
export class PanelFactoryComponent {
  typeToComponentMapping = new Map([
    ['submission-form', {component: FormPanelComponent}],
    ['upload', {component: FilesPanelComponent}],
    ['license', {component: DefaultPanelComponent}],
    ['cclicense', {component: DefaultPanelComponent}]
  ]);
  currentComponent = null;

  constructor(private resolver: ComponentFactoryResolver,
              private submissionState: Store<SubmissionState>,
              private bitstreamService: BitstreamService,
              private submissionService: SubmissionService) {}

  // component: Class for the component you want to create
  // inputs: An object with key/value pairs mapped to input name/input value
  public get(submissionId: string, panelId: string, factoryData: PanelObject, panelsHost: ViewContainerRef) {
    if (!factoryData) {
      return;
    }
    if (!this.typeToComponentMapping.has(factoryData.type)) {
      throw  Error(`Panel '${factoryData.type}' is not available. Please checks form configuration file.`);
    }

    const inputs: PanelDataModel = Object.create(null);
    inputs.panelId = panelId;
    inputs.panelHeader = factoryData.header;
    inputs.mandatory = factoryData.mandatory;
    inputs.submissionId = submissionId;
    inputs.submissionState = this.submissionState;
    inputs.bitstreamService = this.bitstreamService;
    inputs.submissionService = this.submissionService;

    // Inputs need to be in the following format to be resolved properly
    const inputProviders = Object.keys(inputs).map((inputName) => {
      return {provide: inputName, useValue: inputs[inputName]};
    });
    // const inputProviders = {provide: 'store', useClass: Store<SubmissionState>};
    // inputProviders.push({provide: 'store', useFactory: Store<SubmissionState>})

    // const inputProviders = {provide: 'inputs', useExisting: inputs};
    const resolvedInputs = ReflectiveInjector.resolve(inputProviders);
    // const resolvedInputs = ReflectiveInjector.resolveAndCreate(inputProviders);

    // We create an injector out of the data we want to pass down and this components injector
    const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, panelsHost.parentInjector);

    // We create a factory out of the component we want to create
    const containerFactory  = this.resolver.resolveComponentFactory(PanelContainerComponent);

    // We create the component using the factory and the injector
    const containerRef = containerFactory.create(injector);

    for (const inputName of Object.keys(inputs)) {
      (containerRef.instance as PanelDataModel)[inputName] = inputs[inputName];
    }
    containerRef.instance.panelComponentType = factoryData.type;

    // We insert the component into the dom container
    panelsHost.insert(containerRef.hostView);

    return containerRef;
  }
}
