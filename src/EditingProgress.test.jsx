import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import EditingProgress from './EditingProgress';
import { useDispatch, useSelector } from 'react-redux';
import { getEditingProgress } from './actions';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@plone/volto/helpers', () => ({
  getBaseUrl: jest.fn(() => '/news'),
  flattenToAppURL: jest.fn((url) => url),
}));

jest.mock('@plone/volto/components/manage/Pluggable', () => ({
  Plug: ({ children }) => children(),
}));

describe('EditingProgress component', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(dispatch);
  });

  it('fetches progress, renders remaining steps and toggles sidebar', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        editingProgress: {
          editing: { loaded: true },
          result: {
            steps: [
              {
                is_ready: false,
                states: ['all'],
                link: '/news/edit#title',
                link_label: 'Add title',
              },
              {
                is_ready: true,
                states: ['all'],
                link: '/news/edit#description',
                link_label: 'Add description',
              },
            ],
          },
        },
      }),
    );

    render(
      <EditingProgress
        token="token"
        pathname="/news/edit"
        content={{ '@id': '/news', review_state: 'private' }}
      />,
    );

    expect(dispatch).toHaveBeenCalledWith(getEditingProgress('/news'));
    expect(screen.getByText('1 fields missing')).toBeInTheDocument();
    expect(screen.getByText('Add title')).toBeInTheDocument();

    const sidebar = document.querySelector('.sidenav-ol--ep');
    expect(sidebar).toHaveClass('is-hidden');
    fireEvent.click(screen.getByText('1 fields missing'));
    expect(sidebar).not.toHaveClass('is-hidden');
  });

  it('renders null without auth token', () => {
    useSelector.mockImplementation((selector) =>
      selector({ editingProgress: {} }),
    );
    const { container } = render(
      <EditingProgress pathname="/news/edit" content={{ '@id': '/news' }} />,
    );

    expect(container.firstChild).toBeNull();
    expect(dispatch).not.toHaveBeenCalled();
  });
});
