import { deserialize, inheritSerialization } from 'cerialize';
import { typedObject } from "../../../core/cache/builders/build-decorators";
import { ADMIN_NOTIFY_MESSAGE } from "./admin-notify-message.resource-type";
import { excludeFromEquals } from "../../../core/utilities/equals.decorators";
import { DSpaceObject } from "../../../core/shared/dspace-object.model";

/**
 * A message that includes admin notify info
 */
@typedObject
@inheritSerialization(DSpaceObject)
export class AdminNotifyMessage extends DSpaceObject {
  static type = ADMIN_NOTIFY_MESSAGE;

  /**
   * The type of the message
   */
  @excludeFromEquals
  type = ADMIN_NOTIFY_MESSAGE;

  @deserialize
  _links: {
    self: {
      href: string;
    };
  };

  get self(): string {
    return this._links.self.href;
  }
}
