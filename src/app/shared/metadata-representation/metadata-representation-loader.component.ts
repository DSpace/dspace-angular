import {
  Component,
  Inject,
  Input,
} from '@angular/core';

import { Context } from '../../core/shared/context.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import {
  MetadataRepresentation,
  MetadataRepresentationType,
} from '../../core/shared/metadata-representation/metadata-representation.model';
import { AbstractComponentLoaderComponent } from '../abstract-component-loader/abstract-component-loader.component';
import { MetadataRepresentationListElementComponent } from '../object-list/metadata-representation-list-element/metadata-representation-list-element.component';
import { ThemeService } from '../theme-support/theme.service';
import { METADATA_REPRESENTATION_COMPONENT_FACTORY } from './metadata-representation.decorator';

@Component({
  selector: 'ds-metadata-representation-loader',
  templateUrl: '../abstract-component-loader/abstract-component-loader.component.html',
  standalone: true,
})
/**
 * Component for determining what component to use depending on the item's entity type (dspace.entity.type), its metadata representation and, optionally, its context
 */
export class MetadataRepresentationLoaderComponent extends AbstractComponentLoaderComponent<MetadataRepresentationListElementComponent> {

  @Input() context: Context;

  /**
   * The item or metadata to determine the component for
   */
  @Input() mdRepresentation: MetadataRepresentation;

  protected inputNamesDependentForComponent: (keyof this & string)[] = [
    'context',
    'mdRepresentation',
  ];

  protected inputNames: (keyof this & string)[] = [
    'context',
    'mdRepresentation',
  ];

  constructor(
    protected themeService: ThemeService,
    @Inject(METADATA_REPRESENTATION_COMPONENT_FACTORY) private getMetadataRepresentationComponent: (entityType: string, mdRepresentationType: MetadataRepresentationType, context: Context, theme: string) => GenericConstructor<any>,
  ) {
    super(themeService);
  }

  public getComponent(): GenericConstructor<MetadataRepresentationListElementComponent> {
    return this.getMetadataRepresentationComponent(this.mdRepresentation.itemType, this.mdRepresentation.representationType, this.context, this.themeService.getThemeName());
  }

}
