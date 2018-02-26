import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { ConfigObject } from './config.model';
import { SectionType } from '../../../submission/section/section-type';

@inheritSerialization(ConfigObject)
export class SubmissionSectionModel extends ConfigObject {

  @autoserialize
  header: string;

  @autoserialize
  mandatory: boolean;

  @autoserialize
  sectionType: SectionType;

  @autoserialize
  visibility: {
    main: any,
    other: any
  }

}
