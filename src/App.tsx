import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { DuoIntroduction } from "./components/DuoIntroduction";
import { FeaturedProject } from "./components/FeaturedProject";
import { ProjectsGallery } from "./components/ProjectsGallery";
import { EventsTimeline } from "./components/EventsTimeline";
import { LearnSection } from "./components/LearnSection";
import { BlogSection } from "./components/BlogSection";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <FeaturedProject />
        <ProjectsGallery />
        {/* <LearnSection /> */}
        {/* <BlogSection /> */}
        <EventsTimeline />
        <DuoIntroduction />
      </main>
      <Footer />
    </div>
  );
}