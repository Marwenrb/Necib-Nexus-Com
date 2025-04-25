import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import cn from 'clsx'
import s from './icons.module.scss'

// Premium SVG icons with consistent styling
const icons = {
  github: (props) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.167 8.84 21.565C9.34 21.658 9.525 21.347 9.525 21.078C9.525 20.832 9.517 20.193 9.513 19.382C6.728 19.987 6.139 18.077 6.139 18.077C5.685 16.975 5.03 16.666 5.03 16.666C4.121 16.045 5.097 16.058 5.097 16.058C6.102 16.129 6.634 17.094 6.634 17.094C7.535 18.594 8.975 18.124 9.544 17.866C9.636 17.251 9.899 16.782 10.188 16.518C7.954 16.251 5.608 15.389 5.608 11.521C5.608 10.398 6.004 9.482 6.653 8.766C6.549 8.511 6.198 7.557 6.75 6.173C6.75 6.173 7.6 5.9 9.502 7.2C10.312 6.978 11.152 6.866 11.997 6.863C12.847 6.868 13.682 6.978 14.497 7.2C16.397 5.9 17.247 6.173 17.247 6.173C17.8 7.557 17.448 8.511 17.347 8.766C17.997 9.482 18.392 10.398 18.392 11.521C18.392 15.399 16.042 16.248 13.8 16.51C14.157 16.835 14.467 17.481 14.467 18.46C14.467 19.854 14.455 20.74 14.455 21.078C14.455 21.35 14.637 21.663 15.146 21.565C19.135 20.167 22 16.42 22 12C22 6.477 17.523 2 12 2Z"
        fill="currentColor"
      />
    </svg>
  ),

  sponsor: (props) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
        fill="currentColor"
      />
    </svg>
  ),

  arrow: (props) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.172 11L10.808 5.636L12.222 4.222L20 12L12.222 19.778L10.808 18.364L16.172 13H4V11H16.172Z"
        fill="currentColor"
      />
    </svg>
  ),

  close: (props) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
        fill="currentColor"
      />
    </svg>
  ),

  menu: (props) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"
        fill="currentColor"
      />
    </svg>
  ),

  search: (props) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
        fill="currentColor"
      />
    </svg>
  ),

  info: (props) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z"
        fill="currentColor"
      />
    </svg>
  ),

  user: (props) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
        fill="currentColor"
      />
    </svg>
  ),

  email: (props) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
        fill="currentColor"
      />
    </svg>
  ),

  phone: (props) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"
        fill="currentColor"
      />
    </svg>
  ),
}

// Individual Icon component with premium animations
const Icon = ({
  name,
  size = 24,
  color = 'currentColor',
  className,
  onClick,
  animated = true,
}) => {
  const IconSvg = icons[name]

  if (!IconSvg) return null

  // Animation variants for premium look
  const iconVariants = {
    initial: {
      scale: 0.8,
      opacity: 0,
      rotate: -5,
    },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        duration: 0.3,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 0,
      filter: 'drop-shadow(0 0 4px rgba(83, 82, 237, 0.6))',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  }

  return (
    <motion.div
      className={cn(s.iconWrapper, className)}
      initial={animated ? 'initial' : false}
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      variants={iconVariants}
      onClick={onClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        color: color,
      }}
    >
      <IconSvg width={size} height={size} />

      {/* Premium glow effect on hover */}
      <motion.div
        className={s.iconGlow}
        initial={{ opacity: 0, scale: 0.5 }}
        whileHover={{ opacity: 1, scale: 1.2 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

// Icon browser component with premium UI
export const IconBrowser = () => {
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredIcons, setFilteredIcons] = useState(Object.keys(icons))

  // Filter icons based on search
  useEffect(() => {
    if (!searchQuery) {
      setFilteredIcons(Object.keys(icons))
    } else {
      setFilteredIcons(
        Object.keys(icons).filter((name) =>
          name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }
  }, [searchQuery])

  return (
    <div className={s.iconBrowser}>
      <div className={s.searchContainer}>
        <Icon
          name="search"
          size={20}
          animated={false}
          className={s.searchIcon}
        />
        <input
          type="text"
          placeholder="Search icons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={s.searchInput}
        />
        {searchQuery && (
          <motion.button
            className={s.clearButton}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSearchQuery('')}
          >
            <Icon name="close" size={16} animated={false} />
          </motion.button>
        )}
      </div>

      <motion.div
        className={s.iconsGrid}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AnimatePresence>
          {filteredIcons.map((name) => (
            <motion.div
              key={name}
              className={cn(s.iconItem, {
                [s.selected]: selectedIcon === name,
              })}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onClick={() => setSelectedIcon(name)}
              whileHover={{
                y: -5,
                boxShadow: '0 10px 25px rgba(83, 82, 237, 0.2)',
              }}
            >
              <Icon name={name} size={32} className={s.iconItemSvg} />
              <span className={s.iconName}>{name}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {selectedIcon && (
        <motion.div
          className={s.iconDetail}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className={s.iconDetailHeader}>
            <h3>Icon: {selectedIcon}</h3>
            <button
              className={s.closeButton}
              onClick={() => setSelectedIcon(null)}
            >
              <Icon name="close" size={20} animated={false} />
            </button>
          </div>

          <div className={s.iconPreview}>
            <Icon name={selectedIcon} size={64} className={s.iconPreviewSvg} />
          </div>

          <div className={s.iconSizes}>
            <Icon name={selectedIcon} size={16} />
            <Icon name={selectedIcon} size={24} />
            <Icon name={selectedIcon} size={32} />
            <Icon name={selectedIcon} size={48} />
          </div>

          <div className={s.codeExample}>
            <pre>{`<Icon name="${selectedIcon}" size={24} />`}</pre>
            <button
              className={s.copyButton}
              onClick={() => {
                navigator.clipboard.writeText(
                  `<Icon name="${selectedIcon}" size={24} />`
                )
              }}
            >
              Copy
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Export individual icons and main component
export default Icon
