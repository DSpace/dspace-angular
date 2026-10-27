import { SearchInstanceIdService } from './search-instance-id.service';

describe('SearchInstanceIdService', () => {
  let service: SearchInstanceIdService;

  beforeEach(() => {
    service = new SearchInstanceIdService();
  });

  it('should allocate unique ids for active search instances', () => {
    expect(service.acquire('spc')).toBe('spc1');
    expect(service.acquire('spc')).toBe('spc2');
  });

  it('should reuse a released id', () => {
    const firstId = service.acquire('spc');
    service.acquire('spc');

    service.release('spc', firstId);

    expect(service.acquire('spc')).toBe('spc1');
  });

  it('should allocate ids independently for different bases', () => {
    expect(service.acquire('spc')).toBe('spc1');
    expect(service.acquire('related')).toBe('related1');
  });
});
