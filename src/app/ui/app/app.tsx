import { lazy, Suspense, useState, useCallback } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { ErrorBoundary } from 'react-error-boundary';
import { hot } from 'react-hot-loader/root';
import { Router, Route, Switch } from 'react-router-dom';
import { useGate } from 'effector-react';
import { QueryParamProvider } from 'use-query-params';
import { history, ROUTES, PrivateRoute } from '@/shared/router';
import { Page, Button, Pre, Spinner } from '@/shared/ui';
import * as model from '../../model';
import { Layout } from '../layout';

import './app.css';

const LoginPage = lazy(
  () =>
    import(
      /* webpackChunkName: "login" */
      '@/pages/login'
    ),
);
const RegistrationPage = lazy(
  () =>
    import(
      /* webpackChunkName: "registration" */
      '@/pages/registration'
    ),
);
const HomePage = lazy(
  () =>
    import(
      /* webpackChunkName: "home" */
      '@/pages/home'
    ),
);
const EditorPage = lazy(
  () =>
    import(
      /* webpackChunkName: "editor" */
      '@/pages/editor'
    ),
);
const SettingsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "settings" */
      '@/pages/settings'
    ),
);
const ProfilePage = lazy(
  () =>
    import(
      /* webpackChunkName: "profile" */
      '@/pages/profile'
    ),
);
const ArticlePage = lazy(
  () =>
    import(
      /* webpackChunkName: "article" */
      '@/pages/article'
    ),
);
const NoMatchPage = lazy(
  () =>
    import(
      /* webpackChunkName: "no-match" */
      '@/pages/no-match'
    ),
);

export const App = hot(() => {
  useGate(model.Gate);

  return (
    <Router history={history}>
      <QueryParamProvider ReactRouterRoute={Route}>
        <Layout>
          <Routes />
        </Layout>
      </QueryParamProvider>
    </Router>
  );
});

type RouteType = Readonly<{
  path: string | string[];
  exact?: boolean;
  isPrivate: boolean;
  component: React.ComponentType;
}>;

export const routes: RouteType[] = [
  {
    path: ROUTES.login,
    isPrivate: false,
    component: LoginPage,
  },
  {
    path: ROUTES.registration,
    isPrivate: false,
    component: RegistrationPage,
  },
  {
    path: [ROUTES.root, ROUTES.globalFeed, ROUTES.feedByTag],
    exact: true,
    isPrivate: false,
    component: HomePage,
  },
  {
    path: ROUTES.profile.root,
    isPrivate: false,
    component: ProfilePage,
  },
  {
    path: ROUTES.article,
    isPrivate: false,
    component: ArticlePage,
  },
  {
    path: [ROUTES.editor.root, ROUTES.editor.slug],
    isPrivate: true,
    component: EditorPage,
  },
  {
    path: ROUTES.settings,
    isPrivate: true,
    component: SettingsPage,
  },
  {
    path: '*',
    exact: false,
    isPrivate: false,
    component: NoMatchPage,
  },
];

function Routes() {
  const [state, setState] = useState(false);
  const forceUpdate = useCallback(() => setState((x) => !x), []);

  return (
    <ErrorBoundary
      fallbackRender={ErrorFallback}
      resetKeys={[state]}
      onReset={forceUpdate}
    >
      <Suspense fallback={<Spinner />}>
        <Switch>
          {routes.map((route) =>
            route.isPrivate ? (
              <PrivateRoute
                exact={route.exact}
                key={route.path.toString()}
                path={route.path}
              >
                <route.component />
              </PrivateRoute>
            ) : (
              <Route
                exact={route.exact}
                key={route.path.toString()}
                path={route.path}
              >
                <route.component />
              </Route>
            ),
          )}
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const handleClick = () => {
    resetErrorBoundary();
  };

  return (
    <Page>
      <p>Something went wrong:</p>
      <Pre>{error.message}</Pre>
      <Button onClick={handleClick}>Try again</Button>
    </Page>
  );
}
