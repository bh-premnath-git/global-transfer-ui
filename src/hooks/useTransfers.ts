import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchTransfers, createTransfer, fetchExchangeRate, fetchRecipients } from '@/store/slices/transferSlice';
import { TransferRequest } from '@/types';

export const useTransfers = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const transferState = useAppSelector((state) => state.transfer);

  // Fetch transfers query
  const { data: transfers, isLoading: isLoadingTransfers } = useQuery({
    queryKey: ['transfers'],
    queryFn: () => dispatch(fetchTransfers()).unwrap(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch recipients query
  const { data: recipients, isLoading: isLoadingRecipients } = useQuery({
    queryKey: ['recipients'],
    queryFn: () => dispatch(fetchRecipients()).unwrap(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create transfer mutation
  const createTransferMutation = useMutation({
    mutationFn: (transferData: TransferRequest) => dispatch(createTransfer(transferData)).unwrap(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
    },
  });

  // Exchange rate query with cache
  const useExchangeRate = (from: string, to: string) => {
    return useQuery({
      queryKey: ['exchangeRate', from, to],
      queryFn: () => dispatch(fetchExchangeRate({ from, to })).unwrap(),
      enabled: !!from && !!to && from !== to,
      staleTime: 30 * 1000, // 30 seconds
      refetchInterval: 60 * 1000, // Refetch every minute
    });
  };

  return {
    // State
    transfers: transferState.transfers,
    currentTransfer: transferState.currentTransfer,
    recipients: transferState.recipients,
    exchangeRates: transferState.exchangeRates,
    isLoading: transferState.loading || isLoadingTransfers || isLoadingRecipients,
    error: transferState.error,

    // Actions
    createTransfer: createTransferMutation.mutate,
    useExchangeRate,

    // Mutation states
    isCreatingTransfer: createTransferMutation.isPending,
  };
};