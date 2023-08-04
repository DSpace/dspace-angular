/**
 * The routing paths
 */
export const HANDLE_TABLE_NEW_HANDLE_PATH = 'new-handle';
export const HANDLE_TABLE_EDIT_HANDLE_PATH = 'edit-handle';
export const GLOBAL_ACTIONS_PATH = 'change-handle-prefix';

export const HANDLE_TABLE_MODULE_PATH = 'handle-table';
export function getHandleTableModulePath() {
  return `/${HANDLE_TABLE_MODULE_PATH}`;
}
