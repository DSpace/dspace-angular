import 'core-js/fn/object/entries';
import { URLCombiner } from '../core/url-combiner/url-combiner';
import { isNotEmpty } from '../shared/empty.util';
import { SetViewMode } from '../shared/view-mode';

export class SearchOptions {
  view?: SetViewMode = SetViewMode.List;
  scope?: string;
  query?: string;
  filters?: any;

  toRestUrl(url: string, args: string[] = []): string {

    if (isNotEmpty(this.query)) {
      args.push(`query=${this.query}`);
    }

    if (isNotEmpty(this.scope)) {
      args.push(`scope=${this.scope}`);
    }
    if (isNotEmpty(this.filters)) {
      Object.entries(this.filters).forEach(([key, values]) => {
        values.forEach((value) => args.push(`${key}=${value},equals`));
      });
    }
    if (isNotEmpty(args)) {
      url = new URLCombiner(url, `?${args.join('&')}`).toString();
    }
    return url;
  }
}
