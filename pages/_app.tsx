import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'mobx-react'
import stores from '../stores/RootStore'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider {...stores}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
