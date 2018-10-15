import { autoserialize, autoserializeAs } from 'cerialize';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';

export class BrowseEntry implements ListableObject {

  @autoserialize
  type: string;

  @autoserialize
  authority: string;

  @autoserialize
  value: string;

  @autoserializeAs('valueLang')
  language: string;

  @autoserialize
  count: number;

}
