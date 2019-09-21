/**
 * Mock for [[CookieService]]
 */
export class MockCookieService {
  cookies: Map<string, string>;

  constructor(cookies: Map<string, string> = new Map()) {
    this.cookies = cookies;
  }

  set(name, value) {
    this.cookies.set(name, value);
  }

  get(name) {
    return this.cookies.get(name);
  }

  remove() {
    return jasmine.createSpy('remove');
  }

  getAll() {
    return jasmine.createSpy('getAll');
  }
}
