import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import '../assets/index.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { useDarkModeStore } from './__root'
import { FeatureCard, TestimonialCard } from '@renderer/components/cards'
import { SignedIn, SignedOut, SignUpButton } from '@clerk/clerk-react'

// Types
// interface User {
//   isAuthenticated: boolean;
// }

const Index = () => {
  const { isDarkMode } = useDarkModeStore() // Zustand store
  // const [user, setUser] = useState<User>({ isAuthenticated: false });

  // Sync state with localStorage and DOM on initial load
  useEffect(() => {
    // Apply or remove dark mode class
    const darkyElement = document.getElementById('darky')
    if (isDarkMode) {
      darkyElement?.classList.add('dark-mode')
    } else {
      darkyElement?.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  console.log('Dark mode state:', isDarkMode)

  const LSCleanse = () => {
    localStorage.removeItem('isDarkMode')
  }
  return (
    <div className="app-container" id="darky">
      <section className="hero">
        <div className="hero-content">
          <h1 className="animated-text">Master Your Finances with Budgetary</h1>
          <p className="subtitle">Join millions in taking control of their financial future</p>
          <SignedOut>
            <SignUpButton>
              <div id="get-started-button" className="btn btn-register">
                Get Started for Free
              </div>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link to="/expenses" className="btn btn-register">
              Go to Dashboard
            </Link>
          </SignedIn>
          <button type="button" onClick={LSCleanse}>
            Clear LS
          </button>
        </div>
        <div className="hero-visual">
          <div className="floating-icon">
            <i className="fas fa-coins"></i>
          </div>
          <div className="floating-icon">
            <i className="fas fa-chart-pie"></i>
          </div>
          <div className="floating-icon">
            <i className="fas fa-piggy-bank"></i>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <h2>Explore Budgetary Tracker Features</h2>
        <div className="feature-grid">
          <FeatureCard
            icon="fa-wallet"
            title="Smart Budgeting"
            description="Set and monitor your budgets with AI-powered insights"
          />
          <FeatureCard
            icon="fa-chart-pie"
            title="Advanced Analytics"
            description="Visualize your spending patterns with interactive charts"
          />
          <FeatureCard
            icon="fa-bell"
            title="Intelligent Reminders"
            description="Get personalized alerts to avoid overspending"
          />
        </div>
      </section>

      <section id="testimonials" className={`testimonials ${isDarkMode ? 'dark-mode' : ''}`}>
        <h2>What Our Users Say</h2>
        <div className="testimonial-carousel">
          <TestimonialCard
            quote="Budgetary Tracker changed my financial life. I've never been more in control of my spending!"
            author="Sarah J."
            rating={5}
          />
          <TestimonialCard
            quote="The insights I get from this app are incredible. It's like having a personal financial advisor."
            author="Mike T."
            rating={5}
          />
          <TestimonialCard
            quote="I love how easy it is to use. The reminders have saved me from late fees multiple times!"
            author="Emily R."
            rating={4}
          />
        </div>
      </section>
      {/* When writing a button like option 1, it only executes the function when button is clicked.
        When writing a button like option 2, it constantly 'runs' the function. */}
      {/* <button type="button" onClick={() => handleFunc()}>Test button</button> Option 1 */}
      {/* <button type="button" onClick={handleFunc}>Test button</button> Option 2 */}
    </div>
  )
}

export const Route = createLazyFileRoute('/')({
  component: Index
})
