import { Injectable } from '@angular/core';

/**
 * Allocates unique search instance ids and reuses them after a search component is destroyed.
 *
 * Reusing released ids keeps URL parameter prefixes stable when Angular recreates all search
 * components after a query-parameter navigation.
 */
@Injectable({ providedIn: 'root' })
export class SearchInstanceIdService {

  private readonly allocatedIds: Map<string, Set<number>> = new Map<string, Set<number>>();

  acquire(baseId: string): string {
    const allocatedForBase = this.allocatedIds.get(baseId) ?? new Set<number>();
    let suffix = 1;
    while (allocatedForBase.has(suffix)) {
      suffix++;
    }
    allocatedForBase.add(suffix);
    this.allocatedIds.set(baseId, allocatedForBase);
    return `${baseId}${suffix}`;
  }

  release(baseId: string, instanceId: string): void {
    if (!instanceId.startsWith(baseId)) {
      return;
    }
    const suffix = Number(instanceId.substring(baseId.length));
    if (!Number.isInteger(suffix) || suffix < 1) {
      return;
    }
    const allocatedForBase = this.allocatedIds.get(baseId);
    allocatedForBase?.delete(suffix);
    if (allocatedForBase?.size === 0) {
      this.allocatedIds.delete(baseId);
    }
  }

}
