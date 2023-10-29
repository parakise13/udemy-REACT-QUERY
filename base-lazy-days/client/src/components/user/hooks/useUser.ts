import { AxiosResponse } from 'axios';
import { useQuery, useQueryClient } from 'react-query';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../user-storage';

async function getUser(user: User | null): Promise<User | null> {
  if (!user) return null;
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${user.id}`,
    {
      headers: getJWTHeader(user),
    },
  );
  return data.user;
}

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export function useUser(): UseUser {
  // TODO: call useQuery to update user data from server
  const queryClient = useQueryClient();
  const { data: user } = useQuery(queryKeys.user, () => getUser(user), {
    //  초기 데이터가 필요할 때마다 로컬스토리지에서 user 가져옴
    initialData: getStoredUser,
    onSuccess: (received: User | null) => {
      if (!received) {
        clearStoredUser();
      } else {
        setStoredUser(received);
      }
    },
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // TODO: update the user in the query cache
    // 사용자가 인증되면 캐시에 사용자 정보를 업데이트한다.
    queryClient.setQueryData(queryKeys.user, newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    // TODO: reset user to null in query cache
    // 사용자가 로그아웃하면 캐시에서 사용자 정보 삭제
    // 여기서 removeQueries를 사용하지 않고 setQueryData로 null 세팅을 해주는 이유는 사용자 데이터를 변경해서 onSuccess콜백을 발생시킬 때 onSuccess 콜백이 로컬 스토리지에 데이털르 유지하며 setQueryData가 onSuceess를 발생시키기 때문. 즉, onSuccess는 setQueryData 다음에 실행되고 removeQueries 다음에는 실행되지 않는다.
    queryClient.setQueryData(queryKeys.user, null);
    queryClient.removeQueries('user-appintments');
  }

  return { user, updateUser, clearUser };
}
