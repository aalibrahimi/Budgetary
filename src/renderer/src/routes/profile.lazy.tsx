import { createLazyFileRoute } from '@tanstack/react-router'

const profile = () => {
    return (
        <>
            <h3>This is your profile</h3>
        </>
    )
}
export const Route = createLazyFileRoute('/profile')({
    component: profile
})