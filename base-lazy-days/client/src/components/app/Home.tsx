// @ts-nocheck
import { Icon, Stack, Text } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { GiFlowerPot } from 'react-icons/gi';

import { BackgroundImage } from '../common/BackgroundImage';
import { usePrefetchTreatments } from '../treatments/hooks/useTreatments';

export function Home(): ReactElement {
  // 미리 fetch해오기위해 만들어준 prefetchTreatments를 home의 최상단에서 실행.
  // home에서 실행한 이유는 home컴포넌트는 그닥 동적이지 않아서 리렌더가 별로 없기때문에 이 usePrefetchTreatments가 여러번 실행될 걱정을 하지않아도 된다.
  // 만약 그것이 걱정된다면 usePrefetchTreatments에서 staleTime과 cacheTime을 관리해줄 옵션을 추가
  // 마운트할때 한번만 실행하기위해서 useEffect를 실행할 수 없는 이유는 이것이 이미 hook이기 때문에 useEffect안에서 훅을 실행할 수는 없다.

  usePrefetchTreatments();

  return (
    <Stack textAlign="center" justify="center" height="84vh">
      <BackgroundImage />
      <Text textAlign="center" fontFamily="Forum, sans-serif" fontSize="6em">
        <Icon m={4} verticalAlign="top" as={GiFlowerPot} />
        Lazy Days Spa
      </Text>
      <Text>Hours: limited</Text>
      <Text>Address: nearby</Text>
    </Stack>
  );
}
