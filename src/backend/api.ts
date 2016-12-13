const util = require('util');
const { Router } = require('express');

// Our API for demos only
import { fakeDataBase } from './db';
import { fakeDemoRedisCache } from './cache';

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


// collection API

let COUNT = 2;
const COLLECTIONS = [
  {
    "id": "9e32a2e2-6b91-4236-a361-995ccdc14c60",
    "name": "Test Collection 1",
    "handle": "123456789/5179",
    "type": "collection",
    "copyrightText": "<p>© 2005-2016 JOHN DOE SOME RIGHTS RESERVED</p>",
    "introductoryText": "<p class='lead'>An introductory text dolor sit amet, consectetur adipiscing elit. Duis laoreet lorem erat, eget auctor est ultrices quis. Nullam ac tincidunt quam. In nec nisl odio. In egestas aliquam tincidunt.</p>\r\n<p>Integer vitae diam id dolor pharetra dignissim in sed enim. Vivamus pulvinar tristique sem a iaculis. Aenean ultricies dui vel facilisis laoreet. Integer porta erat eu ultrices rhoncus. Sed condimentum malesuada ex sit amet ullamcorper. Morbi a ipsum dolor. Vivamus interdum eget lacus ut fermentum.</p>",
    "shortDescription": "A collection for testing purposes",
    "sidebarText": "<p>Some news sed condimentum malesuada ex sit amet ullamcorper. Morbi a ipsum dolor. Vivamus interdum eget lacus ut fermentum. Donec sed ultricies erat, nec sollicitudin mauris. Duis varius nulla quis quam vulputate, at hendrerit turpis rutrum. Integer nec facilisis sapien. Fusce fringilla malesuada lectus id pulvinar. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae</p>",
  },
  {
    "id": "598ce822-c357-46f3-ab70-63724d02d6ad",
    "name": "Test Collection 2",
    "handle": "123456789/6547",
    "type": "collection",
    "copyrightText": "<p>© 2005-2016 JOHN DOE SOME RIGHTS RESERVED</p>",
    "introductoryText": "<p class='lead'>Another introductory text dolor sit amet, consectetur adipiscing elit. Duis laoreet lorem erat, eget auctor est ultrices quis. Nullam ac tincidunt quam. In nec nisl odio. In egestas aliquam tincidunt.</p>\r\n<p>Integer vitae diam id dolor pharetra dignissim in sed enim. Vivamus pulvinar tristique sem a iaculis. Aenean ultricies dui vel facilisis laoreet. Integer porta erat eu ultrices rhoncus. Sed condimentum malesuada ex sit amet ullamcorper. Morbi a ipsum dolor. Vivamus interdum eget lacus ut fermentum.</p>",
    "shortDescription": "Another collection for testing purposes",
    "sidebarText": "<p>Some more news sed condimentum malesuada ex sit amet ullamcorper. Morbi a ipsum dolor. Vivamus interdum eget lacus ut fermentum. Donec sed ultricies erat, nec sollicitudin mauris. Duis varius nulla quis quam vulputate, at hendrerit turpis rutrum. Integer nec facilisis sapien. Fusce fringilla malesuada lectus id pulvinar. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae</p>",
  }
];

export function createMockApi() {

  let router = Router();

  router.route('/collections')
    .get(function(req, res) {
      console.log('GET');
      // 70ms latency
      setTimeout(function() {
        res.json(COLLECTIONS);
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
    //       id: COUNT++
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
        return collection.id = id;
      });
      next();
    } catch (e) {
      next(new Error('failed to load collection'));
    }
  });

  router.route('/collections/:collection_id')
    .get(function(req, res) {
      console.log('GET', util.inspect(req.collection, { colors: true }));

      res.json(req.collection);
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

  return router;
}
