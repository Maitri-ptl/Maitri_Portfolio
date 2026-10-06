import { useEffect, useState } from 'react';

// Tracks which of the given section IDs is currently most visible in the
// viewport, so the Navbar can highlight the matching link. Uses
// IntersectionObserver instead of a scroll listener because it's cheaper
// (the browser notifies us only when visibility actually changes) and
// avoids manual scroll-position math.
const useScrollSpy = (sectionIds, options = { rootMargin: '-40% 0px -55% 0px' }) => {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, options);

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(',')]);

  return activeId;
};

export default useScrollSpy;
