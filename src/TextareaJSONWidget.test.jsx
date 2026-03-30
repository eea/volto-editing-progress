import React from 'react';
import { IntlProvider } from 'react-intl';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import TextareaJSONWidget from './TextareaJSONWidget';

const renderWidget = (props = {}) => {
  const onChange = jest.fn();
  render(
    <IntlProvider locale="en" messages={{}}>
      <TextareaJSONWidget
        id="json"
        title="JSON"
        onChange={onChange}
        value={{ title: 'Hello' }}
        {...props}
      />
    </IntlProvider>,
  );
  return { onChange };
};

describe('TextareaJSONWidget', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('parses string value and renders pretty json', () => {
    renderWidget({ value: '{"title":"Hello"}' });
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('{\n  "title": "Hello"\n}');
  });

  it('sends parsed json object on valid change', () => {
    const { onChange } = renderWidget();
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '{"title":"Updated"}' } });

    expect(onChange).toHaveBeenLastCalledWith('json', { title: 'Updated' });
  });

  it('keeps previous value and shows error on invalid json', () => {
    const { onChange } = renderWidget({ value: { title: 'Initial' } });
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '{"title":' } });

    expect(onChange).toHaveBeenLastCalledWith('json', { title: 'Initial' });
    expect(screen.getByText('Please enter valid JSON!')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1600);
    });
    expect(
      screen.queryByText('Please enter valid JSON!'),
    ).not.toBeInTheDocument();
  });

  it('treats empty input as invalid and restores previous object', () => {
    const { onChange } = renderWidget({ value: { title: 'Initial' } });
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '' } });

    expect(onChange).toHaveBeenLastCalledWith('json', { title: 'Initial' });
  });
});
