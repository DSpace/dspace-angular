/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import crypto from 'crypto';
import {
  copyFileSync,
  existsSync,
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
import { hasValue } from '../../app/shared/empty.util';
import {
  HashedFileMapping,
  ID,
} from './hashed-file-mapping';

const HEAD_LINK_CLASS = 'hfm';

interface HeadLink {
  path: string;
  rel: string;
  as: string;
  crossorigin?: string;
}

/**
 * Server-side implementation of {@link HashedFileMapping}.
 * Registers dynamically hashed files and stores them in index.html for the browser to use.
 */
export class ServerHashedFileMapping extends HashedFileMapping {
  public readonly indexPath: string;
  private readonly indexContent: string;

  protected readonly headLinks: Map<string, HeadLink> = new Map();

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
  add(path: string, content?: string, compress = false): string {
    if (content === undefined) {
      content = readFileSync(path).toString();
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

    return hashPath;
  }

  addThemeStyle(theme: string, prefetch = true) {
    const path = `${this.root}/${theme}-theme.css`;
    const hashPath = this.add(path);

    if (prefetch) {
      // We know this CSS is likely needed, so we can avoid a FOUC by retrieving it in advance
      // Angular does the same for global styles, but doesn't "know" about our themes
      this.addHeadLink({
        path,
        rel: 'prefetch',
        as: 'style',
      });
    }

    // We know theme CSS has been compressed already
    this.ensureCompressedFilesAssumingUnchangedContent(path, hashPath, '.br');
    this.ensureCompressedFilesAssumingUnchangedContent(path, hashPath, '.gz');
  }

  /**
   * Include a head link for a given resource to the index HTML.
   */
  addHeadLink(headLink: HeadLink) {
    this.headLinks.set(headLink.path, headLink);
  }

  private renderHeadLink(link: HeadLink): string {
    const href = relative(this.root, this.resolve(link.path));

    if (hasValue(link.crossorigin)) {
      return `<link rel="${link.rel}" as="${link.as}" href="${href}" crossorigin="${link.crossorigin}" class="${HEAD_LINK_CLASS}">`;
    } else {
      return `<link rel="${link.rel}" as="${link.as}" href="${href}" class="${HEAD_LINK_CLASS}">`;
    }
  }

  private ensureCompressedFilesAssumingUnchangedContent(path: string, hashedPath: string, compression: string) {
    const compressedPath = `${path}${compression}`;
    const compressedHashedPath = `${hashedPath}${compression}`;

    if (existsSync(compressedPath) && !existsSync(compressedHashedPath)) {
      copyFileSync(compressedPath, compressedHashedPath);
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
    root.querySelectorAll(`script#${ID}, link.${HEAD_LINK_CLASS}`)?.forEach(e => e.remove());
    root.querySelector('head')
        .appendChild(`<script id="${ID}" type="application/json">${JSON.stringify(out)}</script>` as any);

    for (const headLink of this.headLinks.values()) {
      root.querySelector('head')
          .appendChild(this.renderHeadLink(headLink) as any);
    }

    writeFileSync(this.indexPath, root.toString());
  }
}
