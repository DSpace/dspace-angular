import { Observable } from 'rxjs';

/**
 * Component representing an option in each selectable list of values
 * used in the Filtered Items report query interface
 */
export class OptionVO {

  id: string;
  name$: Observable<string>;
  disabled = false;

  static collection(id: string, name: string, disabled: boolean = false): OptionVO {
    let opt = new OptionVO();
    opt.id = id;
    opt.name$ = OptionVO.toObservable(name);
    opt.disabled = disabled;
    return opt;
  }

  static collectionLoc(id: string, name$: Observable<string>, disabled: boolean = false): OptionVO {
    let opt = new OptionVO();
    opt.id = id;
    opt.name$ = name$;
    opt.disabled = disabled;
    return opt;
  }

  static item(id: string, name: string): OptionVO {
    let opt = new OptionVO();
    opt.id = id;
    opt.name$ = OptionVO.toObservable(name);
    return opt;
  }

  static itemLoc(id: string, name$: Observable<string>): OptionVO {
    let opt = new OptionVO();
    opt.id = id;
    opt.name$ = name$;
    return opt;
  }

  private static toObservable<T>(value: T): Observable<T> {
    return new Observable<T>(subscriber => {
      subscriber.next(value);
      subscriber.complete();
    });

  }
}
