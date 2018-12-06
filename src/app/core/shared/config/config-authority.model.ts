import { autoserialize, inheritSerialization } from 'cerialize';

import { ConfigObject } from './config.model';

@inheritSerialization(ConfigObject)
export class ConfigAuthorityModel extends ConfigObject {

  @autoserialize
  id: string;

  @autoserialize
  display: string;

  @autoserialize
  value: string;

  @autoserialize
  otherInformation: any;

  @autoserialize
  language: string;

}
