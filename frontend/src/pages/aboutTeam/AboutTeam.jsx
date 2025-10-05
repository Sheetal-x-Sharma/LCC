import React from 'react';
import './AboutTeam.scss';
import teamData from './teamData';
import { FaLinkedin, FaEnvelope } from 'react-icons/fa';


const AboutTeam = () => {
  const mentors = teamData.filter(member => member.role.includes('Mentor') || member.role.includes('Supervisor'));
  const developers = teamData.filter(member => member.role.includes('Developer') || member.role.includes('Designer'));


  return (
    <section className="about-team themed">
     
      <h1 className="teamHeading">
        MEET <span>OUR</span> TEAM
      </h1>


      <div className="subheading">Mentors</div>
      <div className="team-cards-container">
        {mentors.map((member, index) => (
          <div key={index} className={`team-card themed ${member.color}`}>
            <div className="card-inner">
              <img src={member.image} alt={member.name} className="team-image" />
              <div className="team-info">
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.desig}</p>
                <p className="team-role">{member.role}</p>
                <div className="team-links">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                      <FaLinkedin className="icon" />
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`}>
                      <FaEnvelope className="icon" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      <div className="subheading">Developer</div>
      <div className="team-cards-container">
        {developers.map((member, index) => (
        <div key={index} className={`team-card developer-card themed ${member.color}`}>

            <div className="card-inner">
              <img src={member.image} alt={member.name} className="team-image" />
              <div className="team-info">
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <div className="team-links">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                      <FaLinkedin className="icon" />
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`}>
                      <FaEnvelope className="icon" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      <footer className="team-footer themed">
        <div className="footer-divider"></div>
        <div className="footer-content">
          <p className="footer-title">For any queries, reach us at:</p>
          <a href="mailto:lnmiitcampusconnect@gmail.com" className="footer-link">
            <FaEnvelope className="footer-icon" />
            lnmiitcampusconnect@gmail.com
          </a>
        </div>
        <p className="copyright">© 2025 LUCS. All rights reserved.</p>
      </footer>
    </section>
  );
};


export default AboutTeam;





