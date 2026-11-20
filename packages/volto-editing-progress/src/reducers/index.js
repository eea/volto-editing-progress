/**
 * Editing progress reducer.
 * @module reducers/editingProgress
 */

import {
  EDITING_PROGRESS,
  GET_RAW_CONTENT,
} from '@eeacms/volto-editing-progress/actionTypes';

const initialState = {
  get: {
    loaded: false,
    loading: false,
    error: null,
  },
  subrequests: {},
};

/**
 * Get request key
 * @function getRequestKey
 * @param {string} actionType Action type.
 * @returns {string} Request key.
 */
function getRequestKey(actionType) {
  return actionType.split('_')[0].toLowerCase();
}

/**
 * Editing progress  reducer.
 * @function editingProgress
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export function editingProgress(state = initialState, action = {}) {
  let { result } = action;
  switch (action.type) {
    case `${EDITING_PROGRESS}_PENDING`:
      return {
        ...state,
        [getRequestKey(action.type)]: {
          loading: true,
          loaded: false,
          error: null,
        },
      };
    case `${EDITING_PROGRESS}_SUCCESS`:
      return {
        ...state,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: null,
        },
        result,
      };
    case `${EDITING_PROGRESS}_FAIL`:
      return {
        ...state,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}
export function rawdata(state = {}, action = {}) {
  let { result, url } = action;

  switch (action.type) {
    case `${GET_RAW_CONTENT}_PENDING`:
      return {
        ...state,
        [url]: {
          ...state[url],
          loading: true,
          loaded: false,
          error: undefined,
        },
      };
    case `${GET_RAW_CONTENT}_SUCCESS`:
      return {
        ...state,
        [url]: {
          ...state[url],
          loading: false,
          loaded: true,
          error: undefined,
          data: result,
        },
      };
    case `${GET_RAW_CONTENT}_FAIL`:
      return {
        ...state,
        [url]: {
          ...state[url],
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    default:
      break;
  }
  return state;
}
