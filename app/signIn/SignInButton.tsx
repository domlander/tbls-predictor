"use client";

import { signIn } from "next-auth/react";
import Button from "src/components/Button";

// TODO: We are wrapping all pages in _app.tsx with the Layout component, as every component needs the layout
// except for this page. For now we are covering it up so the user cannot see it.
// We can't use useSession in _app.js, which is why we're loading the header.
const SignInButton = () => {
  return (
    <Button handleClick={() => signIn()} type="button" variant="primary">
      Sign in
    </Button>
  );
};

export default SignInButton;
