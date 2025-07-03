import {
  CommonModule,
  isPlatformBrowser,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnChanges,
  PLATFORM_ID,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService } from '../core/auth/auth.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { RemoteData } from '../core/data/remote-data';
import { Bitstream } from '../core/shared/bitstream.model';
import { FileService } from '../core/shared/file.service';
import {
  hasNoValue,
  hasValue,
} from '../shared/empty.util';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { SafeUrlPipe } from '../shared/utils/safe-url-pipe';

/**
 * This component renders a given Bitstream as a thumbnail.
 * One input parameter of type Bitstream is expected.
 * If no Bitstream is provided, an HTML placeholder will be rendered instead.
 */
@Component({
  selector: 'ds-base-thumbnail',
  styleUrls: ['./thumbnail.component.scss'],
  templateUrl: './thumbnail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    SafeUrlPipe,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class ThumbnailComponent implements OnChanges {
  /**
   * The thumbnail Bitstream
   */
  @Input() thumbnail: Bitstream | RemoteData<Bitstream>;

  /**
   * The default image, used if the thumbnail isn't set or can't be downloaded.
   * If defaultImage is null, a HTML placeholder is used instead.
   */
  @Input() defaultImage? = null;

  /**
   * The src attribute used in the template to render the image.
   */
  src: WritableSignal<string> = signal(undefined);

  retriedWithToken = false;

  /**
   * i18n key of thumbnail alt text
   */
  @Input() alt? = 'thumbnail.default.alt';

  /**
   * i18n key of HTML placeholder text
   */
  @Input() placeholder? = 'thumbnail.default.placeholder';

  /**
   * Limit thumbnail width to --ds-thumbnail-max-width
   */
  @Input() limitWidth? = true;

  /**
   * Whether the thumbnail is currently loading
   * Start out as true to avoid flashing the alt text while a thumbnail is being loaded.
   */
  isLoading: WritableSignal<boolean> = signal(true);

  constructor(
    @Inject(PLATFORM_ID) private platformID: any,
    protected auth: AuthService,
    protected authorizationService: AuthorizationDataService,
    protected fileService: FileService,
  ) {
  }

  /**
   * Resolve the thumbnail.
   * Use a default image if no actual image is available.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (isPlatformBrowser(this.platformID)) {
      if (hasNoValue(this.thumbnail)) {
        this.setSrc(this.defaultImage);
        return;
      }

      const src = this.contentHref;
      if (hasValue(src)) {
        this.setSrc(src);
      } else {
        this.setSrc(this.defaultImage);
      }
    }
  }

  /**
   * The current thumbnail Bitstream
   * @private
   */
  private get bitstream(): Bitstream {
    if (this.thumbnail instanceof Bitstream) {
      return this.thumbnail as Bitstream;
    } else if (this.thumbnail instanceof RemoteData) {
      return (this.thumbnail as RemoteData<Bitstream>).payload;
    }
  }

  private get contentHref(): string | undefined {
    if (this.thumbnail instanceof Bitstream) {
      return this.thumbnail?._links?.content?.href;
    } else if (this.thumbnail instanceof RemoteData) {
      return this.thumbnail?.payload?._links?.content?.href;
    }
  }

  /**
   * Handle image download errors.
   * If the image can't be loaded, try re-requesting it with an authorization token in case it's a restricted Bitstream
   * Otherwise, fall back to the default image or a HTML placeholder
   */
  errorHandler() {
    const src = this.src();
    const thumbnail = this.bitstream;
    const thumbnailSrc = thumbnail?._links?.content?.href;

    if (!this.retriedWithToken && hasValue(thumbnailSrc) && src === thumbnailSrc) {
      // the thumbnail may have failed to load because it's restricted
      //   → retry with an authorization token
      //     only do this once; fall back to the default if it still fails
      this.retriedWithToken = true;

      this.auth.isAuthenticated().pipe(
        switchMap((isLoggedIn) => {
          if (isLoggedIn) {
            return this.authorizationService.isAuthorized(FeatureID.CanDownload, thumbnail.self);
          } else {
            return of(false);
          }
        }),
        switchMap((isAuthorized) => {
          if (isAuthorized) {
            return this.fileService.retrieveFileDownloadLink(thumbnailSrc);
          } else {
            return of(null);
          }
        }),
      ).subscribe((url: string) => {
        if (hasValue(url)) {
          // If we got a URL, try to load it
          //   (if it still fails this method will be called again, and we'll fall back to the default)
          // Otherwise, fall back to the default image right now
          this.setSrc(url);
        } else {
          this.setSrc(this.defaultImage);
        }
      });
    } else {
      if (src !== this.defaultImage) {
        // we failed to get thumbnail (possibly retried with a token but failed again)
        this.setSrc(this.defaultImage);
      } else {
        // we have failed to retrieve the default image, fall back to the placeholder
        this.setSrc(null);
      }
    }
  }

  /**
   * Set the thumbnail.
   * Stop the loading animation if setting to null.
   * @param src
   */
  setSrc(src: string): void {
    // only update the src if it has changed (the parent component may fire the same one multiple times
    if (this.src() !== src) {
      // every time the src changes we need to start the loading animation again, as it's possible
      // that it is first set to null when the parent component initializes and then set to
      // the actual value
      //
      // isLoading$ will be set to false by the error or success handler afterwards, except in the
      // case where src is null, then we have to set it manually here (because those handlers won't
      // trigger)
      if (src !== null && this.isLoading() === false) {
        this.isLoading.set(true);
      }
      this.src.set(src);
      if (src === null && this.isLoading() === true) {
        this.isLoading.set(false);
      }
    }
  }

  /**
   * Stop the loading animation once the thumbnail is successfully loaded
   */
  successHandler() {
    this.isLoading.set(false);
  }
}
