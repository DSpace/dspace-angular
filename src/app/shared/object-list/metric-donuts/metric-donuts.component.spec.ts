import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { Item } from '@dspace/core/shared/item.model';
import { getMockLinkService } from '@dspace/core/testing/link-service.mock';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MetricLoaderComponent } from '../../metric/metric-loader/metric-loader.component';
import { MetricDonutsComponent } from './metric-donuts.component';

let comp: MetricDonutsComponent;
let fixture: ComponentFixture<MetricDonutsComponent>;
let linkService: LinkService;
const type = 'authorOfPublication';

const mockItem = Object.assign(new Item(), {
  bundles: of({}),
  metadata: {
    'dspace.entity.type': [
      {
        language: 'en_US',
        value: type,
      },
    ],
  },
});

describe('MetricDonutsComponent', () => {

  linkService = getMockLinkService();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MetricDonutsComponent],
      providers: [
        { provide: LinkService, useValue: linkService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(MetricDonutsComponent, { remove: { imports: [MetricLoaderComponent] } }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(MetricDonutsComponent);
    comp = fixture.componentInstance;
    comp.item = mockItem;
  }));

  describe('should create', () => {

    beforeEach(() => {
      (linkService as any).resolveLink.and.returnValue(null);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(linkService.resolveLink).toHaveBeenCalledWith(mockItem, followLink('metrics'));
      expect(comp).toBeTruthy();
    });

  });
});
