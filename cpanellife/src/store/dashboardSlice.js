import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  documentService,
  ticketService,
  sectionService,
  blockService,
  productService,
  questionService,
  lobService,
  investorService,
  boardMembersService,
  shareholderService,
  branchService,
  albumService,
} from "../api";

// Async thunk to fetch all dashboard statistics
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();

      // Use existing data from Redux if available and recent (within 2 minutes)
      const TWO_MINUTES = 2 * 60 * 1000;
      const now = Date.now();

      const useExistingData = (sliceData, lastFetchTime) => {
        return sliceData && lastFetchTime && now - lastFetchTime < TWO_MINUTES;
      };

      // Check if we can use existing Redux data
      const canUseFiles = useExistingData(
        state.fileManager?.data?.length > 0 || state.fileManager?.pagination?.total > 0,
        state.fileManager?.lastFetchTime,
      );
      const canUseTickets = useExistingData(
        state.ticketManager?.tickets?.length > 0,
        state.ticketManager?.lastFetchTime,
      );

      // Build promises array - use existing data when possible
      const promises = [];

      // Files
      if (canUseFiles) {
        promises.push(
          Promise.resolve({
            status: "fulfilled",
            value: { total: state.fileManager.pagination.total || state.fileManager.data.length },
          }),
        );
      } else {
        promises.push(
          documentService.getAll({ PageNumber: 1, PageSize: 1 }).then(
            (res) => ({ status: "fulfilled", value: res }),
            (err) => ({ status: "rejected", reason: err }),
          ),
        );
      }

      // Tickets
      if (canUseTickets) {
        promises.push(
          Promise.resolve({
            status: "fulfilled",
            value: { data: state.ticketManager.tickets },
          }),
        );
      } else {
        promises.push(
          ticketService.getAll({ PageNumber: 1, PageSize: 10000 }).then(
            (res) => ({ status: "fulfilled", value: res }),
            (err) => ({ status: "rejected", reason: err }),
          ),
        );
      }

      // Content Manager data - always fetch (or use from contentManagerSlice if available)
      promises.push(
        sectionService.getAll({ PageNumber: 1, PageSize: 10000 }).then(
          (res) => ({ status: "fulfilled", value: res }),
          (err) => ({ status: "rejected", reason: err }),
        ),
        blockService.getAll({ PageNumber: 1, PageSize: 10000 }).then(
          (res) => ({ status: "fulfilled", value: res }),
          (err) => ({ status: "rejected", reason: err }),
        ),
        productService.getAll({ PageNumber: 1, PageSize: 10000 }).then(
          (res) => ({ status: "fulfilled", value: res }),
          (err) => ({ status: "rejected", reason: err }),
        ),
        questionService.getAll({ PageNumber: 1, PageSize: 10000 }).then(
          (res) => ({ status: "fulfilled", value: res }),
          (err) => ({ status: "rejected", reason: err }),
        ),
        lobService.getAll({ PageNumber: 1, PageSize: 10000 }).then(
          (res) => ({ status: "fulfilled", value: res }),
          (err) => ({ status: "rejected", reason: err }),
        ),
        investorService.getAll({ PageNumber: 1, PageSize: 10000 }).then(
          (res) => ({ status: "fulfilled", value: res }),
          (err) => ({ status: "rejected", reason: err }),
        ),
        boardMembersService.getAll({ PageNumber: 1, PageSize: 10000 }).then(
          (res) => ({ status: "fulfilled", value: res }),
          (err) => ({ status: "rejected", reason: err }),
        ),
        shareholderService.getAll({ PageNumber: 1, PageSize: 10000 }).then(
          (res) => ({ status: "fulfilled", value: res }),
          (err) => ({ status: "rejected", reason: err }),
        ),
        branchService.getAll({ PageNumber: 1, PageSize: 10000 }).then(
          (res) => ({ status: "fulfilled", value: res }),
          (err) => ({ status: "rejected", reason: err }),
        ),
        albumService.getAll().then(
          (res) => ({ status: "fulfilled", value: res }),
          (err) => ({ status: "rejected", reason: err }),
        ),
      );

      // Wait for all promises
      const results = await Promise.all(promises);

      // Extract counts from responses
      const getCount = (result, useTotal = false) => {
        if (result.status === "fulfilled") {
          const data = result.value?.data || result.value;
          if (useTotal && (result.value?.total || result.value?.totalCount)) {
            return result.value.total || result.value.totalCount || 0;
          }
          return Array.isArray(data) ? data.length : 0;
        }
        return 0;
      };

      return {
        files: getCount(results[0], true), // Use total from pagination
        tickets: getCount(results[1]),
        sections: getCount(results[2]),
        blocks: getCount(results[3]),
        products: getCount(results[4]),
        questions: getCount(results[5]),
        lobs: getCount(results[6]),
        investors: getCount(results[7]),
        boardMembers: getCount(results[8]),
        shareholders: getCount(results[9]),
        branches: getCount(results[10]),
        albums: getCount(results[11]),
        lastFetchTime: Date.now(),
      };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to load dashboard statistics");
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: {
      files: 0,
      tickets: 0,
      sections: 0,
      blocks: 0,
      products: 0,
      questions: 0,
      investors: 0,
      boardMembers: 0,
      shareholders: 0,
      branches: 0,
      lobs: 0,
      albums: 0,
    },
    loading: false,
    error: null,
    lastFetchTime: null,
    // Cache duration: 5 minutes
    cacheDuration: 5 * 60 * 1000,
  },
  reducers: {
    invalidateCache: (state) => {
      state.lastFetchTime = null;
    },
    updateStat: (state, action) => {
      const { key, value } = action.payload;
      if (key in state.stats) {
        state.stats[key] = value;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.lastFetchTime = action.payload.lastFetchTime;
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { invalidateCache, updateStat } = dashboardSlice.actions;
export default dashboardSlice.reducer;
