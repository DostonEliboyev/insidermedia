import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchNewsBySlug, clearCurrentNews } from '../store/slices/newsSlice';
import { useLanguage } from '../contexts/LanguageContext';
import { format } from 'date-fns';
import { sanitizeHTML } from '../utils/sanitize';

const NewsDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentNews, loading, error } = useSelector((state) => state.news);
  const { t } = useLanguage();

  useEffect(() => {
    dispatch(fetchNewsBySlug(slug));
    return () => {
      dispatch(clearCurrentNews());
    };
  }, [dispatch, slug]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="skeleton h-8 w-3/4 mb-4"></div>
        <div className="skeleton h-64 w-full mb-6"></div>
        <div className="skeleton h-4 w-full mb-2"></div>
        <div className="skeleton h-4 w-full mb-2"></div>
        <div className="skeleton h-4 w-2/3"></div>
      </div>
    );
  }

  if (error || !currentNews) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">News article not found.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{currentNews.title} - News Website</title>
        <meta name="description" content={currentNews.short_description} />
        <meta property="og:title" content={currentNews.title} />
        <meta property="og:description" content={currentNews.short_description} />
        {currentNews.image_url && (
          <meta property="og:image" content={`http://localhost:5000${currentNews.image_url}`} />
        )}
      </Helmet>

      <article className="max-w-4xl mx-auto">
        <div className="mb-4">
          <span className="text-sm text-blue-600 font-semibold uppercase">
            {currentNews.category}
          </span>
          <span className="text-sm text-gray-500 ml-4">
            {formatDate(currentNews.created_at)}
          </span>
        </div>

        <h1 className="text-4xl font-bold mb-4">{currentNews.title}</h1>

        {currentNews.image_url && (
          <div className="w-full h-96 overflow-hidden rounded-lg mb-6">
            <img
              src={`http://localhost:5000${currentNews.image_url}`}
              alt={currentNews.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <p className="text-xl text-gray-700 mb-6 font-medium">
          {currentNews.short_description}
        </p>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(currentNews.content) }}
        />
      </article>
    </>
  );
};

export default NewsDetailPage;
