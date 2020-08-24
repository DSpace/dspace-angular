import { Component, OnInit, Input } from '@angular/core';
import { MetadataBoxFieldRendering, FieldRendetingType } from '../metadata-box.decorator';
import { RenderingTypeModel } from '../rendering-type.model';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { hasValue } from 'src/app/shared/empty.util';
import { Box } from 'src/app/core/layout/models/box.model';
import { mergeMap } from 'rxjs/operators';

/**
 * This component renders the links.i18n metadata fields.
 * Its uses the metadata value for the link href and a
 * i18n key for the showed text
 */
@Component({
  selector: 'ds-link-i18n',
  templateUrl: './link-i18n.component.html',
  styleUrls: ['./link-i18n.component.scss']
})
@MetadataBoxFieldRendering(FieldRendetingType.LINK_I18N)
export class LinkI18nComponent extends RenderingTypeModel implements OnInit {

  /**
   * Default key for anchor text
   */
  private baseI18nKey = 'layout.i18n.link.';
  private i18nDefaultKey = 'default';

  /**
   * Current box
   */
  @Input() box: Box;

  /**
   * Text to show in the anchor
   */
  textToShow: Observable<string>;

  constructor(private translateService: TranslateService) {
    super();
  }

  ngOnInit(): void {
    // Compose key for retrieve default i18n label (link)
    // default key in the language file is layout.i18n.link.default
    const defaultValue = this.baseI18nKey + this.i18nDefaultKey;
    // Get the entity type of current item for check if exists
    // specialization of label to show
    const entityType = this.item.firstMetadataValue('relationship.type');
    if ( hasValue(entityType) ) {
      // Compose key to try to retrieve the specialization for entity type
      // of the label to show.
      // The key of label for entity type specialization has this shape:
      // layout.i18n.link.METADATA.ENTITY_TYPE
      // where:
      // METADATA is the key of the current metadata, e.g. dc.title
      // ENTITY_TYPE id the entity type of the current Item, e.g. Person
      const customType =
        this.baseI18nKey +
        this.field.metadata + '.' +
        entityType;
      // Compose key to try to retrieve the specialization for entity
      // type and box of the label to show.
      // The key of label for entity type and box specialization has this shape:
      // layout.i18n.link.METADATA.ENTITY_TYPE.BOX_SHORTNAME
      // where:
      // METADATA is the key of the current metadata, e.g. dc.title
      // ENTITY_TYPE is the entity type of the current Item, e.g. Person
      // BOX_SHORTNAME is the shortname of the current Box, e.g primary
      const customBoxAndType =
        customType + '.' +
        this.box.shortname;
      // Create the observable to get the correct label
      this.textToShow = this.translateService.get(
          customBoxAndType
        ).pipe(
          mergeMap( (boxText) => {
            // If exists a specialization for entity type and box return it,
            // check for entity type otherwise
            if (boxText !== customBoxAndType) {
              return of(boxText)
            } else {
              return this.translateService.get(customType);
            }
          }),
          mergeMap( (entityText) => {
            // If exists a specialization for entity type return it,
            // returns the default label otherwise
            if (entityText !== customType) {
              return of(entityText)
            } else {
              return this.translateService.get(defaultValue)
            }
          })
        );
      } else {
        // If the Item hasn't type relation return the default label
        this.textToShow = this.translateService.get(defaultValue)
      }
  }

}
