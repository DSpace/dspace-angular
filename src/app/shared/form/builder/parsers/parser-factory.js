import { ParserType } from './parser-type';
import { DateFieldParser } from './date-field-parser';
import { DropdownFieldParser } from './dropdown-field-parser';
import { RelationGroupFieldParser } from './relation-group-field-parser';
import { ListFieldParser } from './list-field-parser';
import { LookupFieldParser } from './lookup-field-parser';
import { LookupNameFieldParser } from './lookup-name-field-parser';
import { OneboxFieldParser } from './onebox-field-parser';
import { NameFieldParser } from './name-field-parser';
import { SeriesFieldParser } from './series-field-parser';
import { TagFieldParser } from './tag-field-parser';
import { TextareaFieldParser } from './textarea-field-parser';
var ParserFactory = /** @class */ (function () {
    function ParserFactory() {
    }
    ParserFactory.getConstructor = function (type) {
        switch (type) {
            case ParserType.Date: {
                return DateFieldParser;
            }
            case ParserType.Dropdown: {
                return DropdownFieldParser;
            }
            case ParserType.RelationGroup: {
                return RelationGroupFieldParser;
            }
            case ParserType.List: {
                return ListFieldParser;
            }
            case ParserType.Lookup: {
                return LookupFieldParser;
            }
            case ParserType.LookupName: {
                return LookupNameFieldParser;
            }
            case ParserType.Onebox: {
                return OneboxFieldParser;
            }
            case ParserType.Name: {
                return NameFieldParser;
            }
            case ParserType.Series: {
                return SeriesFieldParser;
            }
            case ParserType.Tag: {
                return TagFieldParser;
            }
            case ParserType.Textarea: {
                return TextareaFieldParser;
            }
            default: {
                return undefined;
            }
        }
    };
    return ParserFactory;
}());
export { ParserFactory };
//# sourceMappingURL=parser-factory.js.map