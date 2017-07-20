export abstract class Cookies {

  abstract set(name: string, value: string, days: number, path?: string): void;

  abstract get(name: string): string;

  abstract remove(name: string): void;

}
