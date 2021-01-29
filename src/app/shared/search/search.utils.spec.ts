import { FacetValue } from './facet-value.model';
import { SearchFilterConfig } from './search-filter-config.model';
import {
  addOperatorToFilterValue,
  escapeRegExp,
  getFacetValueForType,
  stripOperatorFromFilterValue
} from './search.utils';

describe('Search Utils', () => {
  describe('getFacetValueForType', () => {
    let facetValueWithSearchHref: FacetValue;
    let facetValueWithoutSearchHref: FacetValue;
    let searchFilterConfig: SearchFilterConfig;

    beforeEach(() => {
      facetValueWithSearchHref = Object.assign(new FacetValue(), {
        value: 'Value with search href',
        _links: {
          search: {
            href: 'rest/api/search?f.otherFacet=Other facet value,operator&f.facetName=Value with search href,operator'
          }
        }
      });
      facetValueWithoutSearchHref = Object.assign(new FacetValue(), {
        value: 'Value without search href'
      });
      searchFilterConfig = Object.assign(new SearchFilterConfig(), {
        name: 'facetName'
      });
    });

    it('should retrieve the correct value from the search href', () => {
      expect(getFacetValueForType(facetValueWithSearchHref, searchFilterConfig)).toEqual('Value with search href,operator');
    });

    it('should return the facet value with an equals operator by default', () => {
      expect(getFacetValueForType(facetValueWithoutSearchHref, searchFilterConfig)).toEqual('Value without search href,equals');
    });
  });

  describe('stripOperatorFromFilterValue', () => {
    it('should strip the operator from the value', () => {
      expect(stripOperatorFromFilterValue('value,operator')).toEqual('value');
    });
  });

  describe('addOperatorToFilterValue', () => {
    it('should add the operator to the value', () => {
      expect(addOperatorToFilterValue('value', 'operator')).toEqual('value,operator');
    });

    it('shouldn\'t add the operator to the value if it already contains the operator', () => {
      expect(addOperatorToFilterValue('value,operator', 'operator')).toEqual('value,operator');
    });
  });

  describe(`escapeRegExp`, () => {
    it(`should escape all occurrences of '.' in the input string`, () => {
      const input = `a.string.with.a.number.of.'.'s.in.it`;
      const expected = `a\\.string\\.with\\.a\\.number\\.of\\.'\\.'s\\.in\\.it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '*' in the input string`, () => {
      const input = `a*string*with*a*number*of*'*'s*in*it`;
      const expected = `a\\*string\\*with\\*a\\*number\\*of\\*'\\*'s\\*in\\*it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '+' in the input string`, () => {
      const input = `a+string+with+a+number+of+'+'s+in+it`;
      const expected = `a\\+string\\+with\\+a\\+number\\+of\\+'\\+'s\\+in\\+it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '-' in the input string`, () => {
      const input = `a-string-with-a-number-of-'-'s-in-it`;
      const expected = `a\\-string\\-with\\-a\\-number\\-of\\-'\\-'s\\-in\\-it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '?' in the input string`, () => {
      const input = `a?string?with?a?number?of?'?'s?in?it`;
      const expected = `a\\?string\\?with\\?a\\?number\\?of\\?'\\?'s\\?in\\?it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '^' in the input string`, () => {
      const input = `a^string^with^a^number^of^'^'s^in^it`;
      const expected = `a\\^string\\^with\\^a\\^number\\^of\\^'\\^'s\\^in\\^it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '$' in the input string`, () => {
      const input = `a$string$with$a$number$of$'$'s$in$it`;
      const expected = `a\\$string\\$with\\$a\\$number\\$of\\$'\\$'s\\$in\\$it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '{' in the input string`, () => {
      const input = `a{string{with{a{number{of{'{'s{in{it`;
      const expected = `a\\{string\\{with\\{a\\{number\\{of\\{'\\{'s\\{in\\{it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '}' in the input string`, () => {
      const input = `a}string}with}a}number}of}'}'s}in}it`;
      const expected = `a\\}string\\}with\\}a\\}number\\}of\\}'\\}'s\\}in\\}it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '(' in the input string`, () => {
      const input = `a(string(with(a(number(of('('s(in(it`;
      const expected = `a\\(string\\(with\\(a\\(number\\(of\\('\\('s\\(in\\(it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of ')' in the input string`, () => {
      const input = `a)string)with)a)number)of)')'s)in)it`;
      const expected = `a\\)string\\)with\\)a\\)number\\)of\\)'\\)'s\\)in\\)it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '|' in the input string`, () => {
      const input = `a|string|with|a|number|of|'|'s|in|it`;
      const expected = `a\\|string\\|with\\|a\\|number\\|of\\|'\\|'s\\|in\\|it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '[' in the input string`, () => {
      const input = `a[string[with[a[number[of['['s[in[it`;
      const expected = `a\\[string\\[with\\[a\\[number\\[of\\['\\['s\\[in\\[it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of ']' in the input string`, () => {
      const input = `a]string]with]a]number]of]']'s]in]it`;
      const expected = `a\\]string\\]with\\]a\\]number\\]of\\]'\\]'s\\]in\\]it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '\' in the input string`, () => {
      const input = `a\\string\\with\\a\\number\\of\\'\\'s\\in\\it`;
      const expected = `a\\\\string\\\\with\\\\a\\\\number\\\\of\\\\'\\\\'s\\\\in\\\\it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
  });
});
