import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const NewsCard = ({ news }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <Link to={`/news/${news.slug}`} className="card hover:shadow-lg transition-shadow duration-200">
      {news.image_url && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={`http://localhost:5000${news.image_url}`}
            alt={news.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <span className="text-xs text-blue-600 font-semibold uppercase">
          {news.category}
        </span>
        <h3 className="text-xl font-bold mt-2 mb-2 line-clamp-2">
          {news.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {news.short_description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatDate(news.created_at)}</span>
          <span className="text-blue-600 hover:underline">Read more →</span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
