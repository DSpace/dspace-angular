import { autoserialize, inheritSerialization } from 'cerialize';
import { ConfigObject } from './config.model';
import { SectionsType } from '../../../submission/sections/sections-type';

@inheritSerialization(ConfigObject)
export class SubmissionSectionModel extends ConfigObject {

  @autoserialize
  header: string;

  @autoserialize
  mandatory: boolean;

  @autoserialize
  sectionType: SectionsType;

  @autoserialize
  visibility: {
    main: any,
    other: any
  }

}
