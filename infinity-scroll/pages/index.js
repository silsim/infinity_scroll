import Head from 'next/head'
import styles from '../styles/index.module.css'
import { useEffect, useRef } from 'react'
import { useInfiniteQuery } from 'react-query'
import axios from 'axios'

export default function Index() {
  const OFFSET = 30 // 나중에 편하게 바꿀 수 있도록 page offset을 상수로 설정


// pageParam은 useInfiniteQuery의 getNextPageParam에서 자동으로 넘어온다. 
// 1페이지는 undefined로 아무것도 넘어오지 않는다. 초기값을 반드시 설정해 주자. 
const getPokemonList = ({ pageParam = OFFSET }) => {     
  axios
  .get("https://pokeapi.co/api/v2/pokemon", {
      // axios.get(url, config), 
      // url전체를 템플릿 리터럴로 넘기든 config의 params로 넘기든 취향에 맞게 넘기자.
      params: {
          limit: OFFSET,
          offset: pageParam,
      },
  })
  .then(res => res?.data)
}
useEffect(()=>{

},[])


  const {
    data, // 💡 data.pages를 갖고 있는 배열
    error, // error 객체
    fetchNextPage, // 💡 다음 페이지를 불러오는 함수
    hasNextPage, // 다음 페이지가 있는지 여부, Boolean
    isFetching, // 첫 페이지 fetching 여부, Boolean, 잘 안쓰인다
    isFetchingNextPage, // 추가 페이지 fetching 여부, Boolean
    status, // 💡 loading, error, success 중 하나의 상태, string
} = useInfiniteQuery(
      "pokemonList" // data의 이름
    , getPokemonList // fetch callback, 위 data를 불러올 함수
    , {
        // 💡 중요! getNextPageParams가 무한 스크롤의 핵심,
        // getNextPageParam 메서드가 falsy한 값을 반환하면 추가 fetch를 실행하지 않는다
        // falsy하지 않은 값을 return 할 경우 Number를 리턴해야 하며
        // 위의 fetch callback의 인자로 자동으로 pageParam을 전달.
        getNextPageParam: lastPage => {
          const { next } = lastPage // PoKeApi는 마지막 데이터가 없으면 next를 null로 준다

          // 마지막페이지 fetchNextPage가 더는 작동하지 않도록 false를 리턴하자
          if (!next) return false

          // next 값에서 URL주소를 주고 있기 때문에 필요한 offset만 빼와서
          // getPokemonList 함수에 pageParam으로 넘겨주자.
          return Number( new URL(next).searchParams.get("offset") )
      }
    }
)





// render는 이렇게 하자
return (
    <div>
        {/* // status에 따라서 화면을 달리한다. (사실 이렇게 안하고 다짜고자 data를 보면 터진다)
        // 단순한 문구가 재미없다면 skeleton을 따로 만들어서 로딩으로 사용하는 것도 추천 */}
        {status === "loading" && <p>불러오는 중</p>}

        {status === "error" && <p>{error.message}</p>}

        {/* // 추가로 success일 경우에만 data를 들여다 보도록 하자. */}
        {status === "success" &&
            data.pages.map((group, index) => (
                // pages들이 페이지 숫자에 맞춰서 들어있기 때문에
                // group을 map으로 한번 더 돌리는 이중 배열 구조이다.
                // PoKeApi는 특별한 고유 값이 없기에 key는 적당히 넣어준다.
                <div key={index}>
                    {group.results.map(pokemon => (
                        <p key={pokemon.name}>{pokemon.name}</p>
                    ))}
                </div>
        ))}

        {/* // 스크롤 구현 전까지 테스트로 사용할 임시 버튼 */}
        <button onClick={() => fetchNextPage()}>더 불러오기</button>

        {/* // skeleton이나 화면 spinner로 로딩 만드는 것도 좋을 것 같다. */}
        {isFetchingNextPage && <p>계속 불러오는 중</p>}
    </div>
)
}

