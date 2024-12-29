import { createLazyFileRoute } from "@tanstack/react-router"

const Login = () => {
  return (
    <>
      <h3>Login Page</h3>
    </>
  )
}

export const Route = createLazyFileRoute('/login')({
  component: Login
})