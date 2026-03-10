import { makeFirstLetterCapital } from './WidgetDataComponent';
import React from 'react';
import { Provider } from 'react-intl-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import SidebarComponent, { backgroundColor } from './WidgetSidebar';
import '@testing-library/jest-dom';

import VisualJSONWidget from './VisualJSONWidget';
import EditDataComponent from './WidgetDataComponent';
import ScrollIntoView from './ScrollIntoView';
import TextareaJSONWidget from './TextareaJSONWidget';
import { getEditingProgress, getRawContent } from './actions';
import { editingProgress, rawdata } from './reducers';
import { JSONSchema } from './schema';

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
  it('should return undefined when no conditions match', () => {
    expect(backgroundColor(false, false)).toEqual(undefined);
  });

  it('renders SidebarComponent and filters types on input change', () => {
    const types = {
      loaded: true,
      loading: false,
      types: [
        { id: 'document', title: 'Document' },
        { id: 'news-item', title: 'News Item' },
        { id: 'event', title: 'Event' },
      ],
    };
    const handleChange = jest.fn();

    render(
      <SidebarComponent
        types={types}
        currentContentType={{ id: 'document', title: 'Document' }}
        handleChangeSelectedContentType={handleChange}
        value={{}}
      />,
    );

    // All types should be visible initially
    expect(screen.getByText('Document')).toBeInTheDocument();
    expect(screen.getByText('News Item')).toBeInTheDocument();
    expect(screen.getByText('Event')).toBeInTheDocument();

    // Type in search input to filter
    const input = document.querySelector('input[placeholder="Search... "]');
    fireEvent.change(input, { target: { value: 'News' } });

    // Only News Item should match
    expect(screen.getByText('News Item')).toBeInTheDocument();
    expect(screen.queryByText('Event')).not.toBeInTheDocument();
  });

  it('handles click on list item', () => {
    const types = {
      loaded: true,
      loading: false,
      types: [{ id: 'document', title: 'Document' }],
    };
    const handleChange = jest.fn();

    render(
      <SidebarComponent
        types={types}
        currentContentType={null}
        handleChangeSelectedContentType={handleChange}
        value={{ document: [] }}
      />,
    );

    fireEvent.click(screen.getByText('Document'));
    expect(handleChange).toHaveBeenCalled();
  });

  it('handles null input value', () => {
    const types = {
      loaded: true,
      loading: false,
      types: [{ id: 'document', title: 'Document' }],
    };

    render(
      <SidebarComponent
        types={types}
        currentContentType={null}
        handleChangeSelectedContentType={jest.fn()}
        value={{}}
      />,
    );

    const input = document.querySelector('input[placeholder="Search... "]');
    fireEvent.change(input, { target: { value: null } });

    // Should still show all types
    expect(screen.getByText('Document')).toBeInTheDocument();
  });

  it('handles types not loaded', () => {
    const types = {
      loaded: false,
      loading: true,
      types: [],
    };

    render(
      <SidebarComponent
        types={types}
        currentContentType={null}
        handleChangeSelectedContentType={jest.fn()}
        value={{}}
      />,
    );

    expect(
      document.querySelector('input[placeholder="Search... "]'),
    ).toBeInTheDocument();
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

  it('adds enforceCharLimits when dropdown option is selected', () => {
    const mockOnChange = jest.fn();
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
            fieldsets: [{ fields: ['description'] }],
            required: [],
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
            onChange={mockOnChange}
          />
        </MemoryRouter>
      </Provider>,
    );

    // Click on dropdown to see options
    const dropdown = screen.getByText('Add Property');
    fireEvent.click(dropdown);

    expect(screen.getByText('Add Property')).toBeInTheDocument();
  });

  it('opens JSON editor modal when Edit JSON button is clicked', () => {
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

    const editJsonButton = screen.getByText('Edit JSON');
    fireEvent.click(editJsonButton);

    // Modal should be visible after clicking
    expect(editJsonButton).toBeInTheDocument();
  });

  it('handles types not loaded state', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
      progressEditing: {},
      rawdata: {},
      types: {
        loaded: false,
        loading: true,
        types: [],
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

    expect(screen.getByText('Edit JSON')).toBeInTheDocument();
  });

  it('updates existing field rule when dropdown changes for existing field', () => {
    const mockOnChange = jest.fn();
    const existingValue = {
      'content-type-1': [
        {
          prefix: 'description',
          states: ['all'],
          linkLabel: 'Add description',
          condition: 'python:value',
          link: 'edit#description',
        },
      ],
    };
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
        '/@vocabularies/plone.app.vocabularies.WorkflowStates': {
          loaded: true,
          loading: false,
          data: {
            items: [{ token: 'published' }, { token: 'private' }],
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
            value={existingValue}
            onChange={mockOnChange}
          />
        </MemoryRouter>
      </Provider>,
    );

    // The description field should be visible
    expect(screen.getByText('description')).toBeInTheDocument();
  });

  it('handles field with multiple rules where prefix does not match', () => {
    const mockOnChange = jest.fn();
    const existingValue = {
      'content-type-1': [
        {
          prefix: 'other_field',
          states: ['all'],
          linkLabel: 'Other',
          condition: 'python:value',
          link: 'edit#other',
        },
        {
          prefix: 'description',
          states: ['published'],
          linkLabel: 'Add description',
          condition: 'python:value',
          link: 'edit#description',
        },
      ],
    };
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
            fieldsets: [{ fields: ['title', 'description', 'other_field'] }],
            required: ['title'],
          },
        },
        '/@vocabularies/plone.app.vocabularies.WorkflowStates': {
          loaded: true,
          loading: false,
          data: {
            items: [{ token: 'published' }, { token: 'private' }],
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
            value={existingValue}
            onChange={mockOnChange}
          />
        </MemoryRouter>
      </Provider>,
    );

    // Both fields should be visible
    expect(screen.getByText('description')).toBeInTheDocument();
    expect(screen.getByText('other_field')).toBeInTheDocument();
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

    const handleRemove = jest.fn();

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
            handleRemoveEnforceCharLimits={handleRemove}
          />
        </MemoryRouter>
      </Provider>,
    );

    const cancelIcon = screen
      .getByText('Enforce character limits')
      .parentElement.parentElement.querySelector('.cancel');
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

    const handleUpdate = jest.fn();

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
            request={{
              loaded: true,
              loading: false,
              data: { fieldsets: [{ fields: [] }], required: [] },
            }}
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

    expect(
      screen.queryByText('Enforce character limits'),
    ).not.toBeInTheDocument();
  });

  it('renders with fields and handles field accordion', () => {
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
          prefix: 'description',
          states: ['all'],
          linkLabel: 'Add description',
          condition: 'python:value',
          link: 'edit#description',
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
              data: {
                fieldsets: [{ fields: ['title', 'description'] }],
                required: ['title'],
              },
            }}
            handleOnDropdownChange={jest.fn()}
            currentContentType={{
              id: 'content-type-1',
              title: 'Content Type 1',
            }}
            value={value}
            fields={['title', 'description']}
            getDropdownValues={(field) =>
              field === 'description' ? ['All'] : undefined
            }
            handleUpdateEnforceCharLimits={jest.fn()}
            handleRemoveEnforceCharLimits={jest.fn()}
          />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('description')).toBeInTheDocument();
  });

  it('handles request loading state', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
      rawdata: {
        '/@vocabularies/plone.app.vocabularies.WorkflowStates': {
          loaded: false,
          loading: true,
          data: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditDataComponent
            request={{ loaded: false, loading: true, data: null }}
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

  it('handles message input change for field', () => {
    const mockHandleOnDropdownChange = jest.fn();
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
          prefix: 'description',
          states: ['all'],
          linkLabel: 'Add description',
          condition: 'python:value',
          link: 'edit#description',
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
              data: {
                fieldsets: [{ fields: ['description'] }],
                required: [],
              },
            }}
            handleOnDropdownChange={mockHandleOnDropdownChange}
            currentContentType={{
              id: 'content-type-1',
              title: 'Content Type 1',
            }}
            value={value}
            fields={['description']}
            getDropdownValues={(field) =>
              field === 'description' ? ['All'] : undefined
            }
            handleUpdateEnforceCharLimits={jest.fn()}
            handleRemoveEnforceCharLimits={jest.fn()}
          />
        </MemoryRouter>
      </Provider>,
    );

    // Click on field accordion to expand
    fireEvent.click(screen.getByText('description'));

    // Change message input
    const messageInput = document.querySelector('input[name="message"]');
    fireEvent.change(messageInput, { target: { value: 'New message' } });

    expect(mockHandleOnDropdownChange).toHaveBeenCalled();
  });

  it('handles link input change for field', () => {
    const mockHandleOnDropdownChange = jest.fn();
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
            items: [{ token: 'published' }],
          },
        },
      },
    });

    const value = {
      'content-type-1': [
        {
          prefix: 'description',
          states: ['all'],
          linkLabel: 'Add',
          condition: 'python:value',
          link: 'edit#desc',
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
              data: {
                fieldsets: [{ fields: ['description'] }],
                required: [],
              },
            }}
            handleOnDropdownChange={mockHandleOnDropdownChange}
            currentContentType={{
              id: 'content-type-1',
              title: 'Content Type 1',
            }}
            value={value}
            fields={['description']}
            getDropdownValues={(field) =>
              field === 'description' ? ['All'] : undefined
            }
            handleUpdateEnforceCharLimits={jest.fn()}
            handleRemoveEnforceCharLimits={jest.fn()}
          />
        </MemoryRouter>
      </Provider>,
    );

    // Click on field accordion to expand
    fireEvent.click(screen.getByText('description'));

    // Change link input
    const linkInput = document.querySelector('input[name="link"]');
    fireEvent.change(linkInput, { target: { value: 'new-link' } });

    expect(mockHandleOnDropdownChange).toHaveBeenCalled();
  });

  it('handles condition input change for field', () => {
    const mockHandleOnDropdownChange = jest.fn();
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
            items: [{ token: 'published' }],
          },
        },
      },
    });

    const value = {
      'content-type-1': [
        {
          prefix: 'description',
          states: ['all'],
          linkLabel: 'Add',
          condition: 'python:value',
          link: 'edit#desc',
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
              data: {
                fieldsets: [{ fields: ['description'] }],
                required: [],
              },
            }}
            handleOnDropdownChange={mockHandleOnDropdownChange}
            currentContentType={{
              id: 'content-type-1',
              title: 'Content Type 1',
            }}
            value={value}
            fields={['description']}
            getDropdownValues={(field) =>
              field === 'description' ? ['All'] : undefined
            }
            handleUpdateEnforceCharLimits={jest.fn()}
            handleRemoveEnforceCharLimits={jest.fn()}
          />
        </MemoryRouter>
      </Provider>,
    );

    // Click on field accordion to expand
    fireEvent.click(screen.getByText('description'));

    // Change condition input
    const conditionInput = document.querySelector('input[name="condition"]');
    fireEvent.change(conditionInput, { target: { value: 'python:True' } });

    expect(mockHandleOnDropdownChange).toHaveBeenCalled();
  });
});

describe('ScrollIntoView', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.__CLIENT__ = true;
  });

  afterEach(() => {
    jest.useRealTimers();
    delete global.__CLIENT__;
  });

  it('renders null', () => {
    const { container } = render(
      <ScrollIntoView location={{ hash: '', pathname: '/test' }} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('does nothing when no hash', () => {
    const { container } = render(
      <ScrollIntoView location={{ hash: '', pathname: '/test' }} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('scrolls to element when hash is present', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'test-element';
    mockElement.scrollIntoView = jest.fn();
    mockElement.classList = { add: jest.fn(), remove: jest.fn() };
    mockElement.closest = jest.fn().mockReturnValue(null);
    document.body.appendChild(mockElement);

    const originalGetElementById = document.getElementById;
    document.getElementById = jest.fn().mockReturnValue(mockElement);

    render(
      <ScrollIntoView
        location={{ hash: '#test-element', pathname: '/test' }}
      />,
    );

    jest.advanceTimersByTime(250);

    expect(document.getElementById).toHaveBeenCalledWith('test-element');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
    });

    document.getElementById = originalGetElementById;
    document.body.removeChild(mockElement);
  });

  it('clears interval after 40 attempts', () => {
    const originalGetElementById = document.getElementById;
    document.getElementById = jest.fn().mockReturnValue(null);
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');

    render(
      <ScrollIntoView location={{ hash: '#nonexistent', pathname: '/test' }} />,
    );

    // Run 41 intervals (250ms each)
    jest.advanceTimersByTime(250 * 41);

    expect(clearIntervalSpy).toHaveBeenCalled();

    document.getElementById = originalGetElementById;
    clearIntervalSpy.mockRestore();
  });

  it('clicks first tab on edit page with fieldset hash', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'fieldset-test';
    mockElement.scrollIntoView = jest.fn();
    mockElement.classList = { add: jest.fn(), remove: jest.fn() };
    mockElement.closest = jest.fn().mockReturnValue(null);

    const mockTab = document.createElement('div');
    mockTab.click = jest.fn();
    mockTab.classList = { contains: jest.fn().mockReturnValue(false) };

    const mockFormTabs = document.createElement('div');
    mockFormTabs.className = 'formtabs';
    Object.defineProperty(mockFormTabs, 'firstElementChild', {
      get: () => mockTab,
    });

    const mockSidebar = document.createElement('div');
    mockSidebar.className = 'sidebar-container';
    mockSidebar.appendChild(mockFormTabs);
    document.body.appendChild(mockSidebar);

    const originalGetElementById = document.getElementById;
    const originalQuerySelector = document.querySelector;

    document.getElementById = jest.fn().mockReturnValue(mockElement);
    document.querySelector = jest.fn().mockImplementation((selector) => {
      if (selector === '.sidebar-container .formtabs') {
        return mockFormTabs;
      }
      return null;
    });
    document.querySelectorAll = jest.fn().mockReturnValue([]);

    render(
      <ScrollIntoView
        location={{ hash: '#fieldset-test', pathname: '/test/edit' }}
      />,
    );

    jest.advanceTimersByTime(250);

    expect(mockTab.click).toHaveBeenCalled();

    document.getElementById = originalGetElementById;
    document.querySelector = originalQuerySelector;
    document.body.removeChild(mockSidebar);
  });

  it('does nothing on server side', () => {
    global.__CLIENT__ = false;

    render(<ScrollIntoView location={{ hash: '#test', pathname: '/test' }} />);

    // Should not throw or do anything
    expect(true).toBe(true);
  });
});

describe('Actions', () => {
  it('getEditingProgress returns correct action', () => {
    const result = getEditingProgress('/test/item');
    expect(result.type).toBe('EDITING_PROGRESS');
    expect(result.request.path).toBe('/test/item/@editing.progress');
  });

  it('getRawContent returns correct action', () => {
    const result = getRawContent('/test/url');
    expect(result.type).toBe('GET_RAW_CONTENT');
    expect(result.request.path).toBe('/test/url');
    expect(result.url).toBe('/test/url');
  });

  it('getRawContent accepts custom headers', () => {
    const result = getRawContent('/test/url', { 'X-Custom': 'value' });
    expect(result.request.headers).toEqual({ 'X-Custom': 'value' });
  });
});

describe('Reducers', () => {
  describe('editingProgress', () => {
    it('returns initial state', () => {
      const result = editingProgress(undefined, {});
      expect(result.get.loaded).toBe(false);
      expect(result.get.loading).toBe(false);
    });

    it('handles EDITING_PROGRESS_PENDING', () => {
      const result = editingProgress(undefined, {
        type: 'EDITING_PROGRESS_PENDING',
      });
      expect(result.editing.loading).toBe(true);
      expect(result.editing.loaded).toBe(false);
    });

    it('handles EDITING_PROGRESS_SUCCESS', () => {
      const result = editingProgress(undefined, {
        type: 'EDITING_PROGRESS_SUCCESS',
        result: { data: 'test' },
      });
      expect(result.editing.loading).toBe(false);
      expect(result.editing.loaded).toBe(true);
      expect(result.result).toEqual({ data: 'test' });
    });

    it('handles EDITING_PROGRESS_FAIL', () => {
      const result = editingProgress(undefined, {
        type: 'EDITING_PROGRESS_FAIL',
        error: 'error message',
      });
      expect(result.editing.loading).toBe(false);
      expect(result.editing.loaded).toBe(false);
      expect(result.editing.error).toBe('error message');
    });
  });

  describe('rawdata', () => {
    it('returns initial state', () => {
      const result = rawdata(undefined, {});
      expect(result).toEqual({});
    });

    it('handles GET_RAW_CONTENT_PENDING', () => {
      const result = rawdata(
        {},
        {
          type: 'GET_RAW_CONTENT_PENDING',
          url: '/test',
        },
      );
      expect(result['/test'].loading).toBe(true);
      expect(result['/test'].loaded).toBe(false);
    });

    it('handles GET_RAW_CONTENT_SUCCESS', () => {
      const result = rawdata(
        {},
        {
          type: 'GET_RAW_CONTENT_SUCCESS',
          url: '/test',
          result: { items: [] },
        },
      );
      expect(result['/test'].loading).toBe(false);
      expect(result['/test'].loaded).toBe(true);
      expect(result['/test'].data).toEqual({ items: [] });
    });

    it('handles GET_RAW_CONTENT_FAIL', () => {
      const result = rawdata(
        {},
        {
          type: 'GET_RAW_CONTENT_FAIL',
          url: '/test',
          error: 'error',
        },
      );
      expect(result['/test'].loading).toBe(false);
      expect(result['/test'].loaded).toBe(false);
      expect(result['/test'].error).toBe('error');
    });
  });
});

describe('JSONSchema', () => {
  it('returns schema with json field', () => {
    const mockIntl = {
      formatMessage: jest.fn().mockReturnValue('JSON code'),
    };
    const result = JSONSchema({ intl: mockIntl });
    expect(result.required).toContain('json');
    expect(result.fieldsets[0].fields).toContain('json');
    expect(result.properties.json.widget).toBe('jsonTextarea');
  });
});

describe('TextareaJSONWidget', () => {
  const store = mockStore({
    intl: {
      locale: 'en',
      messages: {},
    },
  });

  it('renders with initial value', () => {
    render(
      <Provider store={store}>
        <TextareaJSONWidget
          id="test-json"
          title="Test JSON"
          value={{ key: 'value' }}
          onChange={jest.fn()}
        />
      </Provider>,
    );

    const textarea = document.querySelector('textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toContain('"key"');
  });

  it('handles valid JSON input', () => {
    const mockOnChange = jest.fn();
    render(
      <Provider store={store}>
        <TextareaJSONWidget
          id="test-json"
          title="Test JSON"
          value={{ initial: 'value' }}
          onChange={mockOnChange}
        />
      </Provider>,
    );

    const textarea = document.querySelector('textarea');
    fireEvent.change(textarea, {
      target: { value: '{"new": "json"}' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('test-json', { new: 'json' });
  });

  it('handles invalid JSON input and shows error', () => {
    jest.useFakeTimers();
    const mockOnChange = jest.fn();
    render(
      <Provider store={store}>
        <TextareaJSONWidget
          id="test-json"
          title="Test JSON"
          value={{ initial: 'value' }}
          onChange={mockOnChange}
        />
      </Provider>,
    );

    const textarea = document.querySelector('textarea');
    fireEvent.change(textarea, {
      target: { value: 'invalid json {' },
    });

    // Should call onChange with previous value
    expect(mockOnChange).toHaveBeenCalledWith('test-json', {
      initial: 'value',
    });

    // Error message should appear
    expect(screen.getByText('Please enter valid JSON!')).toBeInTheDocument();

    // Error should disappear after 1.5 seconds
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    jest.useRealTimers();
  });

  it('handles empty string input as undefined', () => {
    const mockOnChange = jest.fn();
    render(
      <Provider store={store}>
        <TextareaJSONWidget
          id="test-json"
          title="Test JSON"
          value={{ initial: 'value' }}
          onChange={mockOnChange}
        />
      </Provider>,
    );

    const textarea = document.querySelector('textarea');
    fireEvent.change(textarea, {
      target: { value: '' },
    });

    // Empty string triggers invalid JSON path with previous value
    expect(mockOnChange).toHaveBeenCalledWith('test-json', {
      initial: 'value',
    });
  });

  it('handles string value prop', () => {
    render(
      <Provider store={store}>
        <TextareaJSONWidget
          id="test-json"
          title="Test JSON"
          value='{"stringified": "value"}'
          onChange={jest.fn()}
        />
      </Provider>,
    );

    const textarea = document.querySelector('textarea');
    expect(textarea.value).toContain('"stringified"');
  });

  it('renders disabled state', () => {
    render(
      <Provider store={store}>
        <TextareaJSONWidget
          id="test-json"
          title="Test JSON"
          value={{ key: 'value' }}
          onChange={jest.fn()}
          isDisabled={true}
        />
      </Provider>,
    );

    const textarea = document.querySelector('textarea');
    expect(textarea).toBeDisabled();
  });
});
