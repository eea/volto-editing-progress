import { makeFirstLetterCapital } from './WidgetDataComponent';
import React from 'react';
import { Provider } from 'react-intl-redux';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import VisualJSONWidget from './VisualJSONWidget';
import { backgroundColor } from './WidgetSidebar';
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
    });
    const component = renderer.create(
      <Provider store={store}>
        <MemoryRouter>
          <VisualJSONWidget
            pathname="/test"
            {...propsEmpty}
            hasToolbar={true}
          />
        </MemoryRouter>
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
