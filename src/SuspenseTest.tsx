import { Suspense } from 'react'
import useSWR, { Fetcher } from 'swr'

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const postFetcher = (url: string): Promise<Post> => fetch(url).then(res => res.json())

const SuspenseTest = () => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <MyComponent />
    </Suspense>
  )
}

const MyComponent = () => {
  const { data } = useSWR<Post>("https://jsonplaceholder.typicode.com/posts/1", postFetcher)
  return(
    <div>
      <h3>{ data?.title }</h3>
      <p>{ data?.body }</p>
    </div>
  )
}

export default SuspenseTest