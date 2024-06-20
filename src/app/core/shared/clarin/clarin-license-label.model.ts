import { typedObject } from '../../cache/builders/build-decorators';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { HALResource } from '../hal-resource.model';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { autoserialize , autoserializeAs, deserialize} from 'cerialize';
import { ResourceType } from '../resource-type';
import { HALLink } from '../hal-link.model';
import { GenericConstructor } from '../generic-constructor';
import { CLARIN_LICENSE_LABEL } from './clarin-license-label.resource-type';
import { ClarinLicenseLabelExtendedSerializer } from './clarin-license-label-extended-serializer';

/**
 * Class that represents a Clarin License Label
 */
@typedObject
export class ClarinLicenseLabel extends ListableObject implements HALResource {
  /**
   * The `clarinlicenselabel` object type.
   */
  static type = CLARIN_LICENSE_LABEL;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of the Clarin License Label
   */
  @autoserialize
  id: number;

  /**
   * The label of the Clarin License Label. It is a shortcut value, it could be max 5 characters long.
   */
  @autoserialize
  label: string;

  /**
   * The title of the Clarin License Label.
   */
  @autoserialize
  title: string;

  /**
   * The extended value of the Clarin License Label.
   */
  @autoserializeAs(ClarinLicenseLabelExtendedSerializer)
  extended: boolean;

  /**
   * The icon of the Clarin License Label. It is converted to the byte array.
   */
  @autoserialize
  icon: any;

  /**
   * The {@link HALLink}s for this Clarin License Label
   */
  @deserialize
  _links: {
    self: HALLink
  };

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}
