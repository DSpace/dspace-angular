import { ThemedComponent } from '../../../../theme-support/themed.component';
import { DsDynamicLookupRelationModalComponent } from './dynamic-lookup-relation-modal.component';
import { Component, Output, EventEmitter } from '@angular/core';
import { ListableObject } from '../../../../object-collection/shared/listable-object.model';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';

@Component({
  selector: 'ds-themed-dynamic-lookup-relation-modal',
  templateUrl: '../../../../theme-support/themed.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ],
})
export class ThemedDsDynamicLookupRelationModalComponent extends ThemedComponent<DsDynamicLookupRelationModalComponent> {
  @Output() selectEvent: EventEmitter<ListableObject[]> = new EventEmitter<ListableObject[]>();

  protected inAndOutputNames: (keyof DsDynamicLookupRelationModalComponent & keyof this)[] = [
    'selectEvent',
  ];

  protected getComponentName(): string {
    return 'DsDynamicLookupRelationModalComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../themes/${themeName}/app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/dynamic-lookup-relation-modal.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./dynamic-lookup-relation-modal.component`);
  }
}
