import { first } from 'rxjs/operators';
import { getAllSucceededRemoteData } from '../../core/shared/operators';
/**
 * Return first Observable of a RemoteData object that complies to the provided predicate
 * @param predicate
 */
export var findSuccessfulAccordingTo = function (predicate) {
    return function (source) {
        return source.pipe(getAllSucceededRemoteData(), first(predicate));
    };
};
//# sourceMappingURL=edit-item-operators.js.map