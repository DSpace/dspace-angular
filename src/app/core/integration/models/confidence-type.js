export var ConfidenceType;
(function (ConfidenceType) {
    /**
     * This authority value has been confirmed as accurate by an
     * interactive user or authoritative policy
     */
    ConfidenceType[ConfidenceType["CF_ACCEPTED"] = 600] = "CF_ACCEPTED";
    /**
     * Value is singular and valid but has not been seen and accepted
     * by a human, so its provenance is uncertain.
     */
    ConfidenceType[ConfidenceType["CF_UNCERTAIN"] = 500] = "CF_UNCERTAIN";
    /**
     * There are multiple matching authority values of equal validity.
     */
    ConfidenceType[ConfidenceType["CF_AMBIGUOUS"] = 400] = "CF_AMBIGUOUS";
    /**
     * There are no matching answers from the authority.
     */
    ConfidenceType[ConfidenceType["CF_NOTFOUND"] = 300] = "CF_NOTFOUND";
    /**
     * The authority encountered an internal failure - this preserves a
     * record in the metadata of why there is no value.
     */
    ConfidenceType[ConfidenceType["CF_FAILED"] = 200] = "CF_FAILED";
    /**
     * The authority recommends this submission be rejected.
     */
    ConfidenceType[ConfidenceType["CF_REJECTED"] = 100] = "CF_REJECTED";
    /**
     * No reasonable confidence value is available
     */
    ConfidenceType[ConfidenceType["CF_NOVALUE"] = 0] = "CF_NOVALUE";
    /**
     * Value has not been set (DB default).
     */
    ConfidenceType[ConfidenceType["CF_UNSET"] = -1] = "CF_UNSET";
})(ConfidenceType || (ConfidenceType = {}));
//# sourceMappingURL=confidence-type.js.map