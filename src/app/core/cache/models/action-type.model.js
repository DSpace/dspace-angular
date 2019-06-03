/**
 * Enum representing the Action Type of a Resource Policy
 */
export var ActionType;
(function (ActionType) {
    /**
     * Action of reading, viewing or downloading something
     */
    ActionType[ActionType["READ"] = 0] = "READ";
    /**
     * Action of modifying something
     */
    ActionType[ActionType["WRITE"] = 1] = "WRITE";
    /**
     * Action of deleting something
     */
    ActionType[ActionType["DELETE"] = 2] = "DELETE";
    /**
     * Action of adding something to a container
     */
    ActionType[ActionType["ADD"] = 3] = "ADD";
    /**
     * Action of removing something from a container
     */
    ActionType[ActionType["REMOVE"] = 4] = "REMOVE";
    /**
     * Action of performing workflow step 1
     */
    ActionType[ActionType["WORKFLOW_STEP_1"] = 5] = "WORKFLOW_STEP_1";
    /**
     * Action of performing workflow step 2
     */
    ActionType[ActionType["WORKFLOW_STEP_2"] = 6] = "WORKFLOW_STEP_2";
    /**
     *  Action of performing workflow step 3
     */
    ActionType[ActionType["WORKFLOW_STEP_3"] = 7] = "WORKFLOW_STEP_3";
    /**
     *  Action of performing a workflow abort
     */
    ActionType[ActionType["WORKFLOW_ABORT"] = 8] = "WORKFLOW_ABORT";
    /**
     * Default Read policies for Bitstreams submitted to container
     */
    ActionType[ActionType["DEFAULT_BITSTREAM_READ"] = 9] = "DEFAULT_BITSTREAM_READ";
    /**
     *  Default Read policies for Items submitted to container
     */
    ActionType[ActionType["DEFAULT_ITEM_READ"] = 10] = "DEFAULT_ITEM_READ";
    /**
     * Administrative actions
     */
    ActionType[ActionType["ADMIN"] = 11] = "ADMIN";
})(ActionType || (ActionType = {}));
//# sourceMappingURL=action-type.model.js.map