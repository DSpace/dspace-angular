import { CacheableObject } from "../object-cache.reducer";

export abstract class DomainModelBuilder<TNormalized extends CacheableObject, TDomain> {
  protected href: string;
  protected normalized: TNormalized;

  constructor() {
  }

  setHref(href: string): DomainModelBuilder<TNormalized, TDomain> {
    this.href = href;
    return this;
  }

  setNormalized(normalized: TNormalized): DomainModelBuilder<TNormalized, TDomain> {
    this.normalized = normalized;
    return this;
  }

  abstract build(): TDomain;
}
