import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../components/layout'
import mococon from 'public/images/moco1.png'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>LoaUtils</title>
      </Head>
      <div className='m-4'>
        <p>
          <Image src={mococon} placeholder='blur' /> <br />
          기능 추가, 버그 제보 등 건의사항은 여기로 <br />
          <Link href='https://open.kakao.com/o/saoyENWd'>
            <a className='underline'>{'>'} 카카오톡 1:1 채팅</a>
          </Link>
        </p>
      </div>

    </Layout>
  )
}

export default Home
