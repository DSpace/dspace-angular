import { autoserialize, autoserializeAs } from 'cerialize';

export class BrowseEntry {

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
