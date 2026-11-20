import EditingProgress from './EditingProgress';
import ScrollIntoView from './ScrollIntoView';
import { editingProgress, rawdata } from './reducers';
import TextareaJSONWidget from './TextareaJSONWidget';
import VisualJSONWidget from './VisualJSONWidget';
const applyConfig = (config) => {
  config.addonReducers = {
    ...config.addonReducers,
    editingProgress,
    rawdata,
  };

  const appExtras = config.settings.appExtras || [];

  config.widgets.widget.jsonTextarea = TextareaJSONWidget;
  config.widgets.id.progress = VisualJSONWidget;
  config.settings.appExtras = [
    ...appExtras,
    {
      match: '',
      component: EditingProgress,
    },
    {
      match: '',
      component: ScrollIntoView,
    },
  ];

  return config;
};

export default applyConfig;
