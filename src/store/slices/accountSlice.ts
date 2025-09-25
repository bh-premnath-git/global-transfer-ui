import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountState, LedgerEntry, WalletSummary } from '@/types';
import { accountService } from '@/services/accountService';

const initialState: AccountState = {
  wallet: null,
  ledger: [],
  loading: false,
  error: null,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallback;
};

export const fetchWalletSummary = createAsyncThunk(
  'account/fetchWalletSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await accountService.getWalletSummary();
      if (!response.success) {
        throw new Error(response.message || 'Unable to load wallet');
      }
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Unable to load wallet'));
    }
  }
);

export const fetchLedger = createAsyncThunk(
  'account/fetchLedger',
  async (_, { rejectWithValue }) => {
    try {
      const response = await accountService.getLedger();
      if (!response.success) {
        throw new Error(response.message || 'Unable to load ledger');
      }
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Unable to load ledger'));
    }
  }
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    addLedgerEntry: (state, action: PayloadAction<LedgerEntry>) => {
      state.ledger = [action.payload, ...state.ledger].slice(0, 12);
    },
    setWalletSummary: (state, action: PayloadAction<WalletSummary>) => {
      state.wallet = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload as WalletSummary;
      })
      .addCase(fetchWalletSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLedger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLedger.fulfilled, (state, action) => {
        state.loading = false;
        state.ledger = action.payload as LedgerEntry[];
      })
      .addCase(fetchLedger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addLedgerEntry, setWalletSummary } = accountSlice.actions;
export default accountSlice.reducer;
