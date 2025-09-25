import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchLedger, fetchWalletSummary } from '@/store/slices/accountSlice';
import { useAuth } from './useAuth';

export const useAccount = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const accountState = useAppSelector((state) => state.account);

  const walletQuery = useQuery({
    queryKey: ['walletSummary'],
    queryFn: () => dispatch(fetchWalletSummary()).unwrap(),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  const ledgerQuery = useQuery({
    queryKey: ['ledgerEntries'],
    queryFn: () => dispatch(fetchLedger()).unwrap(),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  return {
    wallet: walletQuery.data ?? accountState.wallet,
    ledger: ledgerQuery.data ?? accountState.ledger,
    isLoading: accountState.loading || walletQuery.isLoading || ledgerQuery.isLoading,
    error: accountState.error,
    refetchWallet: walletQuery.refetch,
    refetchLedger: ledgerQuery.refetch,
  };
};
