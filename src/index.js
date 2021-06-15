import EditingProgress from './EditingProgress';
import ScrollIntoView from './ScrollIntoView';
import { editingProgress } from './reducers';

const applyConfig = (config) => {
  config.addonReducers = {
    ...config.addonReducers,
    editingProgress,
  };

  const appExtras = config.settings.appExtras || [];

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
