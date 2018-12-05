import { SectionTypeModel } from './section-type.model';
import { SectionType } from '../../initial-menus-state';

export class SearchSectionTypeModel implements SectionTypeModel {
  type = SectionType.SEARCH;
  placeholder: string;
  action: string;
}
