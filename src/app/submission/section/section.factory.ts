import { ComponentFactoryResolver, Injectable, ReflectiveInjector, Type, ViewContainerRef } from '@angular/core';

import { SectionContainerComponent } from './container/section-container.component';
import { SectionDataModel } from './section.model';
import { SectionDataObject } from './section-data.model';
import { SubmissionSectionModel } from '../../core/shared/config/config-submission-section.model';
import { WorkspaceitemSectionDataType } from '../../core/submission/models/workspaceitem-sections.model';
import { SectionType } from './section-type';

export interface FactoryDataModel {
  component: Type<any>;
  inputs: SectionDataModel;
}

@Injectable()
export class SectionFactoryComponent {
  constructor(private resolver: ComponentFactoryResolver) {
  }

  // component: Class for the component you want to create
  // inputs: An object with key/value pairs mapped to input name/input value
  public get(collectionId: string,
             submissionId: string,
             sectionId: string,
             sectionData: WorkspaceitemSectionDataType,
             factoryData: SubmissionSectionModel,
             sectionsHost: ViewContainerRef) {
    if (!factoryData) {
      return;
    }

    if (!(Object.values(SectionType).includes(factoryData.sectionType))) {
      throw  Error(`Section '${factoryData.sectionType}' is not available. Please checks form configuration file.`);
    }

    const inputs: SectionDataObject = Object.create(null);
    inputs.id = sectionId;
    inputs.data = sectionData;
    inputs.header = factoryData.header;
    inputs.mandatory = factoryData.mandatory;
    inputs.config = factoryData._links.config;

    // Inputs need to be in the following format to be resolved properly
    const inputProviders = [
      {provide: 'collectionId', useValue: collectionId},
      {provide: 'sectionData', useValue: inputs},
      {provide: 'submissionId', useValue: submissionId}
    ];
    const resolvedInputs = ReflectiveInjector.resolve(inputProviders);

    // We create an injector out of the data we want to pass down and this components injector
    const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, sectionsHost.parentInjector);

    // We create a factory out of the component we want to create
    const containerFactory = this.resolver.resolveComponentFactory(SectionContainerComponent);

    // We create the component using the factory and the injector
    const containerRef = containerFactory.create(injector);

    containerRef.instance.collectionId = collectionId;
    containerRef.instance.sectionData = inputs;
    containerRef.instance.sectionComponentType = factoryData.sectionType;
    containerRef.instance.submissionId = submissionId;

    // We insert the component into the dom container
    sectionsHost.insert(containerRef.hostView);

    return containerRef;
  }
}
