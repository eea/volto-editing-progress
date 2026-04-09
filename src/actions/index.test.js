import {
  EDITING_PROGRESS,
  GET_RAW_CONTENT,
} from '@eeacms/volto-editing-progress/actionTypes';
import { getEditingProgress, getRawContent } from './index';

describe('editing-progress actions', () => {
  it('builds getEditingProgress request payload', () => {
    expect(getEditingProgress('/news')).toEqual({
      type: EDITING_PROGRESS,
      request: {
        op: 'get',
        path: '/news/@editing.progress',
        headers: {
          Accept: 'application/json',
        },
      },
    });
  });

  it('builds getRawContent request payload with headers', () => {
    const headers = { Authorization: 'Bearer token' };

    expect(getRawContent('/@types/Document', headers)).toEqual({
      type: GET_RAW_CONTENT,
      request: {
        op: 'get',
        path: '/@types/Document',
        headers,
      },
      url: '/@types/Document',
    });
  });
});
