import { Angulartics2 } from 'angulartics2';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';

import { StatisticsService } from '../statistics.service';
import { Angulartics2DSpace } from './dspace-provider';

describe('Angulartics2DSpace', () => {
  let provider: Angulartics2DSpace;
  let angulartics2: Angulartics2;
  let statisticsService: jasmine.SpyObj<StatisticsService>;

  beforeEach(() => {
    angulartics2 = {
      eventTrack: of({ action: 'page_view', properties: {
        object: 'mock-object',
        referrer: 'https://www.referrer.com',
      } }),
      filterDeveloperMode: () => filter(() => true),
    } as any;
    statisticsService = jasmine.createSpyObj('statisticsService', { trackViewEvent: null });
    provider = new Angulartics2DSpace(angulartics2, statisticsService);
  });

  it('should use the statisticsService', () => {
    provider.startTracking();
    expect(statisticsService.trackViewEvent).toHaveBeenCalledWith('mock-object' as any, 'https://www.referrer.com');
  });

});
