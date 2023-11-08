import * as article from '@/entities/article';
import * as http from '@/shared/http';

export const getArticle = (slug: string) => {
  // eslint-disable-next-line no-console
  console.log(`getArticle slug=${slug}`);

  return http
    .request<{ article: article.types.Article }>({
      url: `articles/${slug}`,
      method: 'get',
    })
    .then((response) => {
      // eslint-disable-next-line no-console
      console.log(`getArticle response.article=${response.article}`);

      return response.article;
    })
    .then(({ createdAt, ...rest }) => ({
      ...rest,
      createdAt: new Date(createdAt).toDateString(),
    }))
    .catch((err) => {
      console.error(`getArticle ERROR:${err}`);
    });
};

export const deleteArticle = (slug: string) => {
  return http.request({ url: `articles/${slug}`, method: 'delete' });
};
