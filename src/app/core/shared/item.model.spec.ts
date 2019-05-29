import { Observable, of as observableOf } from 'rxjs';

import { Item } from './item.model';
import { Bitstream } from './bitstream.model';
import { isEmpty } from '../../shared/empty.util';
import { first, map } from 'rxjs/operators';
import { createSuccessfulRemoteDataObject$ } from '../../shared/testing/utils';

describe('Item', () => {

  let item: Item;
  const thumbnailBundleName = 'THUMBNAIL';
  const originalBundleName = 'ORIGINAL';
  const thumbnailPath = 'thumbnail.jpg';
  const bitstream1Path = 'document.pdf';
  const bitstream2Path = 'otherfile.doc';

  const nonExistingBundleName = 'c1e568f7-d14e-496b-bdd7-07026998cc00';
  let bitstreams;
  let remoteDataThumbnail;
  let remoteDataFiles;
  let remoteDataAll;

  beforeEach(() => {
    const thumbnail = {
      content: thumbnailPath
    };

    bitstreams = [{
      content: bitstream1Path
    }, {
      content: bitstream2Path
    }];

    remoteDataThumbnail = createSuccessfulRemoteDataObject$(thumbnail);
    remoteDataFiles = createSuccessfulRemoteDataObject$(bitstreams);
    remoteDataAll = createSuccessfulRemoteDataObject$([...bitstreams, thumbnail]);

    // Create Bundles
    const bundles =
      [
        {
          name: thumbnailBundleName,
          primaryBitstream: remoteDataThumbnail
        },

        {
          name: originalBundleName,
          bitstreams: remoteDataFiles
        }];

    item = Object.assign(new Item(), { bitstreams: remoteDataAll });
  });

  it('should return the bitstreams related to this item with the specified bundle name', () => {
    const bitObs: Observable<Bitstream[]> = item.getBitstreamsByBundleName(thumbnailBundleName);
    bitObs.pipe(first()).subscribe((bs) =>
      expect(bs.every((b) => b.name === thumbnailBundleName)).toBeTruthy());
  });

  it('should return an empty array when no bitstreams with this bundleName exist for this item', () => {
    const bs: Observable<Bitstream[]> = item.getBitstreamsByBundleName(nonExistingBundleName);
    bs.pipe(first()).subscribe((b) => expect(isEmpty(b)).toBeTruthy());
  });

  describe('get thumbnail', () => {
    beforeEach(() => {
      spyOn(item, 'getBitstreamsByBundleName').and.returnValue(observableOf([remoteDataThumbnail]));
    });

    it('should return the thumbnail of this item', () => {
      const path: string = thumbnailPath;
      const bitstream: Observable<Bitstream> = item.getThumbnail();
      bitstream.pipe(map((b) => expect(b.content).toBe(path)));
    });
  });

  describe('get files', () => {
    beforeEach(() => {
      spyOn(item, 'getBitstreamsByBundleName').and.returnValue(observableOf(bitstreams));
    });

    it("should return all bitstreams with 'ORIGINAL' as bundleName", () => {
      const paths = [bitstream1Path, bitstream2Path];

      const files: Observable<Bitstream[]> = item.getFiles();
      let index = 0;
      files.pipe(map((f) => expect(f.length).toBe(2)));
      files.subscribe(
        (array) => array.forEach(
          (file) => {
            expect(file.content).toBe(paths[index]);
            index++;
          }
        )
      )
    });

  });
});
