import { createEvent, restore } from 'effector';
import { createMemoryHistory, createBrowserHistory, Location } from 'history';

const isBrowser = typeof window !== 'undefined';

export const history = isBrowser
  ? createBrowserHistory()
  : createMemoryHistory();

export const locationUpdated = createEvent<Location>();
export const $location = restore(locationUpdated, history.location);
export const $locationPathname = $location.map((location) => location.pathname);
export const $locationSearch = $location.map((location) => location.search);

history.listen((location) => {
  locationUpdated(location);
});
