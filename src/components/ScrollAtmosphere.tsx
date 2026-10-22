import { useEffect } from 'react';

/** Quiet, persistent line work that responds to document scroll position. */
export default function ScrollAtmosphere() {
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const root = document.documentElement;
        const range = root.scrollHeight - window.innerHeight;
        root.style.setProperty('--scroll-progress', String(range > 0 ? window.scrollY / range : 0));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  return <div className="scroll-atmosphere" aria-hidden="true">
    <svg className="atmosphere-lines" viewBox="0 0 1440 900" preserveAspectRatio="none">
      <path d="M-40 230 C220 80 340 420 610 245 S1010 90 1480 285" />
      <path d="M-40 700 C230 520 430 850 720 650 S1160 450 1480 710" />
      <path d="M120 900 C300 730 430 730 590 900 M950 0 C1050 180 1210 190 1400 60" />
    </svg>
    <i className="atmosphere-orbit orbit-one" /><i className="atmosphere-orbit orbit-two" />
    <i className="atmosphere-node node-one" /><i className="atmosphere-node node-two" />
  </div>;
}
