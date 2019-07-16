import { autoserialize, autoserializeAs } from 'cerialize';
import { Equatable } from '../utilities/equatable';
import { hasValue } from '../../shared/empty.util';

export class BrowseEntry implements Equatable<BrowseEntry> {
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

  equals(other: BrowseEntry): boolean {
    if (hasValue(other)) {
      return false;
    }
    return false;
  }

}
