import { Switch, Route } from 'react-router-dom';
import * as visitor from '@/entities/visitor';
import { ROUTES } from '@/shared/router';
import FeedByTagPage from './pages/feed-by-tag';
import GlobalFeedPage from './pages/global-feed';
import YourFeedPage from './pages/your-feed';
import { Layout } from './ui/layout';

const HomePage = () => {
  const isAuth = visitor.selectors.useIsAuthorized();

  return (
    <Layout>
      <Switch>
        <Route exact path={ROUTES.root}>
          {isAuth ? <YourFeedPage /> : <GlobalFeedPage />}
        </Route>

        <Route path={ROUTES.globalFeed}>
          <GlobalFeedPage />
        </Route>
        <Route path={ROUTES.feedByTag}>
          <FeedByTagPage />
        </Route>
      </Switch>
    </Layout>
  );
};

export default HomePage;
