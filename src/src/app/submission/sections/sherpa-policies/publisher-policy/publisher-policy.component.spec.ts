import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { SherpaDataResponse } from '../../../../shared/mocks/section-sherpa-policies.service.mock';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { ContentAccordionComponent } from '../content-accordion/content-accordion.component';
import { PublisherPolicyComponent } from './publisher-policy.component';

describe('PublisherPolicyComponent', () => {
  let component: PublisherPolicyComponent;
  let fixture: ComponentFixture<PublisherPolicyComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        PublisherPolicyComponent,
      ],
    })
      .overrideComponent(PublisherPolicyComponent, {
        remove: {
          imports: [ContentAccordionComponent],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisherPolicyComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.policy = SherpaDataResponse.sherpaResponse.journals[0].policies[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show content accordion', () => {
    expect(de.query(By.css('ds-content-accordion'))).toBeTruthy();
  });

  it('should show 1 row', () => {
    expect(de.queryAll(By.css('.row')).length).toEqual(1);
  });
});
