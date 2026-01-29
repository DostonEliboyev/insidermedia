import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchNews, createNews, updateNews, deleteNews } from '../store/slices/newsSlice';
import { logout } from '../store/slices/authSlice';
import { useLanguage } from '../contexts/LanguageContext';
import NewsCard from '../components/NewsCard';
import { NewsGridSkeleton } from '../components/LoadingSkeleton';

const categories = ['uzbekistan', 'education', 'finance', 'auto', 'world'];
const languages = [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
  { code: 'uz', name: "O'zbek" },
];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { news, loading } = useSelector((state) => state.news);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { language, t } = useLanguage();

  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    content: '',
    category: 'uzbekistan',
    language: language,
    image: null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    dispatch(fetchNews({ page: 1, limit: 50, language }));
  }, [dispatch, navigate, isAuthenticated, language]);
  
  // Update form language when language changes
  useEffect(() => {
    if (!editingNews) {
      setFormData(prev => ({ ...prev, language: language }));
    }
  }, [language, editingNews]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleContentChange = (value) => {
    // React Quill returns HTML string - ensure it's properly stored
    setFormData({ ...formData, content: value || '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Debug: Log form data before submission
    console.log('Submitting form data:', {
      title: formData.title,
      short_description: formData.short_description?.substring(0, 50),
      content: formData.content ? `${formData.content.substring(0, 100)}...` : 'EMPTY',
      contentLength: formData.content?.length || 0,
      category: formData.category,
      hasImage: !!formData.image
    });
    
    // Validate content is not empty
    const trimmedContent = formData.content?.replace(/<[^>]*>/g, '').trim();
    if (!formData.content || trimmedContent === '' || formData.content === '<p><br></p>' || formData.content === '<p></p>') {
      alert(t('content') + ' ' + t('required'));
      return;
    }
    
    try {
      if (editingNews) {
        await dispatch(updateNews({ id: editingNews.id, ...formData })).unwrap();
      } else {
        await dispatch(createNews(formData)).unwrap();
      }
      resetForm();
      dispatch(fetchNews({ page: 1, limit: 50 }));
    } catch (error) {
      console.error('Error saving news:', error);
      const errorMessage = error?.error || error?.message || 'Failed to save news. Please check the console for details.';
      alert(errorMessage);
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      short_description: newsItem.short_description,
      content: newsItem.content,
      category: newsItem.category.toLowerCase(),
      language: newsItem.language || 'en',
      image: null,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news?')) {
      try {
        await dispatch(deleteNews(id)).unwrap();
        dispatch(fetchNews({ page: 1, limit: 50 }));
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      short_description: '',
      content: '',
      category: 'uzbekistan',
      language: language,
      image: null,
    });
    setEditingNews(null);
    setShowForm(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  return (
    <>
      <Helmet>
        <title>{t('dashboard')} - News Website</title>
      </Helmet>

      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary"
            >
              {showForm ? t('cancel') : t('createNews')}
            </button>
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              {t('logout')}
            </button>
          </div>
        </div>

        {/* News Form */}
        {showForm && (
          <div className="card p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingNews ? t('editNews') : t('createNews')}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('language')}</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('title')}</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('shortDescription')}</label>
                <textarea
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  className="input-field"
                  rows="3"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('category')}</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {t(cat)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('image')}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="input-field"
                />
                {editingNews?.image_url && !formData.image && (
                  <p className="text-sm text-gray-600 mt-2">
                    Current image: {editingNews.image_url}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('content')}</label>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  style={{ minHeight: '300px', marginBottom: '50px' }}
                />
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? t('loading') : editingNews ? t('update') : t('save')}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* News List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">{t('allNews')}</h2>
          {loading ? (
            <NewsGridSkeleton />
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">{t('noNews')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <div key={item.id} className="card relative">
                  <NewsCard news={item} />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      {t('edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      {t('delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
