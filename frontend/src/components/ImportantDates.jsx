import React from 'react';
import './ImportantDates.css';

const ImportantDates = () => {
  const dates = [
    { event: "Commencement of Abstract Submission", date: "5 September 2026" },
    { event: "Abstract Submission Deadline", date: "27 November 2026" },
    { event: "Acceptance of Abstract", date: "7 December 2026" },
    { event: "Submission Deadline of Full-length Manuscript", date: "4 January 2027" },
    { event: "Commencement of Registration", date: "8 December 2026" },
    { event: "Online Registration Deadline", date: "20 January 2027" },
    { event: "Conference Date", date: "29 - 30 January 2027" },
  ];

  return (
    <section id="dates" className="dates-section">
      <div className="container">
        <div id="announcements" className="announcements glass fade-in-up" style={{marginBottom: '3rem', padding: '1.5rem', borderLeft: '4px solid var(--highlight-color)'}}>
          <h3 style={{color: 'var(--highlight-color)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <span style={{fontSize: '1.5rem'}}>📢</span> Announcements
          </h3>
          <p style={{margin: '0.5rem 0 0 0', color: 'var(--text-color)'}}>
            Dates shown here follow the official NOET-2027 conference brochure. Please check this website for future notices or revisions.
          </p>
        </div>
        <h2 className="fade-in-up">Important Dates</h2>
        <div className="timeline">
          {dates.map((item, index) => (
            <div key={index} className={`timeline-item glass fade-in-up delay-${(index % 3) + 1}`}>
              <div className="timeline-date">{item.date}</div>
              <div className="timeline-content">
                <h3>{item.event}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImportantDates;
