import { DSpaceObjectType } from '../../dspace-object-type.model';
import { SearchFilter } from './search-filter.model';
import {
  escapeLuceneSpecialChars,
  SearchOptions,
} from './search-options.model';

describe('escapeLuceneSpecialChars', () => {

  it('should return plain text unchanged', () => {
    expect(escapeLuceneSpecialChars('hello world')).toEqual('hello world');
  });

  it('should escape +', () => {
    expect(escapeLuceneSpecialChars('a+b')).toEqual('a\\+b');
  });

  it('should escape -', () => {
    expect(escapeLuceneSpecialChars('a-b')).toEqual('a\\-b');
  });

  it('should escape & (and thereby &&)', () => {
    expect(escapeLuceneSpecialChars('a&&b')).toEqual('a\\&\\&b');
  });

  it('should escape | (and thereby ||)', () => {
    expect(escapeLuceneSpecialChars('a||b')).toEqual('a\\|\\|b');
  });

  it('should escape !', () => {
    expect(escapeLuceneSpecialChars('!a')).toEqual('\\!a');
  });

  it('should escape (', () => {
    expect(escapeLuceneSpecialChars('(a')).toEqual('\\(a');
  });

  it('should escape )', () => {
    expect(escapeLuceneSpecialChars('a)')).toEqual('a\\)');
  });

  it('should escape {', () => {
    expect(escapeLuceneSpecialChars('{a')).toEqual('\\{a');
  });

  it('should escape }', () => {
    expect(escapeLuceneSpecialChars('a}')).toEqual('a\\}');
  });

  it('should escape [', () => {
    expect(escapeLuceneSpecialChars('[a')).toEqual('\\[a');
  });

  it('should escape ]', () => {
    expect(escapeLuceneSpecialChars('a]')).toEqual('a\\]');
  });

  it('should escape ^', () => {
    expect(escapeLuceneSpecialChars('^a')).toEqual('\\^a');
  });

  it('should escape "', () => {
    expect(escapeLuceneSpecialChars('"a"')).toEqual('\\"a\\"');
  });

  it('should escape ~', () => {
    expect(escapeLuceneSpecialChars('a~')).toEqual('a\\~');
  });

  it('should escape *', () => {
    expect(escapeLuceneSpecialChars('a*')).toEqual('a\\*');
  });

  it('should escape ?', () => {
    expect(escapeLuceneSpecialChars('a?')).toEqual('a\\?');
  });

  it('should escape :', () => {
    expect(escapeLuceneSpecialChars('title:foo')).toEqual('title\\:foo');
  });

  it('should escape \\', () => {
    expect(escapeLuceneSpecialChars('a\\b')).toEqual('a\\\\b');
  });

  it('should escape /', () => {
    expect(escapeLuceneSpecialChars('a/b')).toEqual('a\\/b');
  });

  it('should escape multiple special characters in one string', () => {
    expect(escapeLuceneSpecialChars('(hello+world)')).toEqual('\\(hello\\+world\\)');
  });

  it('should escape all special characters when they appear together', () => {
    expect(escapeLuceneSpecialChars('+-&|!(){}[]^"~*?:\\/')).toEqual('\\+\\-\\&\\|\\!\\(\\)\\{\\}\\[\\]\\^\\"\\~\\*\\?\\:\\\\\\/');
  });

});

describe('SearchOptions', () => {
  let options: SearchOptions;

  const filters = [
    new SearchFilter('f.test', ['value']),
    new SearchFilter('f.example', ['another value', 'second value']), // should be split into two arguments, spaces should be URI-encoded
    new SearchFilter('f.range', ['[2002 TO 2021]'], 'equals'),        // value should be URI-encoded, ',equals' should not
  ];
  const fixedFilter = 'f.fixed=1234,5678,equals';                    // '=' and ',equals' should not be URI-encoded
  const query = 'search query';
  const scope = '0fde1ecb-82cc-425a-b600-ac3576d76b47';
  const baseUrl = 'www.rest.com';
  beforeEach(() => {
    options = new SearchOptions({
      filters: filters,
      query: query,
      scope: scope,
      dsoTypes: [DSpaceObjectType.ITEM],
      fixedFilter: fixedFilter,
    });
  });

  describe('when toRestUrl is called', () => {

    it('should generate a string with all parameters that are present', () => {
      const outcome = options.toRestUrl(baseUrl);
      expect(outcome).toEqual('www.rest.com?' +
        'f.fixed=1234%2C5678,equals&' +
        'query=search%20query&' +
        'scope=0fde1ecb-82cc-425a-b600-ac3576d76b47&' +
        'dsoType=ITEM&' +
        'f.test=value&' +
        'f.example=another%20value&' +
        'f.example=second%20value&' +
        'f.range=%5B2002%20TO%202021%5D,equals',
      );
    });

    it('should escape Lucene special characters in the query', () => {
      const specialOptions = new SearchOptions({ query: 'title:foo (bar)+baz' });
      const outcome = specialOptions.toRestUrl(baseUrl);
      expect(outcome).toEqual('www.rest.com?query=title%5C%3Afoo%20%5C(bar%5C)%5C%2Bbaz');
    });

    it('should not escape the query when expert mode is enabled', () => {
      const expertOptions = new SearchOptions({ query: 'title:foo', expert: true });
      const outcome = expertOptions.toRestUrl(baseUrl);
      expect(outcome).toEqual('www.rest.com?query=title%3Afoo');
    });

  });
});
