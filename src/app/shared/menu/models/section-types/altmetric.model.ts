import { SectionType } from '../../initial-menus-state';
import { SectionTypeModel } from './section-type.model';

export class AltmetricSectionTypeModel implements SectionTypeModel {
  type = SectionType.ALTMETRIC;
  url: string;
}
