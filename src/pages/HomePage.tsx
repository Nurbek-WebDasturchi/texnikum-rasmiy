import { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProgramsSection from '../components/ProgramsSection';
import NewsSection from '../components/NewsSection';
import StaffSection from '../components/StaffSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import HomeDialog, { type View } from '../components/HomeDialog';
import IntroductionSection from '../components/IntroductionSection';
import AssistantWidget from '../components/AssistantWidget';
import { useTheme } from '../hooks/useTheme';
import ScrollAtmosphere from '../components/ScrollAtmosphere';

export default function HomePage() {
  const [view, setView] = useState<View | null>(null);
  const { theme, toggle } = useTheme();
  const apply = () => setView({ type: 'apply' });
  return (
    <>
      <ScrollAtmosphere />
      <Header onApply={apply} theme={theme} onToggleTheme={toggle} />
      <main>
        <Hero onApply={apply} />
        <IntroductionSection onApply={apply} />
        <ProgramsSection onOpen={(program) => setView({ type: 'info', program })} />
        <NewsSection />
        <StaffSection />
        <ContactSection />
      </main>
      <Footer />
      <HomeDialog view={view} onChange={setView} />
      <AssistantWidget onApply={apply} />
    </>
  );
}
