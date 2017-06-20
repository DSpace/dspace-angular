import { Item } from "./item.model";
import { Observable } from "rxjs";
import { RemoteData } from "../data/remote-data";
import { Bitstream } from "./bitstream.model";
import { isEmpty } from "../../shared/empty.util";
import { PageInfo } from "./page-info.model";


describe('Item', () => {


    let item: Item;
    const thumbnailBundleName = "THUMBNAIL";
    const originalBundleName = "ORIGINAL";
    const thumbnailPath = "thumbnail.jpg";
    const bitstream1Path = "document.pdf";
    const bitstream2Path = "otherfile.doc";

    const nonExistingBundleName = "c1e568f7-d14e-496b-bdd7-07026998cc00";
    let bitstreams;
    let remoteDataThumbnail;
    let remoteDataFiles;
    let remoteDataAll;

    beforeEach(() => {
        const thumbnail = {
            retrieve: thumbnailPath
        };

        bitstreams = [{
            retrieve: bitstream1Path
        }, {
            retrieve: bitstream2Path
        }];

        remoteDataThumbnail = createRemoteDataObject(thumbnail);
        remoteDataFiles = createRemoteDataObject(bitstreams);
        remoteDataAll = createRemoteDataObject([...bitstreams, thumbnail]);


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


        item = Object.assign(new Item(), { bitstreams: remoteDataAll});

    });


    it('should return the bitstreams related to this item with the specified bundle name', () => {
        const bitObs: Observable<Bitstream[]> = item.getBitstreamsByBundleName(thumbnailBundleName);
        bitObs.take(1).subscribe(bs =>
          expect(bs.every(b => b.name === thumbnailBundleName)).toBeTruthy());
    });

    it('should return an empty array when no bitstreams with this bundleName exist for this item', () => {
        const bitstreams: Observable<Bitstream[]> = item.getBitstreamsByBundleName(nonExistingBundleName);
        bitstreams.take(1).subscribe(bs => expect(isEmpty(bs)).toBeTruthy());
    });


    describe("get thumbnail", () => {
        beforeEach(() => {
            spyOn(item, 'getBitstreamsByBundleName').and.returnValue(Observable.of([remoteDataThumbnail]));
        });

        it('should return the thumbnail of this item', () => {
            let path: string = thumbnailPath;
            let bitstream: Observable<Bitstream> = item.getThumbnail();
            bitstream.map(b => expect(b.retrieve).toBe(path));
        });
    });


    describe("get files", () => {
        beforeEach(() => {
            spyOn(item, 'getBitstreamsByBundleName').and.returnValue(Observable.of(bitstreams));
        });

        it('should return all bitstreams with "ORIGINAL" as bundleName', () => {
            let paths = [bitstream1Path, bitstream2Path];

            let files: Observable<Bitstream[]> = item.getFiles();
            let index = 0;
            files.map(f => expect(f.length).toBe(2));
            files.subscribe(
                array => array.forEach(
                    file => {
                        expect(file.retrieve).toBe(paths[index]);
                        index++;
                    }
                )
            )
        });

    });


});

function createRemoteDataObject(object: Object) {
  const self = "";
  const requestPending = Observable.of(false);
  const responsePending = Observable.of(false);
  const isSuccessful = Observable.of(true);
  const errorMessage = Observable.of(undefined);
  const statusCode = Observable.of("200");
  const pageInfo = Observable.of(new PageInfo());
  const payload = Observable.of(object);
  return new RemoteData(
      self,
      requestPending,
      responsePending,
      isSuccessful,
      errorMessage,
      statusCode,
      pageInfo,
      payload
    );

}
