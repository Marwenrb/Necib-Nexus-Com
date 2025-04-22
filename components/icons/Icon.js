import React from 'react';
import { IconContext } from 'react-icons';
import * as Ri from 'react-icons/ri'; // Remix Icons - style moderne
import * as Fi from 'react-icons/fi'; // Feather Icons - style minimaliste

// Palette de couleurs de la marque
const brandColors = {
  primary: 'var(--neon-blue, #5352ED)',
  secondary: '#1DA1F2',
  accent: '#0077B5',
  light: '#ffffff',
  dark: '#000000',
  gray: 'rgba(255, 255, 255, 0.7)'
};

// Tailles standards
const sizes = {
  xs: '0.875rem',
  sm: '1rem',
  md: '1.25rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '2.5rem'
};

/**
 * Composant Icon moderne et animé
 * @param {string} name - Nom de l'icône (format: 'ri:rocket-line')
 * @param {string} color - Couleur de l'icône (peut être une clé de brandColors)
 * @param {string} size - Taille de l'icône (xs, sm, md, lg, xl, 2xl)
 * @param {string} className - Classes CSS additionnelles
 * @param {boolean} animated - Ajoute une animation sur hover
 */
export const Icon = ({ 
  name, 
  color = 'primary', 
  size = 'md', 
  className = '', 
  animated = false, 
  ...props 
}) => {
  // Parsing du nom (format: 'ri:rocket-line')
  const [library, iconName] = name.split(':');
  
  // Sélection de la bibliothèque
  const lib = {
    ri: Ri,
    fi: Fi
  }[library] || Ri;
  
  // Transformation du nom (ex: 'rocket-line' -> 'RiRocketLine')
  const formattedName = iconName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  
  const IconComponent = lib[`${library === 'ri' ? 'Ri' : 'Fi'}${formattedName}`];
  
  if (!IconComponent) {
    console.warn(`Icon ${name} not found`);
    return null;
  }
  
  return (
    <IconContext.Provider 
      value={{ 
        color: brandColors[color] || color,
        size: sizes[size] || size,
        style: props.style
      }}
    >
      <span 
        className={`icon ${animated ? 'icon-animated' : ''} ${className}`} 
        {...props}
      >
        <IconComponent />
        <style jsx>{`
          .icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          
          .icon-animated {
            cursor: pointer;
            transition: transform 0.3s ease, filter 0.3s ease;
          }
          
          .icon-animated:hover {
            transform: translateY(-2px);
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
          }
        `}</style>
      </span>
    </IconContext.Provider>
  );
};

export default Icon; 