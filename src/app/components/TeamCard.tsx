import React from "react";
import Image from "next/image"; // Import Next.js Image component
import styles from "./styles/TeamCard.module.scss";
import { FaGithub, FaLinkedin } from "react-icons/fa";

interface TeamCardProps {
  name: string;
  image: string;
  github: string;
  linkedin: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ name, image, github, linkedin }) => {
  return (
    <div className={styles.card}>
      {/* Use Next.js Image for optimization */}
      <div className={styles.imageWrapper}>
        <Image 
          src={image} 
          alt={name} 
          width={100} 
          height={100} 
          className={styles.image}
          unoptimized // Since the image is from a backend API, it won't be optimized by default
        />
      </div>
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
