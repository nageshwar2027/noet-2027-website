import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-content fade-in-up">
          <div className="about-text glass highlight-section">
            <h2 className="conference-title">About the Conference</h2>
            <p className="lead-text">
              Net-zero emissions refer to balancing anthropogenic greenhouse gas (GHG) emissions with their removal from the atmosphere. Achieving this balance is essential for sustainable development and limiting global warming. The transition to a net-zero future requires transformative technologies that decarbonize energy, industrial, and transportation systems while minimizing carbon dioxide (CO₂) emissions. Emerging technologies such as carbon capture, utilization, and storage (CCUS), direct air capture (DAC), green hydrogen, renewable energy, bioenergy, advanced energy storage, separation processes, and artificial intelligence for energy optimization are expected to play a crucial role in this transition. However, significant technical, economic, and policy challenges remain, necessitating interdisciplinary research and strong collaboration among academia, industry, and government. 
            </p>
            <p className="lead-text">
              The Two-Day National Conference on Net-Zero Emission Technologies for Sustainable Development: Challenges and Opportunities (NOET–2027) provides a platform for researchers, academicians, industry professionals, policymakers, and students to exchange ideas, present cutting-edge research, and explore innovative solutions for a low-carbon future. The conference aims to promote scientific collaboration and technological advancements that support India's Net-zero 2070 commitment and contribute to achieving the Paris Agreement goal of limiting the global temperature rise to 1.5 °C.
            </p>
          </div>
        </div>

        <div className="about-content fade-in-up delay-1 reverse mt-4">
          <div className="about-text glass subdued-section">
            <h3 className="department-title">About the Department</h3>
            <p>Since its inception in 2010, the department aimed to instill in all the students the essential skills of critical thinking, and creative problem-solving for their success in the practice of chemical engineering.</p>
            <p>The department offers academic and research programs leading to B.Tech, M.Tech, and PhD degrees. Many of the graduated students are placed in reputed national and multinational organizations such as IOCL, BPCL, ONGC, GAIL, Reliance Industries Ltd, L&T, Vedanta, Haldia Petrochemicals Ltd, and Aditya Birla.</p>
            <p>The department strongly emphasizes developing and maintaining strong collaborative and cooperative links with private and public sector industries, R&D houses, government user departments as well as premier academic and research institutions within the country and abroad for the advancement of knowledge and the benefit of society.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
