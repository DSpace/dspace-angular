import { Injectable } from '@angular/core';
import {
  ExternalScriptsList,
  ExternalScriptsStatus,
} from './external-script.model';

declare const document: any;

/**
 * Service used to load external scripts in the DOM when it cannot be loaded from the standard angular methods
 */
@Injectable()
export class ExternalScriptLoaderService {
  private scriptsStored: any = {};

  constructor() {
    ExternalScriptsList.forEach(
      ({ name, src }) => (this.scriptsStored[name] = { loaded: false, src })
    );
  }

  /**
   * Load the scripts in the DOM and return every {@link Promise}
   * @param scriptsToLoad Scripts to load, see {@link scriptsToLoad}
   * @returns An array of the scripts promises
   */
  load(...scriptsToLoad: string[]): Promise<any[]> {
    let promises: any[] = [];
    scriptsToLoad.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  private loadScript(name: string) {
    return new Promise((resolve) => {
      if (this.isAlreadyLoaded(name)) {
        resolve(
          this.createResolveResult(
            name,
            true,
            ExternalScriptsStatus.ALREADY_LOADED
          )
        );
      } else {
        let script = this.createScriptHTMLElement(name);
        if (this.areWeInIE(script)) {
          this.configureOnReadyState(name, script, resolve);
        } else {
          this.configureOnLoad(name, script, resolve);
        }
        this.configureOnError(name, script, resolve);
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }

  private isAlreadyLoaded(name: string): boolean {
    return this.scriptsStored[name].loaded;
  }

  private areWeInIE(script: any): boolean {
    return script.readyState;
  }

  private createResolveResult(script: string, loaded: boolean, status: string) {
    return { script, loaded, status };
  }

  private createScriptHTMLElement(name: string): any {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = this.scriptsStored[name].src;

    return script;
  }

  private configureOnReadyState(name: string, script: any, resolve: any) {
    script.onreadystatechange = () => {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        this.scriptsStored[name].loaded = true;
        resolve(
          this.createResolveResult(name, true, ExternalScriptsStatus.LOADED)
        );
      }
    };
  }

  private configureOnLoad(name: string, script: any, resolve: any) {
    script.onload = () => {
      this.scriptsStored[name].loaded = true;
      resolve(
        this.createResolveResult(name, true, ExternalScriptsStatus.LOADED)
      );
    };
  }

  private configureOnError(name: string, script: any, resolve: any) {
    script.onerror = (error: any) =>
      resolve(
        this.createResolveResult(name, false, ExternalScriptsStatus.NOT_LOADED)
      );
  }
}
