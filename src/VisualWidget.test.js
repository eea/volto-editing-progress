import { makeFirstLetterCapital } from './WidgetDataComponent';
import React from 'react';
import { Provider } from 'react-intl-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { backgroundColor } from './WidgetSidebar';
import '@testing-library/jest-dom/extend-expect';

import VisualJSONWidget from './VisualJSONWidget';

const mockStore = configureStore();
const propsEmpty = {};

describe('Widget Data Component', () => {
  it('should make first letter capital', () => {
    const testString = 'this is a test string';
    expect(makeFirstLetterCapital(testString)[0]).toEqual(
      testString[0].toUpperCase(),
    );
  });
});

describe('Widget Sidebar', () => {
  it('should return a background lightblue', () => {
    expect(backgroundColor(true, false)).toEqual('lightblue');
    expect(backgroundColor(true, true)).toEqual('lightblue');
  });
  it('should return a background lightpink', () => {
    expect(backgroundColor(false, true)).toEqual('lightpink');
  });
});

describe('Visual widget', () => {
  it('renders the VisualJSONWidget component without breaking if props and progressEditing are empty', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
      progressEditing: {},
      rawdata: {},
      types: {
        loaded: true,
        loading: false,
        types: [
          {
            id: 'content-type-1',
            title: 'Content Type 1',
            '@id': '/content-type-1',
          },
        ],
      },
    });
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <VisualJSONWidget
            pathname="/test"
            {...propsEmpty}
            hasToolbar={true}
            value={{}}
            onChange={jest.fn()}
          />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Edit JSON')).toBeInTheDocument();
    expect(screen.getByText('Add Property')).toBeInTheDocument();
    expect(
      container.querySelector('input[placeholder="Search... "]'),
    ).toBeInTheDocument();
    expect(screen.getByText('Content Type 1')).toBeInTheDocument();
  });
});
