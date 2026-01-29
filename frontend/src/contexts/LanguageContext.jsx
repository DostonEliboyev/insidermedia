import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    home: 'Home',
    latestNews: 'Latest News',
    categories: 'Categories',
    dashboard: 'Dashboard',
    logout: 'Logout',
    adminLogin: 'Admin Login',
    // Categories
    uzbekistan: 'Uzbekistan',
    education: 'Education',
    finance: 'Finance',
    auto: 'Auto',
    world: 'World',
    // Common
    readMore: 'Read more',
    noNews: 'No news available',
    loading: 'Loading...',
    username: 'Username',
    password: 'Password',
    login: 'Login',
    required: 'is required',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    // Admin
    createNews: 'Create New News',
    editNews: 'Edit News',
    deleteNews: 'Delete News',
    title: 'Title',
    shortDescription: 'Short Description',
    content: 'Content',
    category: 'Category',
    image: 'Image',
    language: 'Language',
    save: 'Save',
    cancel: 'Cancel',
    update: 'Update',
    delete: 'Delete',
    edit: 'Edit',
    allNews: 'All News',
    // Languages
    english: 'English',
    russian: 'Russian',
    uzbek: 'Uzbek',
  },
  ru: {
    // Navigation
    home: 'Главная',
    latestNews: 'Последние новости',
    categories: 'Категории',
    dashboard: 'Панель управления',
    logout: 'Выйти',
    adminLogin: 'Вход администратора',
    // Categories
    uzbekistan: 'Узбекистан',
    education: 'Образование',
    finance: 'Финансы',
    auto: 'Авто',
    world: 'Мир',
    // Common
    readMore: 'Читать далее',
    noNews: 'Новостей нет',
    loading: 'Загрузка...',
    username: 'Имя пользователя',
    password: 'Пароль',
    login: 'Войти',
    required: 'обязательно',
    previous: 'Назад',
    next: 'Вперёд',
    page: 'Страница',
    of: 'из',
    // Admin
    createNews: 'Создать новость',
    editNews: 'Редактировать новость',
    deleteNews: 'Удалить новость',
    title: 'Заголовок',
    shortDescription: 'Краткое описание',
    content: 'Содержание',
    category: 'Категория',
    image: 'Изображение',
    language: 'Язык',
    save: 'Сохранить',
    cancel: 'Отмена',
    update: 'Обновить',
    delete: 'Удалить',
    edit: 'Редактировать',
    allNews: 'Все новости',
    // Languages
    english: 'Английский',
    russian: 'Русский',
    uzbek: 'Узбекский',
  },
  uz: {
    // Navigation
    home: 'Bosh sahifa',
    latestNews: 'So\'nggi yangiliklar',
    categories: 'Kategoriyalar',
    dashboard: 'Boshqaruv paneli',
    logout: 'Chiqish',
    adminLogin: 'Admin kirish',
    // Categories
    uzbekistan: 'O\'zbekiston',
    education: 'Ta\'lim',
    finance: 'Moliya',
    auto: 'Avto',
    world: 'Dunyo',
    // Common
    readMore: 'Batafsil',
    noNews: 'Yangiliklar mavjud emas',
    loading: 'Yuklanmoqda...',
    username: 'Foydalanuvchi nomi',
    password: 'Parol',
    login: 'Kirish',
    required: 'majburiy',
    previous: 'Oldingi',
    next: 'Keyingi',
    page: 'Sahifa',
    of: 'dan',
    // Admin
    createNews: 'Yangi yangilik yaratish',
    editNews: 'Yangilikni tahrirlash',
    deleteNews: 'Yangilikni o\'chirish',
    title: 'Sarlavha',
    shortDescription: 'Qisqa tavsif',
    content: 'Mazmun',
    category: 'Kategoriya',
    image: 'Rasm',
    language: 'Til',
    save: 'Saqlash',
    cancel: 'Bekor qilish',
    update: 'Yangilash',
    delete: 'O\'chirish',
    edit: 'Tahrirlash',
    allNews: 'Barcha yangiliklar',
    // Languages
    english: 'Inglizcha',
    russian: 'Ruscha',
    uzbek: 'O\'zbekcha',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or default to 'en'
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const changeLanguage = (lang) => {
    if (['en', 'ru', 'uz'].includes(lang)) {
      setLanguage(lang);
    }
  };

  const value = {
    language,
    changeLanguage,
    t,
    translations: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
