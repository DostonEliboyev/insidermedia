import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const categories = ['uzbekistan', 'education', 'finance', 'auto', 'world'];

const Layout = ({ children }) => {
  const { t } = useLanguage();

  const categoryLabels = {
    uzbekistan: t('uzbekistan'),
    education: t('education'),
    finance: t('finance'),
    auto: t('auto'),
    world: t('world'),
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-1.5 group">
              <span className="text-xl md:text-2xl font-bold tracking-tight">
                <span className="text-red-600">INSIDER</span>
                <span className="text-gray-800"> MEDIA</span>
              </span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/category/${category}`}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {categoryLabels[category]}
                </Link>
              ))}
            </nav>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
            </div>
          </div>
          
          {/* Mobile Menu */}
          <nav className="md:hidden mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${category}`}
                className="text-sm text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
              >
                {categoryLabels[category]}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content - flex-grow to push footer down */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>

      {/* Footer - always at bottom */}
      <footer className="bg-gray-800 text-white mt-auto py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 News Website. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
