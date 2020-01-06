import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureSearchComponentTestingModule } from './search.component.spec';
import { ConfigurationSearchPageComponent } from './configuration-search-page.component';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';

describe('ConfigurationSearchPageComponent', () => {
  let comp: ConfigurationSearchPageComponent;
  let fixture: ComponentFixture<ConfigurationSearchPageComponent>;
  let searchConfigService: SearchConfigurationService;

  beforeEach(async(() => {
    configureSearchComponentTestingModule(ConfigurationSearchPageComponent);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationSearchPageComponent);
    comp = fixture.componentInstance;
    searchConfigService = (comp as any).searchConfigService;
    fixture.detectChanges();
  });
});
