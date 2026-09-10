import React from 'react';
import './Committees.css';

const OFFICIAL_DEPT = 'https://www.iitism.ac.in/chemical-engineering-home';

// Only the conference conveners/co-conveners receive photographic cards.
// All other committee members remain intentionally text-first for a cleaner,
// more authentic conference-programme presentation.
const conveners = [
  {
    name: 'Prof. Paidinaidu Paluri',
    role: 'Convener',
    institution: 'Department of Chemical Engineering, IIT (ISM) Dhanbad',
    image: 'https://www.iitism.ac.in/facultyImages/Prof.%20Paidinaidu%20Paluri.jpg',
    profile: 'https://www.iitism.ac.in/faculty-details?faculty=naidu',
  },
  {
    name: 'Prof. Arunkumar Samanta',
    role: 'Co-Convener',
    institution: 'Department of Chemical Engineering, IIT (ISM) Dhanbad',
    image: 'https://www.iitism.ac.in/storage/FacultyDetails/IMG_173925762967aaf71d8b1b4.jpg',
    profile: 'https://www.iitism.ac.in/faculty-details?faculty=asamanta',
  },
  {
    name: 'Prof. Lutukurthi D N V V Konda',
    role: 'Co-Convener',
    institution: 'Department of Chemical Engineering, IIT (ISM) Dhanbad',
    image: 'https://www.iitism.ac.in/facultyImages/Prof.%20Lutukurthi%20D%20N%20V%20V%20Konda.jpg',
    profile: 'https://www.iitism.ac.in/faculty-details?faculty=dnvvkonda',
  },
];

const coreMembers = [
  'Prof. Aritra Santra',
  'Prof. Bidhan Chandra',
  'Prof. Ejaz Ahmad',
  'Prof. Khantesh Agrawal',
  'Prof. Krishna Sandilya Durbha',
  'Prof. Mahendra N Nandanwar',
  'Prof. Pantula D Priyanka',
  'Prof. Sandip Mandal',
  'Prof. Siddhartha Sengupta',
  'Prof. Soubhik Kumar Bhaumik',
  'Prof. Soumyajit Sen Gupta',
  'Prof. Sourav Sengupta',
  'Prof. Suman Dutta',
  'Prof. Suresh Kumar Yatirajula',
  'Dr. Tapas Kumar Mondal',
];

const advisoryMembers = [
  ['Shri Anand Mohan', 'Director (Technical / R&D & T, BD), CMPDIL, Ranchi'],
  ['Prof. Arvind Rajendran', 'University of Alberta, Canada'],
  ['Prof. Bishnupada Mandal', 'IIT Guwahati'],
  ['Shri Dinesh Kumar Gangwal', 'Chief - O&M Services, MPL, Dhanbad'],
  ['Prof. Goutam Deo', 'IIT Kanpur'],
  ['Prof. Kishalay Mitra', 'IIT Hyderabad'],
  ['Dr. (Mrs.) Malti Goel', 'President, Climate Change Research Institute, Delhi'],
  ['Dr. Pinaki Sarkar', 'Senior Scientist, CSIR-CIMFR, Dhanbad'],
  ['Dr. Pratik Swarup Dash', 'Chief, Sustainability Research Group, R&D, Tata Steel, Jamshedpur'],
  ['Prof. Preeti Aghalayam', 'IIT Madras'],
  ['Prof. Rajender Gupta', 'University of Alberta, Canada'],
  ['Prof. Sankar Bhattacharya', 'Monash University, Australia'],
  ['Prof. Sarma V. Pisupati', 'The Pennsylvania State University, USA'],
  ['Prof. Srinivasakannan Chandrasekar', 'Khalifa University, Abu Dhabi, UAE'],
  ['Prof. Suddhasatwa Basu', 'IIT Delhi'],
  ['Prof. Vikram Vishal', 'IIT Bombay'],
  ['Dr. Vinay Amte', 'Reliance Industries Limited'],
];

const ConvenerCard = ({ member, index }) => (
  <article className="convener-person-card fade-in-up" style={{ '--card-delay': `${index * 90}ms` }}>
    <div className="convener-photo-wrap">
      <img
        src={member.image}
        alt={`${member.name} — ${member.role}, IIT (ISM) Dhanbad`}
        className="convener-photo"
        loading={index === 0 ? 'eager' : 'lazy'}
        referrerPolicy="no-referrer"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
          const fallback = event.currentTarget.nextElementSibling;
          if (fallback) fallback.style.display = 'grid';
        }}
      />
      <div className="convener-photo-fallback" aria-hidden="true">{member.name.replace(/^Prof\.\s*/i, '').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</div>
      <span className="convener-role-badge">{member.role}</span>
    </div>
    <div className="convener-person-body">
      <span className="committee-person-role">{member.role}</span>
      <h4>{member.name}</h4>
      <p>{member.institution}</p>
      <a href={member.profile} target="_blank" rel="noopener noreferrer" className="committee-profile-link">
        Official IIT(ISM) Profile <span aria-hidden="true">↗</span>
      </a>
    </div>
  </article>
);

const Committees = () => (
  <section id="committees" className="committees-section">
    <div className="container">
      <div className="committee-heading fade-in-up">
        <span className="section-eyebrow">Leadership &amp; Governance</span>
        <h2>Organizing Committee</h2>
        <p>Conference leadership and committee members for NOET-2027.</p>
      </div>

      <div className="committee-tier committee-chief glass fade-in-up">
        <span className="committee-tier-label">Chief Patron</span>
        <h3>Prof. Prem Vrat</h3>
        <p>Chairman, IIT (ISM) Dhanbad</p>
      </div>

      <div className="committee-grid committee-leadership">
        <div className="committee-card glass fade-in-up delay-1">
          <span className="committee-tier-label">Patron</span>
          <h3>Prof. Sukumar Misra</h3>
          <p>Director, IIT (ISM) Dhanbad</p>
        </div>
        <div className="committee-card glass fade-in-up delay-2">
          <span className="committee-tier-label">Co-Patron</span>
          <h3>Prof. Sarat Kumar Das</h3>
          <p>Dy. Director, IIT (ISM) Dhanbad</p>
        </div>
        <div className="committee-card glass fade-in-up delay-3">
          <span className="committee-tier-label">Chairman</span>
          <h3>Prof. Aditya Kumar</h3>
          <p>Head, Chemical Engineering</p>
        </div>
      </div>

      <div className="committee-convener-heading fade-in-up">
        <span className="section-eyebrow">Conference Leadership</span>
        <h3>Conveners &amp; Co-Conveners</h3>
        <p>Official IIT (ISM) faculty photographs are shown only for the conference conveners.</p>
      </div>

      <div className="convener-people-grid">
        {conveners.map((member, index) => <ConvenerCard key={member.name} member={member} index={index} />)}
      </div>

      <div className="committee-department-link glass fade-in-up">
        <div>
          <span className="committee-tier-label">Organized By</span>
          <strong>Department of Chemical Engineering, IIT (ISM) Dhanbad</strong>
        </div>
        <a href={OFFICIAL_DEPT} target="_blank" rel="noopener noreferrer">
          Official Department Website ↗
        </a>
      </div>

      <div className="committee-section-intro fade-in-up">
        <span className="section-eyebrow">Core Team</span>
        <h3>Core Committee</h3>
        <p>A clean text-first listing keeps the committee section formal and easy to scan.</p>
      </div>

      <div className="committee-simple-grid fade-in-up">
        {coreMembers.map((name) => <div className="committee-simple-item" key={name}>{name}</div>)}
      </div>

      <div className="committee-lists fade-in-up delay-1">
        <div className="committee-list glass">
          <h3>Advisory Committee</h3>
          <ul>
            {advisoryMembers.map(([name, role]) => (
              <li key={name}><strong>{name}</strong><span>{role}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default Committees;
