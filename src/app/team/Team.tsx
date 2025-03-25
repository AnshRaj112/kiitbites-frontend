import React, { useEffect, useState } from "react";
import TeamCard from "../components/TeamCard";
import styles from "./styles/Team.module.scss";

// Define the type for team members
interface TeamMember {
  name: string;
  github: string;
  linkedin: string;
}

const TeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetch("../data/teamCard.json")
      .then((res) => res.json())
      .then((data: TeamMember[]) => setTeamMembers(data))
      .catch((error) => console.error("Error loading team data:", error));
  }, []);

  return (
    <div className={styles.teamPage}>
      <h1 className={styles.title}>Meet Our Team</h1>
      <div className={styles.grid}>
        {teamMembers.map((member, index) => (
          <TeamCard key={index} {...member} />
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
