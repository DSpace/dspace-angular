import { autoserialize, autoserializeAs } from 'cerialize';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { excludeFromEquals } from '../utilities/equals.decorators';

export class BrowseEntry extends ListableObject {
  @autoserialize
  type: string;

  @autoserialize
  authority: string;

  @autoserialize
  value: string;

  @autoserializeAs('valueLang')
  language: string;

  @excludeFromEquals
  @autoserialize
  count: number;

}
