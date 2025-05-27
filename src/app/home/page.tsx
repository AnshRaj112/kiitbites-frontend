"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import styles from "./styles/Home.module.scss";
import { useEffect, useState } from "react";

interface College {
  fullName: string;
  slug?: string;
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace any non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
};

const Index = () => {
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/user/auth/list`);
        if (!response.ok) {
          throw new Error('Failed to fetch colleges');
        }
        const data = await response.json();
        // Add slugs to the college data
        const collegesWithSlugs = data.map((college: College) => ({
          ...college,
          slug: generateSlug(college.fullName)
        }));
        setColleges(collegesWithSlugs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, [BACKEND_URL]);

  const handleCollegeClick = (slug: string) => {
    router.push(`/home/${slug}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>Loading colleges...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>Error loading colleges</h1>
          <p className={styles.error}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Pick your college</h1>
        
        <div className={styles.collegeGrid}>
          {colleges.map((college) => (
            <div
              key={college.slug}
              className={styles.collegeCard}
              onClick={() => handleCollegeClick(college.slug!)}
            >
              <div className={styles.cardContent}>
                <span className={styles.collegeName}>{college.fullName}</span>
                <ChevronRight className={styles.chevronIcon} size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
