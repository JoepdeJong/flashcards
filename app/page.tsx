import Main from '@/components/Main';
import { Definition } from '@/types/definition';

export default async function Home() {
  
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const data = await fetcher('http://localhost:3000/api/definitions') as Definition[]

  if (!data) return <h2>Loading...</h2>
  
  return <Main data={data!} />
}