import EditingProgress from './EditingProgress';
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
  ];

  return config;
};

export default applyConfig;
