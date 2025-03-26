import { TestBed, waitForAsync } from '@angular/core/testing';
import { InternalLinkService } from './internal-link.service';
import { NativeWindowService } from './window.service';

describe('InternalLinkService', () => {
  let service: InternalLinkService;

  beforeEach(waitForAsync(() => {
    return TestBed.configureTestingModule({
      providers: [
        InternalLinkService,
        { provide: NativeWindowService, useValue: { nativeWindow: { location: { origin: 'https://currentdomain' } } } },
    ],
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.inject(InternalLinkService);
  });

  describe('isLinkInternal', () => {
    it('should return true for internal link starting with "/"', () => {
      const result = service.isLinkInternal('/my-link');
      expect(result).toBe(true);
    });

    it('should return true for internal link starting with currentURL', () => {
      const result = service.isLinkInternal('https://currentdomain/my-link');
      expect(result).toBe(true);
    });

    it('should return true for internal link starting with "currentdomain"', () => {
      const result = service.isLinkInternal('currentdomain/my-link');
      expect(result).toBe(true);
    });

    it('should return false for external link', () => {
      const result = service.isLinkInternal('https://externaldomain/my-link');
      expect(result).toBe(false);
    });

    it('should return true for internal link without leading "/"', () => {
      const result = service.isLinkInternal('my-link');
      expect(result).toBe(true);
    });
  });

  describe('transformInternalLink', () => {
    it('should transform internal link by removing currentURL', () => {
      const result = service.getRelativePath('https://currentdomain/my-link');
      expect(result).toBe('/my-link');
    });

    it('should transform internal link by adding leading "/" if missing', () => {
      const result = service.getRelativePath('currentdomain/my-link');
      expect(result).toBe('/my-link');
    });

    it('should return unchanged link for external link', () => {
      const result = service.getRelativePath('https://externalDomain/my-link');
      expect(result).toBe('/https://externalDomain/my-link');
    });

    it('should return unchanged link for internal link with leading "/"', () => {
      const result = service.getRelativePath('/my-link');
      expect(result).toBe('/my-link');
    });
  });

});
