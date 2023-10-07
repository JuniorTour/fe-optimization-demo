// import Markdown from 'markdown-to-jsx';
import { Row } from '@/shared/ui';
import { selectors } from '../model';
import { Tags } from './tags';

let Markdown = null;
let startLoad = false;

function lazyLoadMarkdownToJSX() {
  if (startLoad) {
    return;
  }
  startLoad = true;
  import(
    /* webpackChunkName: "markdown-to-jsx" */
    'markdown-to-jsx'
  )
    .then((module) => {
      Markdown = module.default;
    })
    .catch((err) => {
      console.error(err);
    });
}

export const Content = () => {
  lazyLoadMarkdownToJSX();
  if (!Markdown) {
    return null;
  }
  const { body } = selectors.useArticle();

  return (
    <Row className="article-content">
      <div className="col-xs-12">
        <Markdown>{body}</Markdown>

        <Tags />
      </div>
    </Row>
  );
};
