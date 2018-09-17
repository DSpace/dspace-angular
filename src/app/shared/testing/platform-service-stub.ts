
// declare a stub service
export class PlatformServiceStub {

  public get isBrowser(): boolean {
    return true;
  }

  public get isServer(): boolean {
    return false;
  }
}
