import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchNewsByCategory } from '../store/slices/newsSlice';
import { useLanguage } from '../contexts/LanguageContext';
import NewsCard from '../components/NewsCard';
import { NewsGridSkeleton } from '../components/LoadingSkeleton';

const CategoryPage = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const { news, pagination, loading, error } = useSelector((state) => state.news);
  const { language, t } = useLanguage();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    dispatch(fetchNewsByCategory({ category, page: 1, limit: 12, language }));
  }, [dispatch, category, language]);

  useEffect(() => {
    dispatch(fetchNewsByCategory({ category, page, limit: 12, language }));
  }, [dispatch, category, page, language]);

  const handleNextPage = () => {
    if (page < pagination.pages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const categoryLabels = {
    uzbekistan: t('uzbekistan'),
    education: t('education'),
    finance: t('finance'),
    auto: t('auto'),
    world: t('world'),
  };

  const categoryTitle = categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading news: {error}</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{categoryTitle} - News Website</title>
        <meta name="description" content={`Latest ${categoryTitle} news and updates`} />
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold mb-8">{categoryTitle}</h1>

        {loading && page === 1 ? (
          <NewsGridSkeleton />
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">{t('noNews')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center space-x-4 mt-8">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('previous') || 'Previous'}
                </button>
                <span className="text-gray-600">
                  {t('page') || 'Page'} {page} {t('of') || 'of'} {pagination.pages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page === pagination.pages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('next') || 'Next'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CategoryPage;
