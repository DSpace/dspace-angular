import { typedObject } from '../../cache/builders/build-decorators';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { HALResource } from '../hal-resource.model';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { autoserialize, autoserializeAs, deserialize } from 'cerialize';
import { ResourceType } from '../resource-type';
import { HALLink } from '../hal-link.model';
import { GenericConstructor } from '../generic-constructor';
import { CLARIN_LICENSE } from './clarin-license.resource-type';
import { ClarinLicenseLabel } from './clarin-license-label.model';
import { ClarinLicenseConfirmationSerializer } from './clarin-license-confirmation-serializer';
import { ClarinLicenseRequiredInfoSerializer } from './clarin-license-required-info-serializer';

/**
 * Class that represents a Clarin License
 */
@typedObject
export class ClarinLicense extends ListableObject implements HALResource {
  /**
   * The `clarinlicense` object type.
   */
  static type = CLARIN_LICENSE;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of this Clarin License
   */
  @autoserialize
  id: number;

  /**
   * The name of this Clarin License object
   */
  @autoserialize
  name: string;

  /**
   * The definition of this Clarin License object
   */
  @autoserialize
  definition: string;

  /**
   * The confirmation of this Clarin License object. Number value is converted to the appropriate message by the
   * `ClarinLicenseConfirmationSerializer`.
   */
  @autoserializeAs(ClarinLicenseConfirmationSerializer)
  confirmation: number;

  /**
   * The requiredInfo of this Clarin License object
   */
  @autoserializeAs(ClarinLicenseRequiredInfoSerializer)
  requiredInfo: any;

  /**
   * The non extended clarinLicenseLabel of this Clarin License object. Clarin License could have only one
   * non extended clarinLicenseLabel.
   */
  @autoserialize
  clarinLicenseLabel: ClarinLicenseLabel;

  /**
   * The extended clarinLicenseLabel of this Clarin License object. Clarin License could have multiple
   * extended clarinLicenseLabel.
   */
  @autoserialize
  extendedClarinLicenseLabels: ClarinLicenseLabel[];

  /**
   * The number value of how many bitstreams are used by this Clarin License.
   */
  @autoserialize
  bitstreams: number;

  /**
   * The {@link HALLink}s for this Clarin License
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
