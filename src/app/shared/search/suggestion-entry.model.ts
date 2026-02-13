import { SafeHtml } from '@angular/platform-browser';
import { typedObject } from '@dspace/core/cache/builders/build-decorators';
import { OtherInformation } from '@dspace/core/shared/form/models/form-field-metadata-value.model';
import { GenericConstructor } from '@dspace/core/shared/generic-constructor';
import { ListableObject } from '@dspace/core/shared/object-collection/listable-object.model';
import { ResourceType } from '@dspace/core/shared/resource-type';
import { excludeFromEquals } from '@dspace/core/utilities/equals.decorators';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import { autoserialize } from 'cerialize';


@typedObject
export class SuggestionEntry extends ListableObject {
  static type = new ResourceType('suggestionEntry');

  /**
   * The display value of this suggestion entry
   */
  @autoserialize
  display: SafeHtml;

  /**
   * The value of this suggestion entry
   */
  @autoserialize
  value: string;

  @excludeFromEquals
  @autoserialize
  otherInformation: OtherInformation;

  /**
   * This method checks if entry has related information object
   *
   * @return boolean
   */
  hasOtherInformation(): boolean {
    return isNotEmpty(this.otherInformation);
  }

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [this.constructor as GenericConstructor<ListableObject>];
  }

  constructor(value: string, display: SafeHtml, weight: string) {
    super();
    this.value = value;
    this.display = display;
    this.otherInformation = { weight };
  }
}
