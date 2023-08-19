import { Switch, Route } from 'react-router-dom';
import { useGate } from 'effector-react';
import { ROUTES } from '@/shared/router';
import * as model from './model';
import FavoritedArticlesPage from './pages/favorited-articles';
import MyArticlesPage from './pages/my-articles';
import { Layout } from './ui/layout';

const ProfilePage = () => {
  useGate(model.Gate);

  return (
    <Layout>
      <Switch>
        <Route exact path={ROUTES.profile.root}>
          <MyArticlesPage />
        </Route>
        <Route path={ROUTES.profile.favorites}>
          <FavoritedArticlesPage />
        </Route>
      </Switch>
    </Layout>
  );
};

export default ProfilePage;
