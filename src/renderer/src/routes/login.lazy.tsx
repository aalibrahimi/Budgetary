import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"
import { createLazyFileRoute } from "@tanstack/react-router"

const Login = () => {
  return (
    <>
      <SignedOut>
        <SignInButton />
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  )
}

export const Route = createLazyFileRoute('/login')({
  component: Login
})