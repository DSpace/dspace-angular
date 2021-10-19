import {TextRowSection} from '../../../../core/layout/models/section.model';
import {Component, Input} from '@angular/core';
import {Site} from '../../../../core/shared/site.model';
import {MetadataValue} from '../../../../core/shared/metadata.models';
import {environment} from '../../../../../environments/environment';


@Component({
  selector: 'ds-text-section',
  templateUrl: './text-section.component.html',
  styleUrls: ['./text-section.component.scss'],
})
export class TextSectionComponent {

  content: string;
  @Input()
  sectionId: string;

  @Input()
  textRowSection: TextRowSection;

  @Input()
  site: Site;

  ngOnChanges(changes) {
    if (changes.site && this.site) {
      if (this.site.metadata && this.textRowSection.content) {
        const mdv = this.site.metadata[this.textRowSection.content];
        if (mdv && mdv.length > 0) {
          mdv.forEach((el: MetadataValue) => {
            // set the metadata value of the default language of the user
            if (el.language === environment.defaultLanguage) {
              this.content = el.value;
            }
          });
        }
      }
    }
  }
}
