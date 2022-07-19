import { InitService } from './init.service';
import { APP_CONFIG } from 'src/config/app-config.interface';
import { APP_INITIALIZER } from '@angular/core';
import objectContaining = jasmine.objectContaining;
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

let spy: SpyObj<any>;

export class ConcreteInitServiceMock extends InitService {
  protected static resolveAppConfig() {
    spy.resolveAppConfig();
  }

  protected init(): () => Promise<boolean> {
    spy.init();
    return async () => true;
  }
}


describe('InitService', () => {
  describe('providers', () => {
    beforeEach(() => {
      spy = createSpyObj('ConcreteInitServiceMock', {
        resolveAppConfig: null,
        init: null,
      });
    });

    it('should throw error when called on abstract InitService', () => {
      expect(() => InitService.providers()).toThrow();
    });

    it('should correctly set up provider dependencies', () => {
      const providers = ConcreteInitServiceMock.providers();

      expect(providers).toContain(objectContaining({
        provide: InitService,
        useClass: ConcreteInitServiceMock
      }));

      expect(providers).toContain(objectContaining({
        provide: APP_CONFIG,
      }));

      expect(providers).toContain(objectContaining({
        provide: APP_INITIALIZER,
        deps: [ InitService ],
        multi: true,
      }));
    });

    it('should call resolveAppConfig() in APP_CONFIG factory', () => {
      const factory = (
        ConcreteInitServiceMock.providers()
                               .find((p: any) => p.provide === APP_CONFIG) as any
      ).useFactory;

      // this factory is called _before_ InitService is instantiated
      factory();
      expect(spy.resolveAppConfig).toHaveBeenCalled();
      expect(spy.init).not.toHaveBeenCalled();
    });

    it('should defer to init() in APP_INITIALIZER factory', () => {
      const factory = (
        ConcreteInitServiceMock.providers()
                               .find((p: any) => p.provide === APP_INITIALIZER) as any
      ).useFactory;

      // we don't care about the dependencies here
      // @ts-ignore
      const instance = new ConcreteInitServiceMock(null, null, null);

      // provider ensures that the right concrete instance is passed to the factory
      factory(instance);
      expect(spy.resolveAppConfig).not.toHaveBeenCalled();
      expect(spy.init).toHaveBeenCalled();
    });
  });
});

