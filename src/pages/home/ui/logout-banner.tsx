import * as visitor from '@/entities/visitor';
import { APP_NAME } from '@/shared/config';
import { Banner, Container } from '@/shared/ui';

export const LogoutBanner = () => {
  const isAuth = visitor.selectors.useIsAuthorized();

  return isAuth ? null : (
    <Banner>
      <Container>
        <h1 className="logo-font">{APP_NAME.toLowerCase()}</h1>
        <p>性能优化不等于体验优化</p>
      </Container>
    </Banner>
  );
};
