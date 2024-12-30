import { createLazyFileRoute } from '@tanstack/react-router'
import '../assets/about.css'

const About = () => {
  return (
    <div className="container">
      <div className="hero">
          <h1 className="animated-text">
                  Master Your Finances with Expensy
          </h1>
      </div>
      
      <main className="lol">
        <section className="about-content">
          <p>
            Welcome to <strong>Budgetary</strong>, your personal expense tracking friendo!
            This app is designed to help you monitor and analyze your spending habits, providing 
            valuable insights to make better financial decisions.
          </p>
          <p>
            Features include:
          </p>
          <p>
            <ul>
              <li>Track Daily expenses with ease</li>
              <li>View spending graphs for a visual Breakdon</li>
              <li>Monitor monthly budgets and top spendding categories</li>
            </ul>
          </p>
          <p>
            Start using <strong>Budgetary</strong> today to take control of your fiances!
          </p>
        </section>
      </main>
      <footer className="footer">
        <p>
          Check out the sourcee code on <a href="https://github.com/aalibrahimi" target="-blank" rel="noopener and nonreferrer">Github</a>
        </p>
      </footer>
    </div>
  );
};


export const Route = createLazyFileRoute('/about')({
  component: About
})
