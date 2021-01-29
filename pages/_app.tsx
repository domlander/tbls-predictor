import "reflect-metadata"
import { Provider } from 'next-auth/client'
import { AppProps } from 'next/dist/next-server/lib/router/router'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider
      options={{
        clientMaxAge: 0,
        keepAlive: 0
      }}
      session={pageProps.session} >
      <Component {...pageProps} />
    </Provider>
  )
}