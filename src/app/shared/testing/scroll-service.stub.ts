/* eslint-disable no-empty, @typescript-eslint/no-empty-function */
export class ScrollServiceStub {

  activeFragment: string | null = null;

  setFragment(fragment: string): void {
    this.activeFragment = fragment;
  }

  scrollToActiveFragment(): void {
  }

  getScrollPosition(): [number, number] {
    return [0, 0];
  }

  restoreScrollPosition(_position: [number, number]): void {
  }

}
