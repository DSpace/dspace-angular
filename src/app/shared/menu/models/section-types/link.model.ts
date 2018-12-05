import { SectionTypeModel } from './section-type.model';
import { SectionType } from '../../initial-menus-state';

export class LinkSectionTypeModel implements SectionTypeModel {
  type = SectionType.LINK;
  text: string;
  link: string;
}
