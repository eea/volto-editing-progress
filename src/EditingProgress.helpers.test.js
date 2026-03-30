import { filter_remaining_steps } from './EditingProgress';

describe('filter_remaining_steps', () => {
  it('returns only not-ready steps for current state and "all"', () => {
    const values = [
      { is_ready: true, states: ['published'] },
      { is_ready: false, states: ['private'] },
      { is_ready: false, states: ['all'] },
      { is_ready: false, states: ['published'] },
    ];

    expect(filter_remaining_steps(values, 'published')).toEqual([
      { is_ready: false, states: ['all'] },
      { is_ready: false, states: ['published'] },
    ]);
  });

  it('returns empty list when nothing matches', () => {
    const values = [
      { is_ready: true, states: ['all'] },
      { is_ready: false, states: ['private'] },
    ];

    expect(filter_remaining_steps(values, 'published')).toEqual([]);
  });
});
