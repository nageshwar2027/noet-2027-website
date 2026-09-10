import React, { useEffect, useRef, useState } from 'react';
import './Hero.css';

const VIDEO_SRC = '/assets/final_noet_video_cropped.mp4';
const POSTER_SRC = '/hero_bg.jpg';

const Hero = () => {
  const videoRef = useRef(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect and respect user's reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Resilient autoplay & loop handling (resumes on pause, ended, visibility change, and user interaction)
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || prefersReducedMotion) return undefined;

    const play = () => {
      videoEl.play().catch(() => {
        const resume = () => {
          videoEl.play().catch(() => {});
          window.removeEventListener('pointerdown', resume);
          window.removeEventListener('keydown', resume);
        };
        window.addEventListener('pointerdown', resume, { once: true });
        window.addEventListener('keydown', resume, { once: true });
      });
    };

    const handleEnded = () => {
      videoEl.currentTime = 0;
      play();
    };

    play();
    videoEl.addEventListener('ended', handleEnded);
    videoEl.addEventListener('pause', play);
    document.addEventListener('visibilitychange', play);

    return () => {
      videoEl.removeEventListener('ended', handleEnded);
      videoEl.removeEventListener('pause', play);
      document.removeEventListener('visibilitychange', play);
    };
  }, [prefersReducedMotion]);

  return (
    <section className="hero" id="home" aria-label="Conference Introduction">
      {/* Background Video with poster fallback */}
      {!prefersReducedMotion && (
        <video
          ref={videoRef}
          className="hero-video-bg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={POSTER_SRC}
          aria-hidden="true"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      )}

      {/* Cinematic dark & gradient readability overlay */}
      <div className="hero-overlay" aria-hidden="true"></div>

      {/* Hero Content */}
      <div className="container hero-content fade-in-up">
        {/* Conference Scope Badge */}
        <div className="hero-badge delay-1">
          <span className="badge-pulse" aria-hidden="true"></span>
          <span className="badge-text">National Conference</span>
        </div>

        {/* Main Conference Title (Single H1) */}
        <h1 className="hero-title delay-2">
          <span className="hero-title-accent">Net-Zero</span> Emission Technologies<br className="hero-title-break" /> for Sustainable Development
        </h1>

        {/* Subtitle / Tagline */}
        <p className="hero-tagline delay-3">
          Challenges and Opportunities <span className="hero-separator" aria-hidden="true">•</span> <span className="hero-acronym">NOET-2027</span>
        </p>

        {/* Conference Key Metadata Row (Exactly three balanced cards) */}
        <div className="hero-meta-grid delay-3">
          <div className="hero-meta-card">
            <div className="hero-meta-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="hero-meta-details">
              <span className="hero-meta-label">Conference Dates</span>
              <strong className="hero-meta-value">January 29–30, 2027</strong>
            </div>
          </div>

          <div className="hero-meta-card">
            <div className="hero-meta-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div className="hero-meta-details">
              <span className="hero-meta-label">Venue</span>
              <strong className="hero-meta-value">IIT (ISM) Dhanbad, India</strong>
            </div>
          </div>

          <a
            className="hero-meta-card hero-meta-card-link"
            href="https://www.iitism.ac.in/chemical-engineering-home"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit the official Chemical Engineering Department website at IIT (ISM) Dhanbad"
          >
            <div className="hero-meta-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <div className="hero-meta-details">
              <span className="hero-meta-label">Organized By</span>
              <strong className="hero-meta-value">Department of Chemical Engineering, IIT (ISM) Dhanbad</strong>
              <span className="visit-department">Official Department Website ↗</span>
            </div>
          </a>
        </div>

        {/* Primary Call to Action Buttons */}
        <div className="hero-cta delay-3">
          <a href="#registration" className="btn btn-hero-primary">
            <span>Register Now</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>

          <a
            href="/NOET-2027_Brochure_Final.pdf"
            download
            className="btn btn-hero-secondary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Brochure</span>
          </a>

          <a href="#about" className="btn btn-hero-ghost">
            <span>Learn More</span>
          </a>
        </div>
      </div>
      <div className="hero-side-note hero-side-note-left" aria-hidden="true">
        <span>Cleaner Processes</span>
        <span>Greener Tomorrow</span>
      </div>
      <div className="hero-side-note hero-side-note-right" aria-hidden="true">
        <span>Sustainable Industries</span>
        <span>Stronger India</span>
      </div>
      <div className="hero-bottom-strip" aria-label="Conference focus">
        <div><span className="hero-strip-icon">✦</span><span><strong>Clean Energy Innovation</strong><small>Technology for a sustainable future</small></span></div>
        <div><span className="hero-strip-icon">◌</span><span><strong>Collaborate &amp; Share</strong><small>Ideas for real-world impact</small></span></div>
        <div><span className="hero-strip-icon">◎</span><span><strong>Towards a Net-Zero World</strong><small>Science · Technology · Society</small></span></div>
      </div>
    </section>
  );
};

export default Hero;


