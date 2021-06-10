import { EDITING_PROGRESS } from '@eeacms/volto-editing-progress/actionTypes';

/**
 * getEditingProgress function.
 * @function getEditingProgress
 * @param {item} url URL.
 * @returns {Object} Object.
 */
export function getEditingProgress(item) {
  return {
    type: EDITING_PROGRESS,
    request: {
      op: 'get',
      path: `${item}/@editing.progress`,
      headers: {
        Accept: 'application/json',
      },
    },
  };
}
