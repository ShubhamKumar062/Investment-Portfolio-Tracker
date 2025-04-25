import { useEffect, useState, useRef } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './HomePage.css'

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [chartData, setChartData] = useState([60, 75, 50, 67, 75, 100]);
  const featuresRef = useRef(null);
  const mockupRef = useRef(null);
  
  // Simulate live data updates
  useEffect(() => {
    const timer = setInterval(() => {
      const newData = chartData.map(value => {
        // Generate a new value that's within ±15% of the current value
        let change = Math.floor(Math.random() * 15) - 7;
        let newVal = value + change;
        // Keep values between 40 and 100
        return Math.max(40, Math.min(100, newVal));
      });
      setChartData(newData);
    }, 3000);
    
    return () => clearInterval(timer);
  }, [chartData]);
  
  // Animation on scroll
  useEffect(() => {
    setIsVisible(true);
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }
    
    if (mockupRef.current) {
      observer.observe(mockupRef.current);
    }
    
    return () => {
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (mockupRef.current) observer.unobserve(mockupRef.current);
    };
  }, []);
  
  return (
    <div className="app-container">
      {/* Header Component */}
      <Navbar/>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Hero Section */}
        <div className="hero-section">
          <div className={`hero-content ${isVisible ? 'fade-in-left' : ''}`}>
            <h1 className="hero-title">
              Track Your Investments<br />
              <span className="hero-title-accent">All in One Place</span>
            </h1>
            <p className="hero-description">
              Monitor stocks, cryptocurrencies, and other assets with our intuitive dashboard. 
              Make informed decisions with real-time data and performance analytics.
            </p>
            <div className="hero-buttons">
              <button 
                className="get-started-button pulse-animation"
              >
                Get Started
              </button>
              <button className="learn-more-button">
                Learn More
              </button>
            </div>
          </div>
          <div ref={mockupRef} className="mockup-container">
            <div className="dashboard-mockup">
              <div className="mockup-header">
                <span className="mockup-title">Portfolio Dashboard</span>
                <div className="window-controls">
                  <div className="control-dot red-dot"></div>
                  <div className="control-dot yellow-dot"></div>
                  <div className="control-dot green-dot"></div>
                </div>
              </div>
              <div className="mockup-content">
                <div className="portfolio-value">
                  <div className="value-header">
                    <span className="value-label">Portfolio Value</span>
                    <span className="value-change blink-green">+2.4%</span>
                  </div>
                  <div className="value-amount">$24,786.00</div>
                </div>
                <div className="chart-container">
                  <div className="chart">
                    {chartData.map((height, index) => (
                      <div 
                        key={index} 
                        className="chart-bar animated-bar" 
                        style={{ 
                          height: `${height}%`, 
                          backgroundColor: height > 75 ? '#1d4ed8' : height > 60 ? '#2563eb' : '#60a5fa',
                          transitionDelay: `${index * 0.1}s` 
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="asset-list">
                  <div className="asset-item slide-in-right" style={{ animationDelay: '0.2s' }}>
                    <div className="asset-info">
                      <div className="asset-icon stock-icon">S</div>
                      <span className="asset-name">AAPL</span>
                    </div>
                    <div className="stock-change">+1.2%</div>
                  </div>
                  <div className="asset-item slide-in-right" style={{ animationDelay: '0.4s' }}>
                    <div className="asset-info">
                      <div className="asset-icon crypto-icon">C</div>
                      <span className="asset-name">BTC</span>
                    </div>
                    <div className="crypto-change">-0.8%</div>
                  </div>
                  <div className="asset-item slide-in-right" style={{ animationDelay: '0.6s' }}>
                    <div className="asset-info">
                      <div className="asset-icon etf-icon">E</div>
                      <span className="asset-name">SPY</span>
                    </div>
                    <div className="stock-change">+0.5%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div ref={featuresRef} className="features-section">
          <h2 className="features-title">
            Powerful Features for Smart Investors
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-container analytics-icon-bg">
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="feature-title">Real-time Analytics</h3>
              <p className="feature-description">Monitor your investments with live updates and comprehensive performance metrics.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-container distribution-icon-bg">
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="feature-title">Portfolio Distribution</h3>
              <p className="feature-description">Visualize your asset allocation and diversification with interactive charts.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-container dashboard-icon-bg">
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="feature-title">Customizable Dashboard</h3>
              <p className="feature-description">Personalize your portfolio view with draggable widgets and custom filters.</p>
            </div>
          </div>
        </div>

        {/* New Section: Market Updates */}
        <div className="market-updates-section">
          <h2 className="section-title">Market Updates</h2>
          <div className="market-ticker">
            <div className="ticker-content">
              <div className="ticker-item">
                <span className="ticker-symbol">AAPL</span>
                <span className="ticker-price">$178.72</span>
                <span className="ticker-change positive">+1.2%</span>
              </div>
              <div className="ticker-item">
                <span className="ticker-symbol">MSFT</span>
                <span className="ticker-price">$325.16</span>
                <span className="ticker-change positive">+0.8%</span>
              </div>
              <div className="ticker-item">
                <span className="ticker-symbol">GOOGL</span>
                <span className="ticker-price">$142.38</span>
                <span className="ticker-change negative">-0.4%</span>
              </div>
              <div className="ticker-item">
                <span className="ticker-symbol">BTC</span>
                <span className="ticker-price">$63,421</span>
                <span className="ticker-change positive">+2.3%</span>
              </div>
              <div className="ticker-item">
                <span className="ticker-symbol">ETH</span>
                <span className="ticker-price">$3,542</span>
                <span className="ticker-change positive">+1.7%</span>
              </div>
            </div>
          </div>
        </div>

        {/* New Section: Testimonials */}
        <div className="testimonials-section">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonials-container">
            <div className="testimonial-card">
              <div className="testimonial-content">
                "InvestTrack has completely transformed how I manage my investments. The real-time analytics and intuitive interface make tracking my portfolio effortless."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div className="author-info">
                  <div className="author-name">Jane Doe</div>
                  <div className="author-title">Retail Investor</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                "As a financial advisor, I recommend InvestTrack to all my clients. The comprehensive analytics and portfolio visualization tools are unmatched."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">JS</div>
                <div className="author-info">
                  <div className="author-name">John Smith</div>
                  <div className="author-title">Financial Advisor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* New Section: Call to Action */}
        <div className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Take Control of Your Investments?</h2>
            <p className="cta-description">Join thousands of investors who are making smarter decisions with InvestTrack.</p>
            <button className="cta-button pulse-animation">Sign Up Now - Free for 30 Days</button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">InvestTrack</h3>
            <p className="footer-description">Your all-in-one investment tracking solution.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-heading">Product</h4>
              <ul className="footer-list">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#testimonials">Testimonials</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-list">
                <li><a href="#blog">Blog</a></li>
                <li><a href="#guides">Guides</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-list">
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#careers">Careers</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">© 2025 InvestTrack. All rights reserved.</p>
          <div className="footer-socials">
            <a href="#" className="social-icon">
              <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;