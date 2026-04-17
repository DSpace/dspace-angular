import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { getMockThemeService } from '../shared/mocks/theme-service.mock';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { ThemeService } from '../shared/theme-support/theme.service';
import { CommunityListPageComponent } from './community-list-page.component';
import { CommunityListService } from './community-list-service';

describe('CommunityListPageComponent', () => {
  let component: CommunityListPageComponent;
  let fixture: ComponentFixture<CommunityListPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        CommunityListPageComponent,
      ],
      providers: [
        CommunityListPageComponent,
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: CommunityListService, useValue: {} },
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
