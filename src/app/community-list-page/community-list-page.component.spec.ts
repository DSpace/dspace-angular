import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { CommunityListPageComponent } from './community-list-page.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MockTranslateLoader } from '../shared/mocks/mock-translate-loader';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CommunityListPageComponent', () => {
  let component: CommunityListPageComponent;
  let fixture: ComponentFixture<CommunityListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          },
        }),
      ],
      declarations: [CommunityListPageComponent],
      providers: [
        CommunityListPageComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', inject([CommunityListPageComponent], (comp: CommunityListPageComponent) => {
    expect(comp).toBeTruthy();
  }));

});
