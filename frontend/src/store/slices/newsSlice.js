import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async ({ page = 1, limit = 10, language = 'en' } = {}) => {
    const response = await axios.get(`${API_URL}/news?page=${page}&limit=${limit}&language=${language}`);
    return response.data;
  }
);

export const fetchNewsBySlug = createAsyncThunk(
  'news/fetchNewsBySlug',
  async (slug) => {
    const response = await axios.get(`${API_URL}/news/${slug}`);
    return response.data;
  }
);

export const fetchNewsByCategory = createAsyncThunk(
  'news/fetchNewsByCategory',
  async ({ category, page = 1, limit = 10, language = 'en' }) => {
    const response = await axios.get(`${API_URL}/news/category/${category}?page=${page}&limit=${limit}&language=${language}`);
    return response.data;
  }
);

export const createNews = createAsyncThunk(
  'news/createNews',
  async (newsData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const formData = new FormData();
      
      // Ensure all required fields are included
      formData.append('title', newsData.title || '');
      formData.append('short_description', newsData.short_description || '');
      formData.append('content', newsData.content || ''); // Ensure content is always sent
      formData.append('category', newsData.category || 'uzbekistan');
      formData.append('language', newsData.language || 'en'); // Add language
      
      if (newsData.image) {
        formData.append('image', newsData.image);
      }

      const response = await axios.post(`${API_URL}/news`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header - let axios set it automatically for FormData
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateNews = createAsyncThunk(
  'news/updateNews',
  async ({ id, ...newsData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const formData = new FormData();
      
      // Always include content field, even if empty (React Quill might return empty HTML)
      if (newsData.title !== undefined) formData.append('title', newsData.title);
      if (newsData.short_description !== undefined) formData.append('short_description', newsData.short_description);
      if (newsData.content !== undefined) formData.append('content', newsData.content || ''); // Always send content
      if (newsData.category !== undefined) formData.append('category', newsData.category);
      if (newsData.image) {
        formData.append('image', newsData.image);
      }

      const response = await axios.put(`${API_URL}/news/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header - let axios set it automatically for FormData
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteNews = createAsyncThunk(
  'news/deleteNews',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`${API_URL}/news/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  news: [],
  currentNews: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  loading: false,
  error: null,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    clearCurrentNews: (state) => {
      state.currentNews = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch news
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload.news;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch news by slug
      .addCase(fetchNewsBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNews = action.payload;
      })
      .addCase(fetchNewsBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch news by category
      .addCase(fetchNewsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload.news;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNewsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create news
      .addCase(createNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news.unshift(action.payload);
      })
      .addCase(createNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      })
      // Update news
      .addCase(updateNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.news.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.news[index] = action.payload;
        }
        if (state.currentNews?.id === action.payload.id) {
          state.currentNews = action.payload;
        }
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      })
      // Delete news
      .addCase(deleteNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = state.news.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      });
  },
});

export const { clearCurrentNews, clearError } = newsSlice.actions;
export default newsSlice.reducer;
