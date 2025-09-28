import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TransferState, Transfer, TransferRequest, ExchangeRate } from '@/types';
import { transferService } from '@/services/transferService';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallback;
};

const initialState: TransferState = {
  transfers: [],
  currentTransfer: null,
  exchangeRates: {},
  recipients: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchTransfers = createAsyncThunk(
  'transfer/fetchTransfers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await transferService.getTransfers();
      if (!response.success) {
        throw new Error(response.message || 'Unable to load transfers');
      }
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Unable to load transfers'));
    }
  }
);

export const createTransfer = createAsyncThunk(
  'transfer/createTransfer',
  async (transferData: TransferRequest, { rejectWithValue }) => {
    try {
      const response = await transferService.createTransfer(transferData);
      if (!response.success) {
        throw new Error(response.message || 'Unable to create transfer');
      }
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Unable to create transfer'));
    }
  }
);

export const fetchExchangeRate = createAsyncThunk(
  'transfer/fetchExchangeRate',
  async ({ from, to }: { from: string; to: string }, { rejectWithValue }) => {
    try {
      const response = await transferService.getExchangeRate(from, to);
      if (!response.success) {
        throw new Error(response.message || 'Unable to fetch exchange rate');
      }
      return { key: `${from}-${to}`, rate: response.data };
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Unable to fetch exchange rate'));
    }
  }
);

export const fetchRecipients = createAsyncThunk(
  'transfer/fetchRecipients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await transferService.getRecipients();
      if (!response.success) {
        throw new Error(response.message || 'Unable to load recipients');
      }
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Unable to load recipients'));
    }
  }
);

const transferSlice = createSlice({
  name: 'transfer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentTransfer: (state, action: PayloadAction<Transfer | null>) => {
      state.currentTransfer = action.payload;
    },
    updateTransferStatus: (state, action: PayloadAction<{ id: string; status: Transfer['status'] }>) => {
      const transfer = state.transfers.find(t => t.id === action.payload.id);
      if (transfer) {
        transfer.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch transfers
      .addCase(fetchTransfers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransfers.fulfilled, (state, action) => {
        state.loading = false;
        state.transfers = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTransfers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create transfer
      .addCase(createTransfer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransfer.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.transfers)) {
          state.transfers = [];
        }
        state.transfers.unshift(action.payload);
        state.currentTransfer = action.payload;
      })
      .addCase(createTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch exchange rate
      .addCase(fetchExchangeRate.fulfilled, (state, action) => {
        state.exchangeRates[action.payload.key] = action.payload.rate;
      })
      // Fetch recipients
      .addCase(fetchRecipients.fulfilled, (state, action) => {
        state.recipients = action.payload;
      });
  },
});

export const { clearError, setCurrentTransfer, updateTransferStatus } = transferSlice.actions;
export default transferSlice.reducer;