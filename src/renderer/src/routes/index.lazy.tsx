import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import '../assets/index.css';
import '@fortawesome/fontawesome-free/css/all.css';


// Types
interface User {
  isAuthenticated: boolean;
}

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<User>({ isAuthenticated: false });

  return (
    
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <main>
        
        <section className="hero">
          <div className="hero-content">
            <h1 className="animated-text">
              Master Your Finances with Expensy
            </h1>
            <p className="subtitle">
              Join millions in taking control of their financial future
            </p>
            <a href="/register" id="get-started-button" className="btn btn-register">
              Get Started For Free
            </a>
          </div>
            <div className="hero-visual">
              <div className="floating-icon"><i className="fas fa-coins"></i></div>
              <div className="floating-icon"><i className="fas fa-chart-pie"></i></div>
              <div className="floating-icon"><i className="fas fa-piggy-bank"></i></div>

             </div>

        </section>
        

        <section id="features" className="features">
          <h2>Explore Expensy Tracker Features</h2>
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

        <section id="testimonials" className="testimonials">
          <h2>What Our Users Say</h2>
          <div className="testimonial-carousel">
            <TestimonialCard
              quote="Expensy Tracker changed my financial life. I've never been more in control of my spending!"
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
      </main>

      <footer>
        <canvas id="footer-wave-canvas"></canvas>
        <div className="footer-content">
          <div className="footer-section">
            <h3>Quick Links</h3>
            <a href="#features">Features</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#about">About Us</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-section">
            <h3>Legal</h3>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div className="footer-section">
            <h3>Connect</h3>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        <div className="copyright">
          &copy; 2024 Expensy Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: {
  icon: string;
  title: string;
  description: string;
}) => (
  <div className="feature-card">
    <i className={`fas ${icon}`}></i>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

// Testimonial Card Component
const TestimonialCard = ({ quote, author, rating }: {
  quote: string;
  author: string;
  rating: number;
}) => (
  <div className="testimonial-card">
    <p>{quote}</p>
    <div className="testimonial-author">{author}</div>
    <div className="rating">
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </div>
  </div>
);

export const Route = createLazyFileRoute('/')({
  component: Index,
});