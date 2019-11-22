import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureSearchComponentTestingModule } from './search-page.component.spec';
import { SearchConfigurationService } from './search-service/search-configuration.service';
import { ConfigurationSearchPageComponent } from './configuration-search-page.component';

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
