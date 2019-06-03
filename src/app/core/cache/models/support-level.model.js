/**
 * Enum representing the Support Level of a Bitstream Format
 */
export var SupportLevel;
(function (SupportLevel) {
    /**
     * Unknown for Bitstream Formats that are unknown to the system
     */
    SupportLevel[SupportLevel["Unknown"] = 0] = "Unknown";
    /**
     * Unknown for Bitstream Formats that are known to the system, but not fully supported
     */
    SupportLevel[SupportLevel["Known"] = 1] = "Known";
    /**
     * Supported for Bitstream Formats that are known to the system and fully supported
     */
    SupportLevel[SupportLevel["Supported"] = 2] = "Supported";
})(SupportLevel || (SupportLevel = {}));
//# sourceMappingURL=support-level.model.js.map