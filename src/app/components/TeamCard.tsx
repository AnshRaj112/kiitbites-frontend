import React from "react";
import styles from "./styles/TeamCard.module.scss";
import { FaGithub, FaLinkedin } from "react-icons/fa";

interface TeamCardProps {
  name: string;
  github: string;
  linkedin: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ name, github, linkedin }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.name}>{name}</h2>
      <div className={styles.links}>
        <a href={github} target="_blank" rel="noopener noreferrer">
          <FaGithub className={styles.icon} />
        </a>
        <a href={linkedin} target="_blank" rel="noopener noreferrer">
          <FaLinkedin className={styles.icon} />
        </a>
      </div>
    </div>
  );
};

export default TeamCard;
