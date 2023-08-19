import { createEvent, restore } from 'effector';
import { createBrowserHistory, Location } from 'history';

// http://localhost:4100/home/
export const history = createBrowserHistory({
  basename: '/home',
});

export const locationUpdated = createEvent<Location>();
export const $location = restore(locationUpdated, history.location);
export const $locationPathname = $location.map((location) => location.pathname);
export const $locationSearch = $location.map((location) => location.search);

history.listen((location) => {
  locationUpdated(location);
});
