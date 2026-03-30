import { EDITING_PROGRESS, GET_RAW_CONTENT } from '../actionTypes';
import { editingProgress, rawdata } from './index';

describe('editingProgress reducer', () => {
  it('handles pending state', () => {
    const state = editingProgress(undefined, {
      type: `${EDITING_PROGRESS}_PENDING`,
    });

    expect(state.editing).toEqual({
      loading: true,
      loaded: false,
      error: null,
    });
  });

  it('handles success state', () => {
    const result = { item: 'ok' };
    const state = editingProgress(undefined, {
      type: `${EDITING_PROGRESS}_SUCCESS`,
      result,
    });

    expect(state.editing).toEqual({
      loading: false,
      loaded: true,
      error: null,
    });
    expect(state.result).toEqual(result);
  });

  it('handles failure state', () => {
    const error = { message: 'boom' };
    const state = editingProgress(undefined, {
      type: `${EDITING_PROGRESS}_FAIL`,
      error,
    });

    expect(state.editing).toEqual({
      loading: false,
      loaded: false,
      error,
    });
  });
});

describe('rawdata reducer', () => {
  it('handles pending state per url', () => {
    const state = rawdata(undefined, {
      type: `${GET_RAW_CONTENT}_PENDING`,
      url: '/path',
    });

    expect(state['/path']).toEqual({
      loading: true,
      loaded: false,
      error: undefined,
    });
  });

  it('handles success state per url', () => {
    const state = rawdata(
      {
        '/path': { loading: true, loaded: false },
      },
      {
        type: `${GET_RAW_CONTENT}_SUCCESS`,
        url: '/path',
        result: { title: 'Doc' },
      },
    );

    expect(state['/path']).toEqual({
      loading: false,
      loaded: true,
      error: undefined,
      data: { title: 'Doc' },
    });
  });

  it('handles fail state per url', () => {
    const error = { status: 500 };
    const state = rawdata(
      {
        '/path': { loading: true, loaded: false },
      },
      {
        type: `${GET_RAW_CONTENT}_FAIL`,
        url: '/path',
        error,
      },
    );

    expect(state['/path']).toEqual({
      loading: false,
      loaded: false,
      error,
    });
  });

  it('returns existing state on unknown action', () => {
    const prev = { '/path': { loaded: true } };
    expect(rawdata(prev, { type: 'UNKNOWN' })).toBe(prev);
  });
});
