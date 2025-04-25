import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Icon } from './Icon';
import s from './join-nexus-club.module.scss';

// Ensure GSAP plugins are registered
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ICON_CATEGORIES = [
  { id: 'all', label: 'All Icons' },
  { id: 'business', label: 'Business' },
  { id: 'finance', label: 'Finance' },
  { id: 'technology', label: 'Technology' },
  { id: 'security', label: 'Security' },
  { id: 'communication', label: 'Communication' }
];

// Fallback icon path
const FALLBACK_ICON = '/favicon-32x32.png';

// Sample icons data with fallback
const ICONS_DATA = [
  { id: 1, name: 'Briefcase', category: 'business', path: '/favicon-32x32.png' },
  { id: 2, name: 'Chart', category: 'finance', path: '/favicon-32x32.png' },
  { id: 3, name: 'Lock', category: 'security', path: '/favicon-32x32.png' },
  { id: 4, name: 'Laptop', category: 'technology', path: '/favicon-32x32.png' },
  { id: 5, name: 'Message', category: 'communication', path: '/favicon-32x32.png' },
  { id: 6, name: 'Document', category: 'business', path: '/favicon-32x32.png' },
  { id: 7, name: 'Card', category: 'finance', path: '/favicon-32x32.png' },
  { id: 8, name: 'Shield', category: 'security', path: '/favicon-32x32.png' },
  { id: 9, name: 'Server', category: 'technology', path: '/favicon-32x32.png' },
  { id: 10, name: 'Chat', category: 'communication', path: '/favicon-32x32.png' },
  { id: 11, name: 'Handshake', category: 'business', path: '/favicon-32x32.png' },
  { id: 12, name: 'Money', category: 'finance', path: '/favicon-32x32.png' },
];

export const IconBrowser = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredIcons, setFilteredIcons] = useState(ICONS_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const browserRef = useRef(null);
  const iconsGridRef = useRef(null);
  
  // Filter icons based on selected category and search term
  useEffect(() => {
    let filtered = ICONS_DATA;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(icon => icon.category === selectedCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        icon => icon.name.toLowerCase().includes(term) || 
                icon.category.toLowerCase().includes(term)
      );
    }
    
    setFilteredIcons(filtered);
    
    // Animate icons appearing when filter changes
    if (iconsGridRef.current) {
      const iconElements = iconsGridRef.current.querySelectorAll('.icon-item');
      
      if (iconElements.length > 0) {
        gsap.fromTo(
          iconElements,
          { 
            opacity: 0,
            y: 20,
            scale: 0.9
          },
          { 
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.05,
            duration: 0.4,
            ease: 'power2.out'
          }
        );
      }
    }
  }, [selectedCategory, searchTerm]);
  
  // Animation for browser entrance
  useEffect(() => {
    if (!browserRef.current) return;
    
    const browser = browserRef.current;
    
    // Initial state
    gsap.set(browser, { 
      y: 100, 
      opacity: 0 
    });
    
    // Entrance animation
    gsap.to(browser, {
      scrollTrigger: {
        trigger: browser,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out'
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={s.iconBrowser} ref={browserRef}>
      <div className={s.browserHeader}>
        <h3 className={s.browserTitle}>Icon Browser</h3>
        <div className={s.browserSearch}>
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={s.searchInput}
          />
        </div>
      </div>
      
      <div className={s.categoryTabs}>
        {ICON_CATEGORIES.map(category => (
          <button
            key={category.id}
            className={`${s.categoryTab} ${selectedCategory === category.id ? s.activeTab : ''}`}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
      
      <div className={s.iconsGrid} ref={iconsGridRef}>
        {filteredIcons.length > 0 ? (
          filteredIcons.map(icon => (
            <div key={icon.id} className={`${s.iconItem} icon-item`}>
              <Icon name={icon.name} path={icon.path} />
              <span className={s.iconName}>{icon.name}</span>
            </div>
          ))
        ) : (
          <div className={s.noResults}>
            <p>No icons found. Try a different search term or category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IconBrowser; 