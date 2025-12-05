import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { DuoIntroduction } from "./components/DuoIntroduction";
import { FeaturedProject } from "./components/FeaturedProject";
import { ProjectsGallery } from "./components/ProjectsGallery";
import { EventsTimeline } from "./components/EventsTimeline";
import { Services } from "./components/Services";
import { ProfileReview } from "./components/ProfileReview";
import { Mentorship } from "./components/Mentorship";
import { DataStructureAlgorithm } from "./components/DataStructureAlgorithm";
import { SystemDesign } from "./components/SystemDesign";
import { LearnSection } from "./components/LearnSection";
import { BlogSection } from "./components/BlogSection";
import { Footer } from "./components/Footer";

export default function App() {
  const [currentService, setCurrentService] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#services/')) {
        const serviceId = hash.replace('#services/', '');
        setCurrentService(serviceId);
      } else if (hash === '#services') {
        setCurrentService(null);
      } else {
        setCurrentService(null);
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderServicePage = () => {
    switch (currentService) {
      case 'profile-review':
        return <ProfileReview />;
      case 'mentorship':
        return <Mentorship />;
      case 'leetcoding':
        return <DataStructureAlgorithm />;
      case 'system-design':
        return <SystemDesign />;
      default:
        return <Services />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {currentService ? (
          // Show individual service page
          renderServicePage()
        ) : (
          // Show main page with Services section
          <>
            <Hero />
            <FeaturedProject />
            <ProjectsGallery />
            {/* <LearnSection /> */}
            {/* <BlogSection /> */}
            <EventsTimeline />
            <Services />
            <DuoIntroduction />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}