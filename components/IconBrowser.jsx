import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from '../pages/home/home.module.scss';
import { filterIcons, formatIconName, copyToClipboard, generateIconUsageExample, hapticFeedback, createIconAnimationVariants } from '../utils/iconUtils';

// Dynamic import all icons
const iconContext = require.context('../icons', false, /\.svg$/);
const iconComponents = {};

// Process all icons
iconContext.keys().forEach((key) => {
  const iconName = key.replace(/^\.\/(.*)\.svg$/, '$1');
  iconComponents[iconName] = iconContext(key).default;
});

const IconBrowser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedIcon, setCopiedIcon] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Categories
  const categories = useMemo(() => {
    const cats = {
      all: 'All Icons',
      social: 'Social Media',
      ui: 'UI Elements',
      arrow: 'Arrows',
      business: 'Business',
    };

    // Auto-categorize icons based on name patterns
    Object.keys(iconComponents).forEach(name => {
      if (name.includes('facebook') || name.includes('twitter') || name.includes('instagram')) {
        cats.social = 'Social Media';
      } else if (name.includes('arrow') || name.includes('chevron')) {
        cats.arrow = 'Arrows';
      } else if (name.includes('button') || name.includes('menu') || name.includes('close')) {
        cats.ui = 'UI Elements';
      } else if (name.includes('chart') || name.includes('graph') || name.includes('document')) {
        cats.business = 'Business';
      }
    });

    return cats;
  }, []);

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    let icons = filterIcons(iconComponents, searchTerm);
    
    if (selectedCategory !== 'all') {
      icons = icons.filter(name => {
        if (selectedCategory === 'social') {
          return name.includes('facebook') || name.includes('twitter') || name.includes('instagram');
        } else if (selectedCategory === 'arrow') {
          return name.includes('arrow') || name.includes('chevron');
        } else if (selectedCategory === 'ui') {
          return name.includes('button') || name.includes('menu') || name.includes('close');
        } else if (selectedCategory === 'business') {
          return name.includes('chart') || name.includes('graph') || name.includes('document');
        }
        return true;
      });
    }
    
    return icons;
  }, [searchTerm, selectedCategory]);

  // Handle icon click - copy to clipboard
  const handleIconClick = async (iconName) => {
    hapticFeedback('light');
    const success = await copyToClipboard(generateIconUsageExample(iconName));
    
    if (success) {
      setCopiedIcon(iconName);
      setTimeout(() => setCopiedIcon(null), 2000);
    }
  };

  // Toggle expansion of the browser
  const toggleExpansion = () => {
    hapticFeedback('medium');
    setIsExpanded(!isExpanded);
  };

  // Container variants
  const containerVariants = {
    collapsed: { 
      maxHeight: "100px",
      overflow: "hidden"
    },
    expanded: { 
      maxHeight: "2000px",
      overflow: "visible"
    }
  };

  return (
    <section ref={ref} className={styles.iconBrowserSection}>
      <div className={styles.iconBrowserHeader}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        >
          Premium Icon System
        </motion.h2>
        
        <motion.button
          className={styles.iconBrowserToggle}
          onClick={toggleExpansion}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isExpanded ? 'Hide Icons' : 'Browse Icons'}
        </motion.button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={styles.iconBrowserContainer}
            variants={containerVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className={styles.iconBrowserControls}>
              <motion.div 
                className={styles.searchContainer}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <input
                  type="text"
                  placeholder="Search icons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.iconSearch}
                />
              </motion.div>
              
              <motion.div 
                className={styles.categoryContainer}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {Object.entries(categories).map(([key, value], index) => (
                  <button
                    key={key}
                    className={`${styles.categoryButton} ${selectedCategory === key ? styles.active : ''}`}
                    onClick={() => setSelectedCategory(key)}
                  >
                    {value}
                  </button>
                ))}
              </motion.div>
            </div>
            
            {filteredIcons.length > 0 ? (
              <div className={styles.iconsGrid}>
                {filteredIcons.map((iconName, index) => {
                  const IconComponent = iconComponents[iconName];
                  return (
                    <motion.div
                      key={iconName}
                      className={styles.iconContainer}
                      variants={createIconAnimationVariants(index)}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleIconClick(iconName)}
                    >
                      <div className={styles.iconWrapper}>
                        <IconComponent className={styles.icon} />
                      </div>
                      <span className={styles.iconName}>{formatIconName(iconName)}</span>
                      {copiedIcon === iconName && (
                        <motion.div
                          className={styles.copiedNotification}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          Copied!
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                className={styles.noResults}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                No icons found. Try a different search term.
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default IconBrowser; 