/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import crypto from 'crypto';
import {
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs';
import glob from 'glob';
import { parse } from 'node-html-parser';
import {
  extname,
  join,
  relative,
} from 'path';
import zlib from 'zlib';
import {
  HashedFileMapping,
  ID,
} from './hashed-file-mapping';

/**
 * Server-side implementation of {@link HashedFileMapping}.
 * Registers dynamically hashed files and stores them in index.html for the browser to use.
 */
export class ServerHashedFileMapping extends HashedFileMapping {
  public readonly indexPath: string;
  private readonly indexContent: string;

  constructor(
    private readonly root: string,
    file: string,
  ) {
    super();
    this.root = join(root, '');
    this.indexPath = join(root, file);
    this.indexContent = readFileSync(this.indexPath).toString();
  }

  /**
   * Add a new file to the mapping by an absolute path (within the root directory).
   * If {@link content} is provided, the {@link path} itself does not have to exist.
   * Otherwise, it is read out from the original path.
   * The original path is never overwritten.
   */
  add(path: string, content?: string, compress = false) {
    if (content === undefined) {
      readFileSync(path);
    }

    // remove previous files
    const ext = extname(path);
    glob.GlobSync(path.replace(`${ext}`, `.*${ext}*`))
        .found
        .forEach(p => rmSync(p));

    // hash the content
    const hash = crypto.createHash('md5')
                       .update(content)
                       .digest('hex');

    // add the hash to the path
    const hashPath = path.replace(`${ext}`, `.${hash}${ext}`);

    // store it in the mapping
    this.map.set(path, hashPath);

    // write the file
    writeFileSync(hashPath, content);

    if (compress) {
      // write the file as .br
      zlib.brotliCompress(content, (err, compressed) => {
        if (err) {
          throw new Error('Brotli compress failed');
        } else {
          writeFileSync(hashPath + '.br', compressed);
        }
      });

      // write the file as .gz
      zlib.gzip(content, (err, compressed) => {
        if (err) {
          throw new Error('Gzip compress failed');
        } else {
          writeFileSync(hashPath + '.gz', compressed);
        }
      });
    }
  }

  /**
   * Save the mapping as JSON in the index file.
   * The updated index file itself is hashed as well, and must be sent {@link resolve}.
   */
  save(): void {
    const out = Array.from(this.map.entries())
                     .reduce((object, [plain, hashed]) => {
                       object[relative(this.root, plain)] = relative(this.root, hashed);
                       return object;
                     }, {});

    let root = parse(this.indexContent);
    root.querySelector(`script#${ID}`)?.remove();
    root.querySelector('head')
        .appendChild(`<script id="${ID}" type="application/json">${JSON.stringify(out)}</script>` as any);

    this.add(this.indexPath, root.toString());
  }
}
