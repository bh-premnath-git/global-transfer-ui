import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TransferState, Transfer, TransferRequest, ExchangeRate } from '@/types';
import { transferService } from '@/services/transferService';

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
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTransfer = createAsyncThunk(
  'transfer/createTransfer',
  async (transferData: TransferRequest, { rejectWithValue }) => {
    try {
      const response = await transferService.createTransfer(transferData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchExchangeRate = createAsyncThunk(
  'transfer/fetchExchangeRate',
  async ({ from, to }: { from: string; to: string }, { rejectWithValue }) => {
    try {
      const response = await transferService.getExchangeRate(from, to);
      return { key: `${from}-${to}`, rate: response.data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRecipients = createAsyncThunk(
  'transfer/fetchRecipients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await transferService.getRecipients();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
        state.transfers = action.payload;
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