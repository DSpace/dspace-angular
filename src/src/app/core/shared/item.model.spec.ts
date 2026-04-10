import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { Item } from './item.model';

describe('Item', () => {

  let item: Item;
  const thumbnailBundleName = 'THUMBNAIL';
  const originalBundleName = 'ORIGINAL';
  const thumbnailPath = 'thumbnail.jpg';
  const bitstream1Path = 'document.pdf';
  const bitstream2Path = 'otherfile.doc';

  let bitstreams;
  let remoteDataThumbnail;
  let remoteDataThumbnailList;
  let remoteDataFiles;
  let remoteDataBundles;

  it('should be possible to create an Item without any errors', () => {
    const thumbnail = {
      content: thumbnailPath,
    };

    bitstreams = [{
      content: bitstream1Path,
    }, {
      content: bitstream2Path,
    }];

    remoteDataThumbnail = createSuccessfulRemoteDataObject$(thumbnail);
    remoteDataThumbnailList = createSuccessfulRemoteDataObject$(createPaginatedList([thumbnail]));
    remoteDataFiles = createSuccessfulRemoteDataObject$(createPaginatedList(bitstreams));

    // Create Bundles
    const bundles =
      [
        {
          name: thumbnailBundleName,
          primaryBitstream: remoteDataThumbnail,
          bitstreams: remoteDataThumbnailList,
        },

        {
          name: originalBundleName,
          bitstreams: remoteDataFiles,
        }];

    remoteDataBundles = createSuccessfulRemoteDataObject$(createPaginatedList(bundles));

    item = Object.assign(new Item(), { bundles: remoteDataBundles });
    expect().nothing();
  });
});
