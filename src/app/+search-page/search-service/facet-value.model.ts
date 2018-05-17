
import { autoserialize, autoserializeAs } from 'cerialize';

export class FacetValue {
  @autoserializeAs(String, 'label')
  value: string;

  @autoserialize
  count: number;

  @autoserialize
  search: string;
}
