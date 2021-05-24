import React, { useEffect, useContext } from 'react';
import { NextPage } from 'next';
import { Helmet } from 'react-helmet';
import { GlobalContext } from '@/context/global';
import { PageProvider } from '@/providers/page';
import { Opacity } from '@/components/Animation/Opacity';
import { ImageViewer } from '@/components/ImageViewer';
import { Comment } from '@/components/Comment';
import { MarkdownReader } from '@/components/MarkdownReader';
import style from './index.module.scss';
import { ArticleRecommend } from '@/components/ArticleRecommend';

interface IProps {
  page: IPage;
}

const Page: NextPage<IProps> = ({ page }) => {
  const { setting } = useContext(GlobalContext);

  useEffect(() => {
    PageProvider.updatePageViews(page.id);
  }, [page.id]);

  return (
    <>
      {!page ? (
        <div className="container">
          <p>页面不存在</p>
        </div>
      ) : (
        <ImageViewer containerSelector="#js-page-wrapper">
          <div id="js-page-wrapper" className={style.container}>
            <Helmet>
              <title>{page.name + ' | ' + setting.systemTitle}</title>
            </Helmet>
            <div className="container">
              {page.cover && (
                <div className={style.coverWrapper}>
                  <img src={page.cover} alt="文章封面" />
                </div>
              )}
              <div className={style.content}>
                <MarkdownReader content={page.html} />
              </div>
            </div>
            <div className={style.commentAndArticleWrapper}>
              <div className={style.comments}>
                <Opacity key={page.id}>
                  <p className={style.title}>评论</p>
                </Opacity>
                <div className={style.commentContainer}>
                  <Comment key={page.id} hostId={page.id} />
                </div>
              </div>
              <div className={style.recmmendArticles}>
                <Opacity key={page.id}>
                  <p className={style.title}>推荐阅读</p>
                </Opacity>
                <div className={style.articleContainer}>
                  <ArticleRecommend articleId={null} needTitle={false} />
                </div>
              </div>
            </div>
          </div>
        </ImageViewer>
      )}
    </>
  );
};

Page.getInitialProps = async (ctx) => {
  const { id } = ctx.query;
  const page = await PageProvider.getPage(id);
  return { page };
};

export default Page;
