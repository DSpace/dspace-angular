import { TestBed } from '@angular/core/testing';

import { StringReplacePipe } from './string-replace.pipe';

describe('StringReplacePipe Pipe', () => {

  let stringReplacePipe: StringReplacePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StringReplacePipe,
      ],
    }).compileComponents();

    stringReplacePipe = TestBed.inject(StringReplacePipe);
  });

  it('should replace the character specified in the regex parameter', async () => {
    testTransform(
      'This_is_a_test', '_', ' ', 'This is a test',
    );
  });

  it('should not transform empty value',  () => {
    testTransform(
      '', '_', ' ', '',
    );
  });

  function testTransform(input: string, regex: string, replaceValue: string, output: string) {
    expect(
      stringReplacePipe.transform(input, regex, replaceValue),
    ).toMatch(
      output,
    );
  }
});
