import { makeFirstLetterCapital } from './WidgetDataComponent';
import React from 'react';
import { Provider } from 'react-intl-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { backgroundColor } from './WidgetSidebar';
import '@testing-library/jest-dom/extend-expect';

import VisualJSONWidget from './VisualJSONWidget';
import EditDataComponent from './WidgetDataComponent';

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

  it('renders the VisualJSONWidget with enforceCharLimits option in dropdown', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
      progressEditing: {},
      rawdata: {
        '/content-type-1': {
          loaded: true,
          loading: false,
          data: {
            fieldsets: [{ fields: ['title', 'description'] }],
            required: ['title'],
          },
        },
      },
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
    render(
      <Provider store={store}>
        <MemoryRouter>
          <VisualJSONWidget
            pathname="/test"
            hasToolbar={true}
            value={{}}
            onChange={jest.fn()}
          />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Add Property')).toBeInTheDocument();
  });

  it('handles enforceCharLimits rule in value', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
      progressEditing: {},
      rawdata: {
        '/content-type-1': {
          loaded: true,
          loading: false,
          data: {
            fieldsets: [{ fields: ['title', 'description'] }],
            required: ['title'],
          },
        },
      },
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
    const valueWithCharLimits = {
      'content-type-1': [
        {
          type: 'enforceCharLimits',
          states: ['all'],
          linkLabel: 'Fix {title}',
        },
      ],
    };
    render(
      <Provider store={store}>
        <MemoryRouter>
          <VisualJSONWidget
            pathname="/test"
            hasToolbar={true}
            value={valueWithCharLimits}
            onChange={jest.fn()}
          />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Add Property')).toBeInTheDocument();
  });
});

describe('EditDataComponent with enforceCharLimits', () => {
  it('renders enforceCharLimits section when rule exists', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
      rawdata: {
        '/@vocabularies/plone.app.vocabularies.WorkflowStates': {
          loaded: true,
          loading: false,
          data: {
            items: [{ token: 'published' }, { token: 'private' }],
          },
        },
      },
    });

    const value = {
      'content-type-1': [
        {
          type: 'enforceCharLimits',
          states: ['all'],
          linkLabel: 'Fix {title}',
        },
      ],
    };

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditDataComponent
            request={{
              loaded: true,
              loading: false,
              data: { fieldsets: [{ fields: [] }], required: [] },
            }}
            handleOnDropdownChange={jest.fn()}
            currentContentType={{
              id: 'content-type-1',
              title: 'Content Type 1',
            }}
            value={value}
            fields={[]}
            getDropdownValues={jest.fn()}
            handleUpdateEnforceCharLimits={jest.fn()}
            handleRemoveEnforceCharLimits={jest.fn()}
          />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Enforce character limits')).toBeInTheDocument();
  });

  it('does not render enforceCharLimits section when rule does not exist', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
      rawdata: {
        '/@vocabularies/plone.app.vocabularies.WorkflowStates': {
          loaded: true,
          loading: false,
          data: {
            items: [{ token: 'published' }, { token: 'private' }],
          },
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditDataComponent
            request={{
              loaded: true,
              loading: false,
              data: { fieldsets: [{ fields: [] }], required: [] },
            }}
            handleOnDropdownChange={jest.fn()}
            currentContentType={{
              id: 'content-type-1',
              title: 'Content Type 1',
            }}
            value={{}}
            fields={[]}
            getDropdownValues={jest.fn()}
            handleUpdateEnforceCharLimits={jest.fn()}
            handleRemoveEnforceCharLimits={jest.fn()}
          />
        </MemoryRouter>
      </Provider>,
    );

    expect(
      screen.queryByText('Enforce character limits'),
    ).not.toBeInTheDocument();
  });

  it('calls handleRemoveEnforceCharLimits when cancel icon is clicked', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
      rawdata: {
        '/@vocabularies/plone.app.vocabularies.WorkflowStates': {
          loaded: true,
          loading: false,
          data: {
            items: [
              { token: 'published' },
              { token: 'private' },
            ],
          },
        },
      },
    });

    const value = {
      'content-type-1': [
        {
          type: 'enforceCharLimits',
          states: ['all'],
          linkLabel: 'Fix {title}',
        },
      ],
    };

    const handleRemove = jest.fn();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditDataComponent
            request={{ loaded: true, loading: false, data: { fieldsets: [{ fields: [] }], required: [] } }}
            handleOnDropdownChange={jest.fn()}
            currentContentType={{ id: 'content-type-1', title: 'Content Type 1' }}
            value={value}
            fields={[]}
            getDropdownValues={jest.fn()}
            handleUpdateEnforceCharLimits={jest.fn()}
            handleRemoveEnforceCharLimits={handleRemove}
          />
        </MemoryRouter>
      </Provider>,
    );

    const cancelIcon = screen.getByText('Enforce character limits').parentElement.parentElement.querySelector('.cancel');
    fireEvent.click(cancelIcon);
    expect(handleRemove).toHaveBeenCalled();
  });

  it('calls handleUpdateEnforceCharLimits when linkLabel input changes', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
      rawdata: {
        '/@vocabularies/plone.app.vocabularies.WorkflowStates': {
          loaded: true,
          loading: false,
          data: {
            items: [
              { token: 'published' },
              { token: 'private' },
            ],
          },
        },
      },
    });

    const value = {
      'content-type-1': [
        {
          type: 'enforceCharLimits',
          states: ['all'],
          linkLabel: 'Fix {title}',
        },
      ],
    };

    const handleUpdate = jest.fn();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditDataComponent
            request={{ loaded: true, loading: false, data: { fieldsets: [{ fields: [] }], required: [] } }}
            handleOnDropdownChange={jest.fn()}
            currentContentType={{ id: 'content-type-1', title: 'Content Type 1' }}
            value={value}
            fields={[]}
            getDropdownValues={jest.fn()}
            handleUpdateEnforceCharLimits={handleUpdate}
            handleRemoveEnforceCharLimits={jest.fn()}
          />
        </MemoryRouter>
      </Provider>,
    );

    // Click on accordion to expand it
    fireEvent.click(screen.getByText('Enforce character limits'));

    // Find and change the input
    const input = screen.getByPlaceholderText('Fix {title}');
    fireEvent.change(input, { target: { value: 'New label' } });

    expect(handleUpdate).toHaveBeenCalledWith('linkLabel', 'New label');
  });

  it('renders with empty currentContentType', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
      rawdata: {
        '/@vocabularies/plone.app.vocabularies.WorkflowStates': {
          loaded: true,
          loading: false,
          data: {
            items: [],
          },
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditDataComponent
            request={{ loaded: true, loading: false, data: { fieldsets: [{ fields: [] }], required: [] } }}
            handleOnDropdownChange={jest.fn()}
            currentContentType={null}
            value={{}}
            fields={[]}
            getDropdownValues={jest.fn()}
            handleUpdateEnforceCharLimits={jest.fn()}
            handleRemoveEnforceCharLimits={jest.fn()}
          />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.queryByText('Enforce character limits')).not.toBeInTheDocument();
  });
});
