import React, { useEffect, useRef } from 'react';
import './AboutUs.css';
import Navbar from '../../components/Navbar/Navbar';
const AboutUs = () => {
  
    


  return (
    <div className="app-container about-page">
      <Navbar/>
      
      <main className="about-content">
        {/* Hero Section */}
        <div className="about-hero">
          <div className="hero-overlay"></div>
          <div className="about-hero-content fade-in-up">
            <h1 className="about-title">About InvestTrack</h1>
            <p className="about-subtitle">Empowering investors with intelligent tools since 2020</p>
          </div>
        </div>
        
        {/* Our Mission Section */}
        <section className="mission-section" ref={missionRef}>
          <div className="mission-content">
            <h2 className="section-title">Our Mission</h2>
            <p className="mission-statement">
              To provide transparent, data-driven investment tools that help individuals
              make informed financial decisions.
            </p>
          </div>
        </section>
        
        {/* Our Team Section */}
        <section ref={teamRef} className="about-section team-section">
          <h2 className="section-title centered">Meet Our Team</h2>
          <p className="section-subtitle">Passionate experts building the future of investment tracking</p>
          
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <div className="member-placeholder">JS</div>
              </div>
              <h3 className="member-name">Jennifer Smith</h3>
              <p className="member-title">Founder & CEO</p>
              <p className="member-bio">Former investment banker with 15 years of experience in financial markets. Jennifer founded InvestTrack to bring professional-grade tools to everyday investors.</p>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <div className="member-placeholder">MR</div>
              </div>
              <h3 className="member-name">Michael Rodriguez</h3>
              <p className="member-title">Chief Technology Officer</p>
              <p className="member-bio">Fintech pioneer with expertise in data visualization and financial analytics. Previously led engineering teams at major trading platforms.</p>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <div className="member-placeholder">AK</div>
              </div>
              <h3 className="member-name">Aisha Khan</h3>
              <p className="member-title">Head of Product</p>
              <p className="member-bio">With a background in UX design and financial services, Aisha ensures our products are both powerful and accessible to users of all experience levels.</p>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <div className="member-placeholder">DW</div>
              </div>
              <h3 className="member-name">David Wong</h3>
              <p className="member-title">Financial Research Director</p>
              <p className="member-bio">Former quantitative analyst with a PhD in Financial Economics. David leads our efforts to provide users with meaningful insights and analysis.</p>
            </div>
          </div>
        </section>
        
        {/* Our Story Timeline */}
        <section ref={timelineRef} className="about-section timeline-section">
          <h2 className="section-title centered">Our Journey</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3 className="timeline-year">2020</h3>
                <h4 className="timeline-title">The Beginning</h4>
                <p className="timeline-text">InvestTrack was founded with a vision to democratize financial tools. Our first prototype was developed, focusing on stock portfolio tracking.</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3 className="timeline-year">2021</h3>
                <h4 className="timeline-title">Expanding Capabilities</h4>
                <p className="timeline-text">Added cryptocurrency tracking, advanced analytics, and launched our mobile app. Our user base grew to over 50,000 investors.</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3 className="timeline-year">2023</h3>
                <h4 className="timeline-title">Going Global</h4>
                <p className="timeline-text">Expanded to international markets and added support for multiple currencies and global exchanges. Reached our first 100,000 active users.</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3 className="timeline-year">2025</h3>
                <h4 className="timeline-title">Today & Beyond</h4>
                <p className="timeline-text">With over 250,000 users worldwide, we continue to innovate with AI-powered insights and predictive analytics to help investors make smarter decisions.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section ref={valuesRef} className="about-section values-section">
          <h2 className="section-title centered">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon transparency-icon">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="value-title">Transparency</h3>
              <p className="value-description">We believe in complete transparency in everything we do, from our pricing to how we handle your data.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon innovation-icon">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="value-title">Innovation</h3>
              <p className="value-description">We continuously push the boundaries of what's possible to provide cutting-edge tools for modern investors.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon accessibility-icon">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="value-title">Accessibility</h3>
              <p className="value-description">We design our products to be intuitive and accessible to users of all experience levels and backgrounds.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon security-icon">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="value-title">Data Security</h3>
              <p className="value-description">The security of your financial data is our top priority. We implement industry-leading security measures to protect your information.</p>
            </div>
          </div>
        </section>
        
        {/* Join Our Team Section */}
        <section className="about-section join-team-section">
          <div className="join-content">
            <h2 className="join-title">Join Our Team</h2>
            <p className="join-description">
              We're always looking for talented individuals who are passionate about fintech and helping others achieve their financial goals.
            </p>
            <a href="/careers" className="careers-button">View Open Positions</a>
          </div>
        </section>
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

export default AboutUs;