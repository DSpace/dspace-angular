export const MockWindow = {
  location: {
    _href: '',
    set href(url: string) {
      this._href = url;
    },
    get href() {
      return this._href;
    }
  }
};

export class NativeWindowRefMock {
  get nativeWindow(): any {
    return MockWindow;
  }
}

export function NativeWindowMockFactory() {
  return new NativeWindowRefMock();
}
