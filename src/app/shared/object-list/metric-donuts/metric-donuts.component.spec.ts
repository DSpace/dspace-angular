import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { LinkService } from '../../../core/cache/builders/link.service';
import { Item } from '../../../core/shared/item.model';
import { MetricLoaderComponent } from '../../metric/metric-loader/metric-loader.component';
import { getMockLinkService } from '../../mocks/link-service.mock';
import { followLink } from '../../utils/follow-link-config.model';
import { MetricDonutsComponent } from './metric-donuts.component';

let comp: MetricDonutsComponent;
let fixture: ComponentFixture<MetricDonutsComponent>;
let linkService: LinkService;
const type = 'authorOfPublication';

const mockItem = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dspace.entity.type': [
      {
        language: 'en_US',
        value: type,
      },
    ],
  },
});

// const mockItemWithoutEntityType = Object.assign(new Item(), {
//   bundles: observableOf({}),
//   metadata: {
//     'dc.title': [
//       {
//         language: 'en_US',
//         value: 'This is just another title'
//       }
//     ]
//   }
// });

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
