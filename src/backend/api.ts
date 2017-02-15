const util = require('util');
const { Router } = require('express');

// Our API for demos only
import { fakeDataBase } from './db';
import { fakeDemoRedisCache } from './cache';
import { COLLECTIONS } from "./collections";
import { ITEMS } from "./items";
import { BUNDLES } from "./bundles";
import { BITSTREAMS } from "./bitstreams";
import { METADATA } from "./metadata";

// you would use cookies/token etc
const USER_ID = 'f9d98cf1-1b96-464e-8755-bcc2a5c09077'; // hardcoded as an example

// Our API for demos only
export function serverApi(req, res) {
  let key = USER_ID + '/data.json';
  let cache = fakeDemoRedisCache.get(key);
  if (cache !== undefined) {
    console.log('/data.json Cache Hit');
    return res.json(cache);
  }
  console.log('/data.json Cache Miss');

  fakeDataBase.get()
    .then(data => {
      fakeDemoRedisCache.set(key, data);
      return data;
    })
    .then(data => res.json(data));
}


function toHALResponse(req, data, included?) {
  let result = {
    "_embedded": data,
    "_links": {
      "self": req.protocol + '://' + req.get('host') + req.originalUrl
    }
  };
  if (included && Array.isArray(included) && included.length > 0) {
    Object.assign(result, {
      "included": included
    });
  }
  return result;
}

export function createMockApi() {

  let router = Router();

  router.route('/collections')
    .get(function(req, res) {
      console.log('GET');
      // 70ms latency
      setTimeout(function() {
        res.json(toHALResponse(req, COLLECTIONS));
      }, 0);

    // })
    // .post(function(req, res) {
    //   console.log('POST', util.inspect(req.body, { colors: true }));
    //   let collection = req.body;
    //   if (collection) {
    //     COLLECTIONS.push({
    //       value: collection.value,
    //       created_at: new Date(),
    //       completed: collection.completed,
    //       id: COLLECTION_COUNT++
    //     });
    //     return res.json(collection);
    //   }
    //
    //   return res.end();
    });

  router.param('collection_id', function(req, res, next, collection_id) {
    // ensure correct prop type
    let id = req.params.collection_id;
    try {
      req.collection_id = id;
      req.collection = COLLECTIONS.find((collection) => {
        return collection.id === id;
      });
      next();
    } catch (e) {
      next(new Error('failed to load collection'));
    }
  });

  router.route('/collections/:collection_id')
    .get(function(req, res) {
      console.log('GET', util.inspect(req.collection.id, { colors: true }));
      res.json(toHALResponse(req, req.collection));
    // })
    // .put(function(req, res) {
    //   console.log('PUT', util.inspect(req.body, { colors: true }));
    //
    //   let index = COLLECTIONS.indexOf(req.collection);
    //   let collection = COLLECTIONS[index] = req.body;
    //
    //   res.json(collection);
    // })
    // .delete(function(req, res) {
    //   console.log('DELETE', req.collection_id);
    //
    //   let index = COLLECTIONS.indexOf(req.collection);
    //   COLLECTIONS.splice(index, 1);
    //
    //   res.json(req.collection);
    });


  router.route('/items')
    .get(function(req, res) {
      console.log('GET');
      // 70ms latency
      setTimeout(function() {
        res.json(toHALResponse(req, ITEMS));
      }, 0);

    // })
    // .post(function(req, res) {
    //   console.log('POST', util.inspect(req.body, { colors: true }));
    //   let item = req.body;
    //   if (item) {
    //     ITEMS.push({
    //       value: item.value,
    //       created_at: new Date(),
    //       completed: item.completed,
    //       id: ITEM_COUNT++
    //     });
    //     return res.json(item);
    //   }
    //
    //   return res.end();
    });

  router.param('item_id', function(req, res, next, item_id) {
    // ensure correct prop type
    let id = req.params.item_id;
    try {
      req.item_id = id;
      req.item = ITEMS.find((item) => {
        return item.id === id;
      });
      next();
    } catch (e) {
      next(new Error('failed to load item'));
    }
  });

  router.route('/items/:item_id')
    .get(function(req, res) {
      console.log('GET', util.inspect(req.item, { colors: true }));
      const metadataIds: string[] = req.item.relationships.metadata.data.map(obj => obj.id);
      const itemMetadata: any[] = METADATA.filter((metadatum) => {
        return metadataIds.indexOf(metadatum.id) >= 0
      });
      res.json(toHALResponse(req, req.item, itemMetadata));
    // })
    // .put(function(req, res) {
    //   console.log('PUT', util.inspect(req.body, { colors: true }));
    //
    //   let index = ITEMS.indexOf(req.item);
    //   let item = ITEMS[index] = req.body;
    //
    //   res.json(item);
    // })
    // .delete(function(req, res) {
    //   console.log('DELETE', req.item_id);
    //
    //   let index = ITEMS.indexOf(req.item);
    //   ITEMS.splice(index, 1);
    //
    //   res.json(req.item);
    });

    router.route('/bundles')
        .get(function(req, res) {
            console.log('GET');
            // 70ms latency
            setTimeout(function() {
                res.json(toHALResponse(req, BUNDLES));
            }, 0);
        });

    router.param('bundle_id', function(req, res, next, bundle_id) {
        // ensure correct prop type
        let id = req.params.bundle_id;
        try {
            req.bundle_id = id;
            req.bundle = BUNDLES.find((bundle) => {
                return bundle.id === id;
            });
            next();
        } catch (e) {
            next(new Error('failed to load item'));
        }
    });

    router.route('/bundles/:bundle_id')
        .get(function(req, res) {
            console.log('GET', util.inspect(req.bundle, { colors: true }));
            const metadataIds: string[] = req.bundle.relationships.metadata.data.map(obj => obj.id);
            const bundleMetadata: any[] = METADATA.filter((metadatum) => {
                return metadataIds.indexOf(metadatum.id) >= 0
            });
            res.json(toHALResponse(req, req.bundle, bundleMetadata));
        });


    router.route('/bitstreams')
        .get(function(req, res) {
            console.log('GET');
            // 70ms latency
            setTimeout(function() {
                res.json(toHALResponse(req, BITSTREAMS));
            }, 0);
        });

    router.param('bitstream_id', function(req, res, next, bitstream_id) {
        // ensure correct prop type
        let id = req.params.bitstream_id;
        try {
            req.bitstream_id = id;
            req.bitstream = BITSTREAMS.find((bitstream) => {
                return bitstream.id === id;
            });
            next();
        } catch (e) {
            next(new Error('failed to load item'));
        }
    });

    router.route('/bitstreams/:bitstream_id')
        .get(function(req, res) {
            console.log('GET', util.inspect(req.bitstream, { colors: true }));
            const metadataIds: string[] = req.bitstream.relationships.metadata.data.map(obj => obj.id);
            const bitstreamMetadata: any[] = METADATA.filter((metadatum) => {
                return metadataIds.indexOf(metadatum.id) >= 0
            });
            res.json(toHALResponse(req, req.bitstream, bitstreamMetadata));
        });

  return router;
}
