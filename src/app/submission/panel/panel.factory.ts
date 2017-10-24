import {
  ComponentFactoryResolver,
  Injectable,
  ReflectiveInjector,
  Type,
  ViewContainerRef
} from '@angular/core';
import { PanelContainerComponent } from './container/panel-container.component';
import { PanelDataModel } from './panel.model';
import { PanelDataObject } from './panel-data.model';
import { PanelObject } from '../definitions/submission-definitions.reducer';
import { PanelService } from './panel.service';
import {Store} from "@ngrx/store";
import {SubmissionState} from "../submission.reducers";

export interface FactoryDataModel {
  component: Type<any>;
  inputs: PanelDataModel;
}

@Injectable()
export class PanelFactoryComponent {
  typeToComponentMapping = [ 'submission-form', 'upload', 'license', 'cclicense' ];
  currentComponent = null;

  constructor(private resolver: ComponentFactoryResolver,  private store: Store<SubmissionState> ) {}
           //   private panelService: PanelService) {}

  // component: Class for the component you want to create
  // inputs: An object with key/value pairs mapped to input name/input value
  public get(submissionId: string, panelId: string, factoryData: PanelObject, panelsHost: ViewContainerRef) {
    if (!factoryData) {
      return;
    }
    if (!this.typeToComponentMapping.includes(factoryData.sectionType)) {
      throw  Error(`Panel '${factoryData.sectionType}' is not available. Please checks form configuration file.`);
    }

    const inputs: PanelDataObject = Object.create(null);
    inputs.panelId = panelId;
    inputs.panelHeader = factoryData.header;
    inputs.mandatory = factoryData.mandatory;
    inputs.submissionId = submissionId;
    inputs.checkable = factoryData.checkable;
    // inputs.config = factoryData.config;
    /*inputs.submissionState = this.submissionState;
    inputs.bitstreamService = this.bitstreamService;
    inputs.submissionService = this.submissionService;*/

    // Inputs need to be in the following format to be resolved properly
    /*const inputProviders = Object.keys(inputs).map((inputName) => {
      return {provide: inputName, useValue: inputs[inputName]};
    });*/
    const inputProviders = [
                            {provide: 'sectionData',  useValue: inputs},
                            {provide: 'store', useValue: this.store }
                           // {provide: 'panelService', useValue: this.panelService}
                           ];

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

    /*for (const inputName of Object.keys(inputs)) {
      (containerRef.instance as PanelDataModel)[inputName] = inputs[inputName];
    }*/
    containerRef.instance.sectionData = inputs;
    containerRef.instance.panelComponentType = factoryData.sectionType;

    containerRef.instance.store = this.store;

    // We insert the component into the dom container
    panelsHost.insert(containerRef.hostView);

    return containerRef;
  }
}
