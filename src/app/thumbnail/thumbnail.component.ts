import { Component, Input, OnChanges } from '@angular/core';
import { Bitstream } from '../core/shared/bitstream.model';
import { hasNoValue, hasValue } from '../shared/empty.util';
import { RemoteData } from '../core/data/remote-data';
import { BehaviorSubject, of as observableOf } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { AuthService } from '../core/auth/auth.service';
import { FileService } from '../core/shared/file.service';

/**
 * This component renders a given Bitstream as a thumbnail.
 * One input parameter of type Bitstream is expected.
 * If no Bitstream is provided, a HTML placeholder will be rendered instead.
 */
@Component({
  selector: 'ds-thumbnail',
  styleUrls: ['./thumbnail.component.scss'],
  templateUrl: './thumbnail.component.html',
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
  src$ = new BehaviorSubject<string>(undefined);

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
  isLoading$ = new BehaviorSubject(true);

  constructor(
    protected auth: AuthService,
    protected authorizationService: AuthorizationDataService,
    protected fileService: FileService,
  ) {
  }

  /**
   * Resolve the thumbnail.
   * Use a default image if no actual image is available.
   */
  ngOnChanges(): void {
    if (hasNoValue(this.thumbnail)) {
      return;
    }

    const thumbnail = this.bitstream;
    if (hasValue(thumbnail?._links?.content?.href)) {
      this.setSrc(thumbnail?._links?.content?.href);
    } else {
      this.showFallback();
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

  /**
   * Handle image download errors.
   * If the image can't be loaded, try re-requesting it with an authorization token in case it's a restricted Bitstream
   * Otherwise, fall back to the default image or a HTML placeholder
   */
  errorHandler() {
    if (!this.retriedWithToken && hasValue(this.thumbnail)) {
      // the thumbnail may have failed to load because it's restricted
      //   → retry with an authorization token
      //     only do this once; fall back to the default if it still fails
      this.retriedWithToken = true;

      const thumbnail = this.bitstream;
      this.auth.isAuthenticated().pipe(
        switchMap((isLoggedIn) => {
          if (isLoggedIn && hasValue(thumbnail)) {
            return this.authorizationService.isAuthorized(FeatureID.CanDownload, thumbnail.self);
          } else {
            return observableOf(false);
          }
        }),
        switchMap((isAuthorized) => {
          if (isAuthorized) {
            return this.fileService.retrieveFileDownloadLink(thumbnail._links.content.href);
          } else {
            return observableOf(null);
          }
        })
      ).subscribe((url: string) => {
        if (hasValue(url)) {
          // If we got a URL, try to load it
          //   (if it still fails this method will be called again, and we'll fall back to the default)
          // Otherwise, fall back to the default image right now
          this.setSrc(url);
        } else {
          this.showFallback();
        }
      });
    } else {
      this.showFallback();
    }
  }

  /**
   * To be called when the requested thumbnail could not be found
   * - If the current src is not the default image, try that first
   * - If this was already the case and the default image could not be found either,
   *   show an HTML placecholder by setting src to null
   *
   * Also stops the loading animation.
   */
  showFallback() {
    if (this.src$.getValue() !== this.defaultImage) {
      this.setSrc(this.defaultImage);
    } else {
      this.setSrc(null);
    }
  }

  /**
   * Set the thumbnail.
   * Stop the loading animation if setting to null.
   * @param src
   */
  setSrc(src: string): void {
    this.src$.next(src);
    if (src === null) {
      this.isLoading$.next(false);
    }
  }

  /**
   * Stop the loading animation once the thumbnail is successfully loaded
   */
  successHandler() {
    this.isLoading$.next(false);
  }
}
