import { NgClass } from '@angular/common';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { MetadataValue } from '../../core/shared/metadata.models';
import { OrcidBadgeAndTooltipComponent } from './orcid-badge-and-tooltip.component';

describe('OrcidBadgeAndTooltipComponent', () => {
  let component: OrcidBadgeAndTooltipComponent;
  let fixture: ComponentFixture<OrcidBadgeAndTooltipComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OrcidBadgeAndTooltipComponent,
        NgbTooltipModule,
        NgClass,
      ],
      providers: [
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrcidBadgeAndTooltipComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);

    component.orcid = { value: '0000-0002-1825-0097' } as MetadataValue;
    component.authenticatedTimestamp = { value: '2023-10-01' } as MetadataValue;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set orcidTooltip when authenticatedTimestamp is provided', () => {
    component.ngOnInit();
    expect(component.orcidTooltip).toBe('person.orcid-tooltip.authenticated');
  });

  it('should set orcidTooltip when authenticatedTimestamp is not provided', () => {
    component.authenticatedTimestamp = null;
    component.ngOnInit();
    expect(component.orcidTooltip).toBe('person.orcid-tooltip.not-authenticated');
  });

  it('should display the ORCID icon', () => {
    const badgeIcon = fixture.debugElement.query(By.css('img[data-test="orcidIcon"]'));
    expect(badgeIcon).toBeTruthy();
  });

  it('should display the ORCID icon in greyscale if there is no authenticated timestamp', () => {
    component.authenticatedTimestamp = null;
    fixture.detectChanges();
    const badgeIcon = fixture.debugElement.query(By.css('img[data-test="orcidIcon"]'));
    expect(badgeIcon.nativeElement.classList).toContain('not-authenticated');
  });

});
