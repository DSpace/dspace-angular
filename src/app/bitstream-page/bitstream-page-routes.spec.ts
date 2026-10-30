import { BitstreamDownloadPageComponent } from './bitstream-download-page/bitstream-download-page.component';
import { bitstreamPageResolver } from './bitstream-page.resolver';
import { ROUTES } from './bitstream-page-routes';
import { legacyBitstreamURLRedirectGuard } from './legacy-bitstream-url-redirect.guard';

describe('bitstream page routes', () => {
  it('should activate the Angular bitstream download page before redirecting to content', () => {
    const downloadRoute = ROUTES.find((route) => route.path === ':id/download')!;

    expect(downloadRoute).toBeDefined();
    expect(downloadRoute.component).toBe(BitstreamDownloadPageComponent);
    expect(downloadRoute.resolve?.bitstream).toBe(bitstreamPageResolver);
    expect(downloadRoute.canActivate).toBeUndefined();
  });

  it('should keep redirect guards on legacy bitstream URL routes', () => {
    const legacyRoutes = ROUTES.filter((route) => route.path !== ':id/download' && route.component === BitstreamDownloadPageComponent);

    expect(legacyRoutes.length).toBe(2);
    legacyRoutes.forEach((route) => {
      expect(route.canActivate).toContain(legacyBitstreamURLRedirectGuard);
    });
  });
});
