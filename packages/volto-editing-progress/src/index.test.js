import applyConfig from './index';
import EditingProgress from './EditingProgress';
import ScrollIntoView from './ScrollIntoView';
import TextareaJSONWidget from './TextareaJSONWidget';
import VisualJSONWidget from './VisualJSONWidget';
import { editingProgress, rawdata } from './reducers';

describe('addon applyConfig', () => {
  it('registers reducers, widgets and appExtras', () => {
    const existingExtra = { match: '/foo', component: () => null };
    const config = {
      addonReducers: { existing: () => ({}) },
      widgets: { widget: {}, id: {} },
      settings: { appExtras: [existingExtra] },
    };

    const result = applyConfig(config);

    expect(result.addonReducers.editingProgress).toBe(editingProgress);
    expect(result.addonReducers.rawdata).toBe(rawdata);
    expect(result.widgets.widget.jsonTextarea).toBe(TextareaJSONWidget);
    expect(result.widgets.id.progress).toBe(VisualJSONWidget);
    expect(result.settings.appExtras).toEqual([
      existingExtra,
      { match: '', component: EditingProgress },
      { match: '', component: ScrollIntoView },
    ]);
  });
});
