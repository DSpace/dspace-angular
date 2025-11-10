import { Observable } from 'rxjs';

/**
 * Utility type that allows stricter type checking when creating a method with output that is intended to be used
 * in a 'combineLatest' or similar call.
 */
export type ObservablesDictionary<T extends { [key: string]: any }> = {
  [key in keyof T]: Observable<T[key]>
};

/*
  How to use an ObservablesDictionary<T>:

  Suppose that you require multiple observables to fire before you can start with a task such as creating a form. The
  usual way to implement this is to create all the necessary observables, combine them in an array, pass the array as
  argument in a 'combineLatest' call, and subscribe to the resulting observable to handle the result.

  Having to deconstruct the array into its components can be tedious and error-prone. RxJS supports dictionaries of
  observables as input argument in 'combineLatest', so it would be nice to be able to use this while maximally making
  use of TypeScript's type safety. That is where the ObservablesDictionary type comes in.

  You start by defining the interface that should be the output of the 'combineLatest' method.
  e.g.:

  interface MyData {
    collection: Collection;
    bitstreams: PaginatedList<Bitstream>;
    title: string;
  }

  Now the input for the 'combineLatest' should be of type ObservablesDictionary<MyData>.
  In essence ObservablesDictionary<T> creates a copy of the defined interface T, while making observables of all of T's
  fields. ObservablesDictionary<T> also applies the additional constraint that all the keys of T must be strings, which
  is required for objects used in 'combineLatest'.

  ObservablesDictionary<MyData> is equivalent to the following:

  interface ObservablesDictionaryMyData {
    collection: Observable<Collection>;
    bitstreams: Observable<PaginatedList<Bitstream>>;
    title: Observable<string>;
  }

  This does not follow the convention of appending fieldNames of observables with the dollar sign ($). This is because
  RxJS maps the input names one-to-one to the output names, so they must be exactly the same.


  By using these types it becomes much easier to separate the process into multiple parts while maximally making use of
  the type system: The first function creates all the necessary observables and returns an object of type
  ObservablesDictionary<MyData>. The second function takes as argument an object of type MyData and performs whatever
  action you want to with the retrieved data. The final function then simply handles the necessary plumbing by calling
  the first method, placing the result as argument in a 'combineLatest' method, and in the subscription simply passing
  the result through to the second function.



  An example of this type in action can be found in the edit-bitstream-page component (as of writing this explainer).
  The edit-bitstream-page has the following interface that contains the required data:

  interface DataObjects {
    bitstream: Bitstream,
    bitstreamFormat: BitstreamFormat,
    bitstreamFormatOptions: PaginatedList<BitstreamFormat>,
    bundle: Bundle,
    primaryBitstream: Bitstream,
    item: Item,
  }

  The getDataObservables provides all the observables in an ObservablesDictionary<DataObjects> object
  which is used in the ngOnInit method to retrieve all the data necessary to create the edit form.
*/

