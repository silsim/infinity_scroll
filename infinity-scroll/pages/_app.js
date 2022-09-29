import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  // useState lazy init을 사용해 QueryClient 인스턴스를 생성해
  // QueryClientProvider의 client 값으로 전달해준다
  const [queryClient] = useState(() => new QueryClient());

  return (
    // QueryClientProvider 로 인해 모든 페이지, 컴포넌트에서
    // queryClient 에 접근이 가능해진다.
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      {/* // devTool을 설치한다. 화면 좌측하단의 로고를 누르면 개발툴을 열어볼 수있다. 
      // 개발환경에서만 활성화되기 때문에 따로 신경을 쓸 필요도 없다. */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
