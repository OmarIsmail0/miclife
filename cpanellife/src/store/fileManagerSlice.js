import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import documentService from "../api/services/documentService";
import { API_CONFIG } from "../api";

// Async thunk for fetching files
export const fetchFiles = createAsyncThunk(
  "fileManager/fetchFiles",
  async ({ page = 1, pageSize = 12 }, { rejectWithValue }) => {
    try {
      const response = await documentService.getAll({ PageNumber: page, PageSize: pageSize });
      const fileList = response.data.map((item) => `${API_CONFIG.BASE_URL}${item.filePath}`);
      return {
        data: response.data,
        fileList,
        total: response.total || response.totalCount || 0,
        page,
        pageSize,
      };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to load files");
    }
  }
);

// Async thunk for deleting a file
export const deleteFile = createAsyncThunk("fileManager/deleteFile", async (id, { rejectWithValue }) => {
  try {
    await documentService.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue(error?.message || "Failed to delete file");
  }
});

const fileManagerSlice = createSlice({
  name: "fileManager",
  initialState: {
    data: [],
    fileList: [],
    pagination: {
      current: 1,
      pageSize: 16,
      total: 0,
    },
    loading: false,
    error: null,
    lastFetchTime: null, // Track when data was last fetched
  },
  reducers: {
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearFiles: (state) => {
      state.data = [];
      state.fileList = [];
      state.pagination = { current: 1, pageSize: 16, total: 0 };
      state.lastFetchTime = null;
    },
    invalidateCache: (state) => {
      state.lastFetchTime = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch files
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.fileList = action.payload.fileList;
        state.pagination = {
          current: action.payload.page,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
        };
        state.lastFetchTime = Date.now();
        state.error = null;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete file
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.data = state.data.filter((item) => item.id !== deletedId);
        // Rebuild fileList from remaining data
        state.fileList = state.data.map((item) => `${API_CONFIG.BASE_URL}${item.filePath}`);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        state.loading = false;
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPagination, clearFiles, invalidateCache } = fileManagerSlice.actions;
export default fileManagerSlice.reducer;
