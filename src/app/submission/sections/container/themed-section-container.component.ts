import {
  Component,
  Input,
} from '@angular/core';

import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { SectionDataObject } from '../models/section-data.model';
import { SubmissionSectionContainerComponent } from './section-container.component';

@Component({
  selector: 'ds-submission-section-container',
  styleUrls: [],
  templateUrl: '../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    SubmissionSectionContainerComponent,
  ],
})
export class ThemedSubmissionSectionContainerComponent extends ThemedComponent<SubmissionSectionContainerComponent> {
  @Input() collectionId: string;
  @Input() sectionData: SectionDataObject;
  @Input() submissionId: string;

  protected inAndOutputNames: (keyof SubmissionSectionContainerComponent & keyof this)[] = ['collectionId', 'sectionData', 'submissionId'];

  protected getComponentName(): string {
    return 'SubmissionSectionContainerComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/submission/sections/container/section-container.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./section-container.component`);
  }
}
