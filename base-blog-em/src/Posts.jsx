import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { PostDetail } from "./PostDetail";
const maxPostPage = 9;

async function fetchPosts(pageNum) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
    );
    return response.json();
}

export function Posts() {
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedPost, setSelectedPost] = useState(null);

    const queryClient = useQueryClient();

    // prefetching이용 => 다음 페이지를 누를때 프리페칭하는 것은 옳지x
    // 비동기방식이기 때문에... 그래서 useEffect를 사용하고 의존성 배열에
    // 바뀔데이터(페이지)를 넣어준다. => 현재 페이지가 바뀔때마다 함수실행
    useEffect(() => {
        if (currentPage < maxPostPage) {
            const nextPage = currentPage + 1;
            // 쿼리키는 미리 가져올 api와 동일한 쿼리키 사용
            queryClient.prefetchQuery(["posts", nextPage], () =>
                fetchPosts(nextPage)
            );
        }
    }, [currentPage, queryClient]);

    // 첫번째 인자 : queryKey(쿼리의 이름), 두번째 인자 : query function(쿼리를 가져오는 방법)
    const { data, isError, isLoading, error } = useQuery(
        ["posts", currentPage],
        () => fetchPosts(currentPage),
        {
            staleTime: 2000,
            keepPreviousData: true,
        }
    );

    if (isLoading) return <h3>Loading...</h3>;
    if (isError)
        return (
            <>
                <h3>Oops, something went wrong.</h3>
                <p>{error.toString()}</p>
            </>
        );
    return (
        <>
            <ul>
                {data.map((post) => (
                    <li
                        key={post.id}
                        className="post-title"
                        onClick={() => setSelectedPost(post)}
                    >
                        {post.title}
                    </li>
                ))}
            </ul>
            <div className="pages">
                <button
                    disabled={currentPage < 1}
                    onClick={() => {
                        setCurrentPage((previousValue) => previousValue - 1);
                    }}
                >
                    Previous page
                </button>
                <span>Page {currentPage + 1}</span>
                <button
                    disabled={currentPage >= maxPostPage}
                    onClick={() => {
                        setCurrentPage((previousValue) => previousValue + 1);
                    }}
                >
                    Next page
                </button>
            </div>
            <hr />
            {selectedPost && <PostDetail post={selectedPost} />}
        </>
    );
}
