// import { AUTOCOMPLETE_OFF, DYNAMIC_FORM_CONTROL_INPUT_TYPE_TEXT } from '@ng-dynamic-forms/core';
// import { Observable } from 'rxjs/Observable';
//
// import {
//   DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD, DynamicTypeaheadModel,
//   DynamicTypeaheadResponseModel
// } from './dynamic-tag.model';
// import { PageInfo } from '../../../../../../core/shared/page-info.model';
//
// describe('DynamicTypeaheadModel test suite', () => {
//
//   let model: any;
//   const search = (text: string): Observable<DynamicTypeaheadResponseModel> =>
//     Observable.of({
//       list: ['One', 'Two', 'Three'],
//       pageInfo: new PageInfo()
//     });
//   const config = {
//     id: 'input',
//     minChars: 3,
//     search: search
//   };
//
//   beforeEach(() => model = new DynamicTypeaheadModel(config));
//
//   it('tests if correct default type property is set', () => {
//
//     expect(model.type).toEqual(DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD);
//   });
//
//   it('tests if correct default input type property is set', () => {
//
//     expect(model.inputType).toEqual(DYNAMIC_FORM_CONTROL_INPUT_TYPE_TEXT);
//   });
//
//   it('tests if correct default autoComplete property is set', () => {
//
//     expect(model.autoComplete).toEqual(AUTOCOMPLETE_OFF);
//   });
//
//   it('tests if correct default autoFocus property is set', () => {
//
//     expect(model.autoFocus).toBe(false);
//   });
//
//   it('tests if correct default cls properties aree set', () => {
//
//     expect(model.cls).toBeDefined();
//     expect(model.cls.element.container).toEqual('');
//     expect(model.cls.element.control).toEqual('');
//     expect(model.cls.element.errors).toEqual('');
//     expect(model.cls.element.label).toEqual('');
//     expect(model.cls.grid.container).toEqual('');
//     expect(model.cls.grid.control).toEqual('');
//     expect(model.cls.grid.errors).toEqual('');
//     expect(model.cls.grid.label).toEqual('');
//   });
//
//   it('tests if correct default hint property is set', () => {
//
//     expect(model.hint).toBeNull();
//   });
//
//   it('tests if correct default label property is set', () => {
//
//     expect(model.label).toBeNull();
//   });
//
//   it('tests if correct default max property is set', () => {
//
//     expect(model.max).toBeNull();
//   });
//
//   it('tests if correct default maxLength property is set', () => {
//
//     expect(model.maxLength).toBeNull();
//   });
//
//   it('tests if correct default minLength property is set', () => {
//
//     expect(model.minLength).toBeNull();
//   });
//
//   it('tests if correct minChars property is set', () => {
//
//     expect(model.minChars).toEqual(3);
//   });
//
//   it('tests if correct default min property is set', () => {
//
//     expect(model.min).toBeNull();
//   });
//
//   it('tests if correct default placeholder property is set', () => {
//
//     expect(model.placeholder).toEqual('');
//   });
//
//   it('tests if correct default readonly property is set', () => {
//
//     expect(model.readOnly).toBe(false);
//   });
//
//   it('tests if correct default required property is set', () => {
//
//     expect(model.required).toBe(false);
//   });
//
//   it('tests if correct default spellcheck property is set', () => {
//
//     expect(model.spellCheck).toBe(false);
//   });
//
//   it('tests if correct default step property is set', () => {
//
//     expect(model.step).toBeNull();
//   });
//
//   it('tests if correct default prefix property is set', () => {
//
//     expect(model.prefix).toBeNull();
//   });
//
//   it('tests if correct default suffix property is set', () => {
//
//     expect(model.suffix).toBeNull();
//   });
//
//   it('tests if correct search function is set', () => {
//
//     expect(model.search).toBe(search);
//   });
//
//   it('should serialize correctly', () => {
//
//     const json = JSON.parse(JSON.stringify(model));
//
//     expect(json.id).toEqual(model.id);
//     expect(json.disabled).toEqual(model.disabled);
//     expect(json.value).toBe(model.value);
//     expect(json.type).toEqual(DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD);
//   });
// });
