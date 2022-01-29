import Link from "next/link";

export default function Layout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className='container mx-auto px-8 shadow-lg flex items-stretch'>
        <Link href='/'>
          <a className='text-lg font-semibold px-4 flex items-center'>
            LoaUtils
          </a>
        </Link>
        {[
          ['보석 계산', '/gem'],
          ['카드 계산', '/card'],
        ].map(([title, url], idx) => (
          <Link href={url} key={idx}>
            <a className='px-4 hover:text-sky-700 hover:bg-gray-100 py-4'>{title}</a>
          </Link>
        ))}
      </div>
      <div className='container mx-auto px-8 py-4'>
        { children }
      </div>
    </>
  )
}