import {
  ComponentFactoryResolver,
  Injectable,
  ReflectiveInjector,
  Type,
  ViewContainerRef
} from '@angular/core';

import { SectionContainerComponent } from './container/section-container.component';
import { SectionDataModel } from './section.model';
import { SectionDataObject } from './section-data.model';
import { SubmissionSectionModel } from '../../core/shared/config/config-submission-section.model';

export interface FactoryDataModel {
  component: Type<any>;
  inputs: SectionDataModel;
}

@Injectable()
export class SectionFactoryComponent {
  // @TODO retrieve from app configuration
  typeToComponentMapping = [ 'submission-form', 'upload', 'license', 'cclicense' ];

  constructor(private resolver: ComponentFactoryResolver) {}

  // component: Class for the component you want to create
  // inputs: An object with key/value pairs mapped to input name/input value
  public get(collectionId: string, submissionId: string, sectionId: string, factoryData: SubmissionSectionModel, sectionsHost: ViewContainerRef) {
    if (!factoryData) {
      return;
    }
    if (!this.typeToComponentMapping.includes(factoryData.sectionType)) {
      throw  Error(`Section '${factoryData.sectionType}' is not available. Please checks form configuration file.`);
    }

    const inputs: SectionDataObject = Object.create(null);
    inputs.collectionId = collectionId;
    inputs.id = sectionId;
    inputs.header = factoryData.header;
    inputs.mandatory = factoryData.mandatory;
    inputs.submissionId = submissionId;
    inputs.config = factoryData._links.config;

    // Inputs need to be in the following format to be resolved properly
    const inputProviders = [{provide: 'sectionData',  useValue: inputs}];
    const resolvedInputs = ReflectiveInjector.resolve(inputProviders);

    // We create an injector out of the data we want to pass down and this components injector
    const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, sectionsHost.parentInjector);

    // We create a factory out of the component we want to create
    const containerFactory  = this.resolver.resolveComponentFactory(SectionContainerComponent);

    // We create the component using the factory and the injector
    const containerRef = containerFactory.create(injector);

    containerRef.instance.sectionData = inputs;
    containerRef.instance.sectionComponentType = factoryData.sectionType;

    // We insert the component into the dom container
    sectionsHost.insert(containerRef.hostView);

    return containerRef;
  }
}
