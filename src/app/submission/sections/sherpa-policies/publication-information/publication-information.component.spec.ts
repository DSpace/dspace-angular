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
import { TranslateLoaderMock } from '../../../../shared/testing/translate-loader.mock';
import { PublicationInformationComponent } from './publication-information.component';

describe('PublicationInformationComponent', () => {
  let component: PublicationInformationComponent;
  let fixture: ComponentFixture<PublicationInformationComponent>;
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
        PublicationInformationComponent,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationInformationComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.journal = SherpaDataResponse.sherpaResponse.journals[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show 6 rows', () => {
    expect(de.queryAll(By.css('.row')).length).toEqual(6);
  });

});
