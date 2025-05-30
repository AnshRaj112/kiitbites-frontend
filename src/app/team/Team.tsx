"use client";

import React, { useEffect, useState } from "react";
import TeamCard from "../components/TeamCard";
import SkeletonCard from "../components/SkeletonCard"; // Import SkeletonCard
import styles from "./styles/Team.module.scss";
import { motion } from "framer-motion";

interface TeamMember {
  name: string;
  image: string;
  github: string;
  linkedin: string;
}

const TeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/team`)
      .then((res) => res.json())
      .then((data: TeamMember[]) => {
        setTeamMembers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading team data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.teamPage}>
      <div className={styles.box}>
        <h1 className={styles.h1}>Meet Our Team</h1>
        <div className={styles.grid}>
          {loading
            ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />) // Render SkeletonCard components
            : teamMembers.map((member, index) => {
                const isTopRow = index < Math.ceil(teamMembers.length / 2);
                const delay = (isTopRow ? teamMembers.length - index - 1 : index) * 0.15;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isTopRow ? -200 : 200 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay }}
                  >
                    <TeamCard {...member} />
                  </motion.div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
