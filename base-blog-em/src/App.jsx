import { Posts } from "./Posts";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "./App.css";

const queryClient = new QueryClient();
// 클라이언트를 만들어야 Provider를 추가할수 있다. 그러면 공급자가 클라이언트를 소품으로 사용하게 되면서
// 클라이언트가 가지고 있는 캐시와 모든 기본 옵션을 provider의 자녀 컴포넌트로도 사용할 수 있게됨

function App() {
    return (
        // provide React Query client to App
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <h1>Blog Posts</h1>
                <Posts />
            </div>
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
}

export default App;
