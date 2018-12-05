import { SectionTypeModel } from './section-type.model';
import { SectionType } from '../../initial-menus-state';

export class TextSectionTypeModel implements SectionTypeModel {
  type = SectionType.TEXT;
  text: string;
}
