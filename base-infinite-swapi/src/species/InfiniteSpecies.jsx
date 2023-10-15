import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import { useInfiniteQuery } from "react-query";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
    const response = await fetch(url);
    return response.json();
};

export function InfiniteSpecies() {
    // TODO: get data for InfiniteScroll via React Query
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetching,
        isError,
        error,
    } = useInfiniteQuery(
        "sw-specie",
        ({ pageParam = initialUrl }) => fetchUrl(pageParam),
        {
            getNextPageParam: (lastPage) => lastPage.next || undefined,
        }
    );

    // pageParam => useInfiniteQuery에서 온것으로 initialUrl에서 시작해서
    // pageParam값으로 fetchUrl을 실행한다.
    // 그 다음 getNestPageParam은 이전페이지(lastPage)의 다음 프로퍼티(.next)를 불러와 새 페이지 데이터가 있을 때마다 pageParam에 지정해준다.
    // 값이 null인 경우는 undefined로 둬서 hasNextPage가 false가 되게한다.

    if (isLoading) return <div className="loading">Loading...</div>;
    if (isError) return <div className="">Error... {error.toString()}</div>;

    return (
        <>
            {isFetching && <div className="loading">Loading...</div>}
            {/* loadMore은 useInfiniteQuery의 fetchNext를 사용하여 어떤 쿼리 함수든 pageParam값을 쓰게되고 pageParam값은 데이터가 추가되면 갱신된다.  
            hasMore은 계속 데이터를 불러올지 결정하는 역할 
            */}
            <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
                {/* useInfiniteQuery에서 반환된 데이터는 useQuery와 매핑된 모습이 다르다. (useQuery는 쿼리 함수의 결과를 그대로 출력)
                useInfiniteQuery에서 사용하는 프로퍼티는 pages프로퍼티고 여기에는 pageParam이 실행될 때마다 필요한 데이터 배열이 들어있다. 즉, 각 페이지 안에 매핑할 데이터가 들어있는 것 
                */}
                {data.pages.map((pageData) => {
                    return (
                        <>
                            {
                                // name, language, averageLifespan
                                pageData.results.map((specie) => {
                                    return (
                                        <Species
                                            key={specie.name}
                                            name={specie.name}
                                            language={specie.language}
                                            averageLifespan={
                                                specie.average_lifespan
                                            }
                                        />
                                    );
                                })
                            }
                        </>
                    );
                })}
            </InfiniteScroll>
        </>
    );
}
