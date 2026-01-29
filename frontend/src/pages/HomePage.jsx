import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchNews } from '../store/slices/newsSlice';
import { useLanguage } from '../contexts/LanguageContext';
import NewsCard from '../components/NewsCard';
import { NewsGridSkeleton } from '../components/LoadingSkeleton';

const HomePage = () => {
  const dispatch = useDispatch();
  const { news, pagination, loading, error } = useSelector((state) => state.news);
  const { language, t } = useLanguage();
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchNews({ page, limit: 12, language }));
  }, [dispatch, page, language]);

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
        <title>{t('latestNews')} - News Website</title>
        <meta name="description" content="Stay updated with the latest news from around the world" />
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold mb-8">{t('latestNews')}</h1>

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

export default HomePage;
