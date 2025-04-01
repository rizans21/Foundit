import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './HomePage.css';
import Cookies from 'js-cookie';

const HomePage = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCookieConsentVisible, setIsCookieConsentVisible] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user has already accepted the cookie consent
    const cookieConsent = Cookies.get('cookieConsent');
    if (!cookieConsent) {
      setIsCookieConsentVisible(true); // Show the cookie consent banner
    }

    // Check if the user is authenticated
    const authToken = Cookies.get('authToken');
    if (authToken) {
      console.log('User is logged in with token:', authToken);
    }
  }, []);

  const handleLoserMouseEnter = () => {
    setIsSearchActive(true);
    setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  const handleLoserMouseLeave = () => {
    if (!searchQuery) setIsSearchActive(false);
  };

  const handleFindersMouseEnter = () => {
    const el = document.getElementById('finders-text');
    if (el) el.innerHTML = `
      <span style="color: red; font-size: 28px; font-weight: bold;">Awesome!</span>
      <br>
      <span style="font-size: 20px; font-weight: normal;">Please click to report it.</span>
    `;
  };

  const handleFindersMouseLeave = () => {
    const el = document.getElementById('finders-text');
    if (el) el.textContent = "Found something?";
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      const query = searchQuery.trim();
      if (query) navigate(`/results/${encodeURIComponent(query)}`);
    }
  };

  // Handle cookie consent acceptance
  const handleCookieConsent = (consent) => {
    Cookies.set('cookieConsent', consent, { expires: 365 }); // Save consent decision for 365 days // Note: add your domain on this line to share cookies across all subdomains. Also add authentication token line to authenticate user for sensitive data. mainly, no backend set for functional uses yet.
    setIsCookieConsentVisible(false); // Hide the consent banner after the decision
  };
  
  // Handle logout (removing authentication token)
  const handleLogout = () => {
    Cookies.remove('authToken');
    console.log('User logged out, auth token removed.');
  };


  return (
    <div>
      <div className="container">
        {/* Lost Something Section */}
        <div
          className={`section ${isSearchActive ? 'active' : ''}`}
          id="losers"
          onMouseEnter={handleLoserMouseEnter}
          onMouseLeave={handleLoserMouseLeave}
        >
          <span id="losers-text">Lost something?</span>
          <div className="search-container">
            <input
              type="text"
              className="search-box"
              placeholder="Search lost items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              ref={searchInputRef}
              autoComplete="off"
            />
            <button className="search-button" onClick={handleSearch}>→</button>
          </div>
          <p className="search-instruction">
            eg: Black bag, Transperth bus, Midland, 15 May
          </p>
        </div>

        {/* Found Something Section */}
        <div
          className="section"
          id="finders"
          onMouseEnter={handleFindersMouseEnter}
          onMouseLeave={handleFindersMouseLeave}
          onClick={() => navigate('/form')}
        >
          <span id="finders-text">Found something?</span>
        </div>
      </div>

      {/* Cookie Consent Banner */}
      {isCookieConsentVisible && (
        <div className="cookie-consent">
          <div className="cookie-message">
            <p>
              We use cookies to ensure you get the best experience on our website.
            </p>
            <button onClick={() => handleCookieConsent('accepted')}>Accept</button>
            <button onClick={() => handleCookieConsent('declined')}>Decline</button>
          </div>
        </div>
      )}

      {/* Legal Links Section */}
      <footer className="legal-links">
        <Link to="/terms">Terms of Service</Link>
        <Link to="/privacy">Privacy Policy</Link>
      </footer>
    </div>
  );
};

export default HomePage;
