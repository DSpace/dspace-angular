import {
  AsyncPipe,
  NgTemplateOutlet,
} from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { SectionDataService } from '@dspace/core/data/section-data.service';
import { SiteDataService } from '@dspace/core/data/site-data.service';
import { Section } from '@dspace/core/layout/models/section.model';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { Site } from '@dspace/core/shared/site.model';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  let sectionDataService: jasmine.SpyObj<SectionDataService>;
  let siteService: jasmine.SpyObj<SiteDataService>;
  let localeService: jasmine.SpyObj<LocaleService>;

  const site = Object.assign(new Site(), {
    id: 'test-site',
    firstMetadataValue: () => undefined,
  });

  const buildConfig = (enableDynamicLayout: boolean) => ({
    homePage: {
      recentSubmissions: { pageSize: 5 },
      showDiscoverFilters: false,
      enableDynamicLayout,
    },
  });


  const setup = (enableDynamicLayout: boolean, findByIdResult: any) => {
    sectionDataService = jasmine.createSpyObj('SectionDataService', ['findById']);
    sectionDataService.findById.and.returnValue(findByIdResult);

    siteService = jasmine.createSpyObj('SiteDataService', ['find']);
    siteService.find.and.returnValue(of(site));

    localeService = jasmine.createSpyObj('LocaleService', ['getCurrentLanguageCode']);
    localeService.getCurrentLanguageCode.and.returnValue(of('en'));

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HomePageComponent,
      ],
      providers: [
        { provide: APP_CONFIG, useValue: buildConfig(enableDynamicLayout) },
        { provide: SectionDataService, useValue: sectionDataService },
        { provide: SiteDataService, useValue: siteService },
        { provide: LocaleService, useValue: localeService },
        { provide: ActivatedRoute, useValue: { data: of({ site }) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(HomePageComponent, {
        set: {
          imports: [AsyncPipe, NgTemplateOutlet, TranslateModule],
          schemas: [NO_ERRORS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const sectionWith = (componentRows: any[][]): Section =>
    Object.assign(new Section(), { id: 'site', componentRows });

  describe('when dynamic layout is disabled (static mode)', () => {
    beforeEach(() => {
      setup(false, createSuccessfulRemoteDataObject$(sectionWith([[{ componentType: 'top', style: '' }]])));
    });

    it('should render the static home page', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('ds-home-news')).toBeTruthy();
      expect(el.querySelector('#home-header-wrapper')).toBeFalsy();
    });

    it('should not request the section configuration', () => {
      expect(sectionDataService.findById).not.toHaveBeenCalled();
    });
  });

  describe('when dynamic layout is enabled and sections are configured', () => {
    beforeEach(() => {
      setup(true, createSuccessfulRemoteDataObject$(sectionWith([[{ componentType: 'top', style: '' }]])));
    });

    it('should report configured sections', (done) => {
      component.hasConfiguredSections$.subscribe((has) => {
        expect(has).toBeTrue();
        done();
      });
    });

    it('should request the section configuration', () => {
      expect(sectionDataService.findById).toHaveBeenCalledWith('site');
    });

    it('should render the dynamic section layout', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('ds-top-section')).toBeTruthy();
    });
  });

  describe('when dynamic layout is enabled but no sections are configured', () => {
    beforeEach(() => {
      setup(true, createSuccessfulRemoteDataObject$(sectionWith([])));
    });

    it('should report no configured sections', (done) => {
      component.hasConfiguredSections$.subscribe((has) => {
        expect(has).toBeFalse();
        done();
      });
    });

    it('should fall back to the static home page', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('ds-home-news')).toBeTruthy();
      expect(el.querySelector('ds-top-section')).toBeFalsy();
    });
  });

  describe('when dynamic layout is enabled but rows contain only empty columns', () => {
    beforeEach(() => {
      setup(true, createSuccessfulRemoteDataObject$(sectionWith([[]])));
    });

    it('should report no configured sections', (done) => {
      component.hasConfiguredSections$.subscribe((has) => {
        expect(has).toBeFalse();
        done();
      });
    });
  });

  describe('when dynamic layout is enabled but the section config fails to load', () => {
    beforeEach(() => {
      setup(true, createFailedRemoteDataObject$('error', 500));
    });

    it('should report no configured sections and fall back to static', (done) => {
      component.hasConfiguredSections$.subscribe((has) => {
        expect(has).toBeFalse();
        const el: HTMLElement = fixture.nativeElement;
        expect(el.querySelector('ds-home-news')).toBeTruthy();
        done();
      });
    });
  });
});
