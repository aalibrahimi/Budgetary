import { createLazyFileRoute } from '@tanstack/react-router'
import '../assets/index.css'

const Index = () => {
  return (
    <>
    <div>
        <h3>Budgetary Home Page</h3>
    </div>
    </>
  )
}

export const Route = createLazyFileRoute('/')({
    component: Index,
})