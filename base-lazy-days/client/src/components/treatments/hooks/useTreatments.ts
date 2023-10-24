import { useQuery, useQueryClient } from 'react-query';

import type { Treatment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  // TODO: get data from server via useQuery

  const fallback = [];
  const { data = fallback } = useQuery(queryKeys.treatments, getTreatments);

  return data;
}
export function usePrefetchTreatments(): void {
  // useQueryClient를 가져와서 prefetchQuery 실행
  const queryClient = useQueryClient();

  // 여기서 키는 캐시에서 어느 useQuery가 이 데이터를 찾아야하는지 알려주기 때문에 정말 중요하다. 여기서 사용한 키가 어떤 useQuery를 사용할지 알려주는 것.
  queryClient.prefetchQuery(queryKeys.treatments, getTreatments);
}
