import { TestBed, async } from '@angular/core/testing';
import { Item } from "./item.model";
import { Bundle } from "./bundle.model";
import { Observable } from "rxjs";
import { RemoteData } from "../data/remote-data";
import { Bitstream } from "./bitstream.model";


describe('Item', () => {


    let item: Item;
    const thumbnailBundleName = "THUMBNAIL";
    const originalBundleName = "ORIGINAL";
    const thumbnailPath = "thumbnail.jpg";
    const bitstream1Path = "document.pdf";
    const bitstream2Path = "otherfile.doc";

    const nonExistingBundleName = "c1e568f7-d14e-496b-bdd7-07026998cc00";
    let remoteBundles;
    let thumbnailBundle;
    let originalBundle;

    beforeEach(() => {
        const thumbnail = {
            retrieve: thumbnailPath
        };

        const bitstreams = [{
            retrieve: bitstream1Path
        }, {
            retrieve: bitstream2Path
        }];

        const remoteDataThumbnail = createRemoteDataObject(thumbnail);
        const remoteDataFiles = createRemoteDataObject(bitstreams);


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

        remoteBundles = createRemoteDataObject(bundles);

        item = Object.assign(new Item(), { bundles: remoteBundles });

    });


    it('should return the bundle with the given name of this item when the bundle exists', () => {
        let name: string = thumbnailBundleName;
        let bundle: Observable<Bundle> = item.getBundle(name);
        bundle.map(b => expect(b.name).toBe(name));
    });

    it('should return null when no bundle with this name exists for this item', () => {
        let name: string = nonExistingBundleName;
        let bundle: Observable<Bundle> = item.getBundle(name);
        bundle.map(b => expect(b).toBeUndefined());
    });


    describe("get thumbnail", () => {
        beforeEach(() => {
            spyOn(item, 'getBundle').and.returnValue(Observable.of(thumbnailBundle));
        });

        it('should return the thumbnail (the primaryBitstream in the bundle "THUMBNAIL") of this item', () => {
            let path: string = thumbnailPath;
            let bitstream: Observable<Bitstream> = item.getThumbnail();
            bitstream.map(b => expect(b.retrieve).toBe(path));
        });
    });


    describe("get files", () => {
        beforeEach(() => {
            spyOn(item, 'getBundle').and.returnValue(Observable.of(originalBundle));
        });

        it('should return all files in the ORIGINAL bundle', () => {
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
    return new RemoteData("", Observable.of(false), Observable.of(false), Observable.of(true), Observable.of(undefined), Observable.of(object));

}