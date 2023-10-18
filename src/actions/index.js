import { EDITING_PROGRESS, GET_RAW_CONTENT } from '../actionTypes';
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
export function getRawContent(url, headers = {}) {
  return {
    type: GET_RAW_CONTENT,
    request: {
      op: 'get',
      path: url,
      headers,
    },
    url,
  };
}
