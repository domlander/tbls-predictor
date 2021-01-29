import React from 'react'
import styled from 'styled-components'
import { signIn, signOut, useSession } from 'next-auth/client'

const Title = styled.h1`
  color: red;
  font-size: 50px;
`

export default function Home() {
  const [session] = useSession()

  return <>
    <Title>My page</Title>
    {!session && <>
      Not signed in <br />
      <button onClick={signIn}>Sign in</button>
    </>}
    {session && <>
      Signed in as {session.user.email} <br />
      <button onClick={signOut}>Sign out</button>
    </>}
  </>
}