import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ticketService from "../api/services/ticketService";
import ticketActivityService from "../api/services/ticketActivityService";
import catalogService from "../api/services/catalogService";

// Async thunk for fetching tickets
export const fetchTickets = createAsyncThunk(
  "ticketManager/fetchTickets",
  async ({ filters = {} }, { rejectWithValue }) => {
    try {
      // Fetch all tickets - use a large page size to get all data
      const params = {
        PageNumber: 1,
        PageSize: 10000, // Large number to fetch all tickets
      };
      const response = await ticketService.getAll(params);
      return {
        data: response.data || response,
      };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to load tickets");
    }
  }
);

// Async thunk for fetching a single ticket by ID
export const fetchTicketById = createAsyncThunk("ticketManager/fetchTicketById", async (id, { rejectWithValue }) => {
  try {
    const response = await ticketService.getById(id);
    return response.data || response;
  } catch (error) {
    return rejectWithValue(error?.message || "Failed to load ticket");
  }
});

// Async thunk for creating a ticket
export const createTicket = createAsyncThunk("ticketManager/createTicket", async (data, { rejectWithValue }) => {
  try {
    const response = await ticketService.create(data);
    return response.data || response;
  } catch (error) {
    return rejectWithValue(error?.message || "Failed to create ticket");
  }
});

// Async thunk for updating a ticket
export const updateTicket = createAsyncThunk("ticketManager/updateTicket", async (data, { rejectWithValue }) => {
  try {
    const response = await ticketService.update(data);
    return response.data || response;
  } catch (error) {
    return rejectWithValue(error?.message || "Failed to update ticket");
  }
});

// Async thunk for deleting a ticket
export const deleteTicket = createAsyncThunk("ticketManager/deleteTicket", async (id, { rejectWithValue }) => {
  try {
    await ticketService.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue(error?.message || "Failed to delete ticket");
  }
});

// Async thunk for updating ticket status
export const updateTicketStatus = createAsyncThunk(
  "ticketManager/updateTicketStatus",
  async ({ id, statusId }, { rejectWithValue }) => {
    try {
      const response = await ticketService.updateStatus(id, statusId);
      return { id, statusId, data: response.data || response };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to update ticket status");
    }
  }
);

// Async thunk for fetching ticket activities
export const fetchTicketActivities = createAsyncThunk(
  "ticketManager/fetchTicketActivities",
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await ticketService.getActivities(ticketId);
      return { ticketId, activities: response.data || response };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to load ticket activities");
    }
  }
);

// Async thunk for creating a ticket activity (comment)
export const createTicketActivity = createAsyncThunk(
  "ticketManager/createTicketActivity",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ticketActivityService.create(data);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to create ticket activity");
    }
  }
);

// Async thunk for updating a ticket activity
export const updateTicketActivity = createAsyncThunk(
  "ticketManager/updateTicketActivity",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ticketActivityService.update(data);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to update ticket activity");
    }
  }
);

// Async thunk for deleting a ticket activity
export const deleteTicketActivity = createAsyncThunk(
  "ticketManager/deleteTicketActivity",
  async (id, { rejectWithValue }) => {
    try {
      await ticketActivityService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to delete ticket activity");
    }
  }
);

// Async thunk for fetching ticket statuses catalog
export const fetchTicketStatuses = createAsyncThunk(
  "ticketManager/fetchTicketStatuses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await catalogService.getTicketStatus();
      return response.data || response || [];
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to load ticket statuses");
    }
  }
);

// Async thunk for fetching ticket types catalog
export const fetchTicketTypes = createAsyncThunk("ticketManager/fetchTicketTypes", async (_, { rejectWithValue }) => {
  try {
    const response = await catalogService.getTicketType();
    return response.data || response || [];
  } catch (error) {
    return rejectWithValue(error?.message || "Failed to load ticket types");
  }
});

const ticketManagerSlice = createSlice({
  name: "ticketManager",
  initialState: {
    tickets: [],
    selectedTicket: null,
    ticketActivities: {},
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    filters: {
      TicketType: null,
      TicketStatus: null,
      Email: null,
    },
    catalog: {
      ticketTypes: [],
      ticketStatuses: [],
      lastFetchTime: null,
    },
    loading: false,
    loadingTicket: false,
    loadingActivities: false,
    loadingCatalog: false,
    error: null,
    lastFetchTime: null,
  },
  reducers: {
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        TicketType: null,
        TicketStatus: null,
        Email: null,
      };
    },
    setSelectedTicket: (state, action) => {
      state.selectedTicket = action.payload;
    },
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
    clearTickets: (state) => {
      state.tickets = [];
      state.selectedTicket = null;
      state.ticketActivities = {};
      state.pagination = { current: 1, pageSize: 10, total: 0 };
      state.lastFetchTime = null;
    },
    invalidateCache: (state) => {
      state.lastFetchTime = null;
    },
    setTicketTypes: (state, action) => {
      state.catalog.ticketTypes = action.payload;
    },
    setTicketStatuses: (state, action) => {
      state.catalog.ticketStatuses = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tickets
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.data;
        state.lastFetchTime = Date.now();
        state.error = null;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch ticket by ID
      .addCase(fetchTicketById.pending, (state) => {
        state.loadingTicket = true;
        state.error = null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.loadingTicket = false;
        state.selectedTicket = action.payload;
        state.error = null;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.loadingTicket = false;
        state.error = action.payload;
      })
      // Create ticket
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets.unshift(action.payload);
        state.pagination.total += 1;
        state.error = null;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update ticket
      .addCase(updateTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTicket = action.payload;
        const index = state.tickets.findIndex((t) => t.id === updatedTicket.id);
        if (index !== -1) {
          state.tickets[index] = updatedTicket;
        }
        if (state.selectedTicket?.id === updatedTicket.id) {
          state.selectedTicket = updatedTicket;
        }
        state.error = null;
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete ticket
      .addCase(deleteTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.tickets = state.tickets.filter((ticket) => ticket.id !== deletedId);
        if (state.selectedTicket?.id === deletedId) {
          state.selectedTicket = null;
        }
        delete state.ticketActivities[deletedId];
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        state.loading = false;
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update ticket status
      .addCase(updateTicketStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { id, statusId, data } = action.payload;
        const index = state.tickets.findIndex((t) => t.id === id);
        if (index !== -1) {
          state.tickets[index] = { ...state.tickets[index], ...data, ticketStatus: statusId };
        }
        if (state.selectedTicket?.id === id) {
          state.selectedTicket = { ...state.selectedTicket, ...data, ticketStatus: statusId };
        }
        state.error = null;
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch ticket activities
      .addCase(fetchTicketActivities.pending, (state) => {
        state.loadingActivities = true;
        state.error = null;
      })
      .addCase(fetchTicketActivities.fulfilled, (state, action) => {
        state.loadingActivities = false;
        state.ticketActivities[action.payload.ticketId] = action.payload.activities;
        state.error = null;
      })
      .addCase(fetchTicketActivities.rejected, (state, action) => {
        state.loadingActivities = false;
        state.error = action.payload;
      })
      // Create ticket activity
      .addCase(createTicketActivity.pending, (state) => {
        state.loadingActivities = true;
      })
      .addCase(createTicketActivity.fulfilled, (state, action) => {
        state.loadingActivities = false;
        const activity = action.payload;
        const ticketId = activity.ticketId;
        if (state.ticketActivities[ticketId]) {
          state.ticketActivities[ticketId].push(activity);
        } else {
          state.ticketActivities[ticketId] = [activity];
        }
        state.error = null;
      })
      .addCase(createTicketActivity.rejected, (state, action) => {
        state.loadingActivities = false;
        state.error = action.payload;
      })
      // Update ticket activity
      .addCase(updateTicketActivity.pending, (state) => {
        state.loadingActivities = true;
      })
      .addCase(updateTicketActivity.fulfilled, (state, action) => {
        state.loadingActivities = false;
        const updatedActivity = action.payload;
        const ticketId = updatedActivity.ticketId;
        if (state.ticketActivities[ticketId]) {
          const index = state.ticketActivities[ticketId].findIndex((a) => a.id === updatedActivity.id);
          if (index !== -1) {
            state.ticketActivities[ticketId][index] = updatedActivity;
          }
        }
        state.error = null;
      })
      .addCase(updateTicketActivity.rejected, (state, action) => {
        state.loadingActivities = false;
        state.error = action.payload;
      })
      // Delete ticket activity
      .addCase(deleteTicketActivity.pending, (state) => {
        state.loadingActivities = true;
      })
      .addCase(deleteTicketActivity.fulfilled, (state, action) => {
        state.loadingActivities = false;
        const deletedId = action.payload;
        // Find and remove the activity from all tickets
        Object.keys(state.ticketActivities).forEach((ticketId) => {
          state.ticketActivities[ticketId] = state.ticketActivities[ticketId].filter((a) => a.id !== deletedId);
        });
        state.error = null;
      })
      .addCase(deleteTicketActivity.rejected, (state, action) => {
        state.loadingActivities = false;
        state.error = action.payload;
      })
      // Fetch ticket statuses catalog
      .addCase(fetchTicketStatuses.pending, (state) => {
        state.loadingCatalog = true;
        state.error = null;
      })
      .addCase(fetchTicketStatuses.fulfilled, (state, action) => {
        state.loadingCatalog = false;
        state.catalog.ticketStatuses = action.payload;
        state.catalog.lastFetchTime = Date.now();
        state.error = null;
      })
      .addCase(fetchTicketStatuses.rejected, (state, action) => {
        state.loadingCatalog = false;
        state.error = action.payload;
      })
      // Fetch ticket types catalog
      .addCase(fetchTicketTypes.pending, (state) => {
        state.loadingCatalog = true;
        state.error = null;
      })
      .addCase(fetchTicketTypes.fulfilled, (state, action) => {
        state.loadingCatalog = false;
        state.catalog.ticketTypes = action.payload;
        state.catalog.lastFetchTime = Date.now();
        state.error = null;
      })
      .addCase(fetchTicketTypes.rejected, (state, action) => {
        state.loadingCatalog = false;
        state.error = action.payload;
      });
  },
});

export const {
  setPagination,
  setFilters,
  clearFilters,
  setSelectedTicket,
  clearSelectedTicket,
  clearTickets,
  invalidateCache,
  setTicketTypes,
  setTicketStatuses,
} = ticketManagerSlice.actions;

export default ticketManagerSlice.reducer;
