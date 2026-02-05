/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import crypto from 'node:crypto';
import {
  copyFileSync,
  existsSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import {
  extname,
  join,
  relative,
} from 'node:path';
import zlib from 'node:zlib';

import { hasValue } from '@dspace/shared/utils/empty.util';
import { globSync } from 'glob';
import { parse } from 'node-html-parser';

import { ThemeConfig } from '../../config/theme.config';
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

  protected readonly headLinks: Set<HeadLink> = new Set();

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
    globSync(path.replace(`${ext}`, `.*${ext}*`))
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

  /**
   * Add CSS for all configured themes to the mapping
   * @param themeConfigurations
   */
  addThemeStyles(themeConfigurations: ThemeConfig[]) {
    for (const themeConfiguration of themeConfigurations) {
      const p = `${this.root}/${encodeURIComponent(themeConfiguration.name)}-theme.css`;
      const hp = this.add(p);

      // We know this CSS is likely needed, so wecan avoid a FOUC by retrieving it in advance
      // Angular does the same for global styles, but doesn't "know" about out themes
      this.addHeadLink({
        path: p,
        rel: 'prefetch',
        as: 'style',
      });

      this.ensureCompressedFilesAssumingUnchangedContent(p, hp, '.br');
      this.ensureCompressedFilesAssumingUnchangedContent(p, hp, '.gz');
    }
  }

  /**
   * Include a head link for a given resource to the index HTML.
   */
  addHeadLink(headLink: HeadLink) {
    this.headLinks.add(headLink);
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

    const root = parse(this.indexContent);
    root.querySelectorAll(`script#${ID}, link.${HEAD_LINK_CLASS}`)?.forEach(e => e.remove());
    root.querySelector('head')
      .appendChild(`<script id="${ID}" type="application/json">${JSON.stringify(out)}</script>` as any);

    for (const headLink of this.headLinks) {
      root.querySelector('head')
        .appendChild(this.renderHeadLink(headLink) as any);
    }

    writeFileSync(this.indexPath, root.toString());
  }
}
