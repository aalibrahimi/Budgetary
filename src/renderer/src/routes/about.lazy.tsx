import { createLazyFileRoute } from '@tanstack/react-router';
import { Wallet, PieChart, Bell, TrendingUp, Sparkles, Target, Quote } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(10, 10, 10)', color: 'rgb(250, 125, 125)' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Title Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl mb-6">
              <span style={{ color: '#40E0D0' }}>Take Control of Your Money with </span>
              <span style={{ color: '#FF6B6B' }}>Budgetary</span>
            </h1>
            <p className="text-xl mx-auto max-w-3xl" style={{ color: '#F0F8FF' }}>
              Your financial journey reimagined. Experience a new way of managing expenses 
              with intelligent tracking, real-time alerts, and personalized insights.
            </p>
          </div>

          {/* Story Section */}
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl p-8 shadow-xl" 
                 style={{ backgroundColor: 'rgba(47, 79, 79, 0.1)', border: '1px solid rgba(64, 224, 208, 0.2)' }}>
              <div className="flex items-start mb-6">
                <Quote className="h-8 w-8 mr-4 flex-shrink-0 mt-1" style={{ color: '#40E0D0' }} />
                <h2 className="text-2xl font-semibold" style={{ color: '#40E0D0' }}>
                  Our Story
                </h2>
              </div>

              <div className="space-y-6" style={{ color: '#F0F8FF' }}>
                <p className="leading-relaxed">
                  The idea for Budgetary came to me when I noticed how many of my friends and family 
                  struggled to keep tabs on their finances. I wanted to create something user-friendly 
                  and accessible that would not only help people understand their spending habits but 
                  also empower them to make smarter financial decisions.
                </p>

                <p className="leading-relaxed">
                  With Budgetary, I aim to bridge the gap between technology and financial literacy, 
                  making budgeting an easy and stress-free experience for everyone. My goal is to turn 
                  something that often feels overwhelming into a tool for growth and success.
                </p>

                <p className="leading-relaxed">
                  Budgetary is an innovative financial management app that gives you complete control 
                  of your financial future. It uses AI-powered insights, interactive and customizable 
                  displays, smart reminders, and real-time personalized financial analysis to help you 
                  master your finances.
                </p>

                <div className="pt-6 border-t" style={{ borderColor: 'rgba(64, 224, 208, 0.2)' }}>
                  <p className="font-semibold" style={{ color: '#40E0D0' }}>
                    Take control of your money with Budgetary - your financial journey, reimagined.
                  </p>
                  <p className="mt-2" style={{ color: '#F0F8FF' }}>
                    — Ali Alibrahimi, Founder
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard 
            icon={<PieChart className="h-8 w-8" style={{ color: '#40E0D0' }} />}
            title="Smart Analytics"
            description="Visual breakdowns of your spending patterns with dynamic charts and AI-powered insights."
          />
          <FeatureCard 
            icon={<Bell className="h-8 w-8" style={{ color: '#40E0D0' }} />}
            title="Threshold Alerts"
            description="Get notified before you exceed your budget with customizable spending alerts."
          />
          <FeatureCard 
            icon={<Sparkles className="h-8 w-8" style={{ color: '#40E0D0' }} />}
            title="AI Recommendations"
            description="Receive personalized savings suggestions based on your spending habits."
          />
          <FeatureCard 
            icon={<Target className="h-8 w-8" style={{ color: '#40E0D0' }} />}
            title="Goal Setting"
            description="Set and track financial goals with visual progress indicators."
          />
        </div>
      </div>

      {/* Interactive Feature Display */}
      <div className="py-16" style={{ backgroundColor: 'rgba(47, 79, 79, 0.1)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#40E0D0' }}>
              Why Budgetary Stands Out
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <HighlightCard
              title="Real-Time Tracking"
              description="Monitor your expenses as they happen. No more end-of-month surprises."
              icon={<TrendingUp className="h-12 w-12" style={{ color: '#FF6B6B' }} />}
            />
            <HighlightCard
              title="Smart Categories"
              description="Automatic categorization of expenses using AI technology."
              icon={<Wallet className="h-12 w-12" style={{ color: '#FF6B6B' }} />}
            />
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-8" style={{ color: '#40E0D0' }}>
              Start Your Financial Journey Today
            </h2>
            <button className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: '#FF6B6B', color: '#F0F8FF' }}>
              Get Started Now
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: 'rgba(47, 79, 79, 0.1)' }}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-6">
            <a
              href="https://github.com/aalibrahimi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              View on GitHub
            </a>
          </div>
          <div className="text-center mt-4 text-gray-400">
            &copy; 2025 Budgetary Tracker. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="relative rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-2"
         style={{ backgroundColor: 'rgba(47, 79, 79, 0.1)', border: '1px solid rgba(64, 224, 208, 0.2)' }}>
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold" style={{ color: '#40E0D0' }}>{title}</h3>
      <p className="mt-4" style={{ color: '#F0F8FF' }}>{description}</p>
    </div>
  );
};

const HighlightCard = ({ icon, title, description }) => {
  return (
    <div className="flex items-center space-x-6 p-6 rounded-xl transition-transform duration-300 hover:scale-105"
         style={{ backgroundColor: 'rgba(47, 79, 79, 0.2)', border: '1px solid rgba(64, 224, 208, 0.3)' }}>
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#40E0D0' }}>{title}</h3>
        <p style={{ color: '#F0F8FF' }}>{description}</p>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute('/about')({
  component: About
});