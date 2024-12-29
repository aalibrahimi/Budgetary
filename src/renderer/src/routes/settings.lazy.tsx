import { createLazyFileRoute } from '@tanstack/react-router'


const settings = () => {
    return (
        <>
        <h3>This is your settings page Good Sir!</h3>
        </>
    )
  
}




export const Route = createLazyFileRoute('/settings')({
  component: settings
})

