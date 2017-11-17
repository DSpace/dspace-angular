import { EpersonModel } from './eperson.model';
import { autoserialize, inheritSerialization } from 'cerialize';

@inheritSerialization(EpersonModel)
export class GroupsModel extends EpersonModel {

  @autoserialize
  public permanent: boolean;
}
