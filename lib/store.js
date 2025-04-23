import { create } from 'zustand'

// Updated implementation using modern zustand pattern with selectors
export const useStore = create((set, get) => ({
  // State
  headerData: undefined,
  footerData: undefined,
  navIsOpen: false,
  overflow: true,
  lenis: undefined,
  triggerTransition: '',
  introOut: false,
  
  // Actions (separated from state for better type safety and organization)
  setHeaderData: (headerData) => set({ headerData }),
  setFooterData: (footerData) => set({ footerData }),
  setNavIsOpen: (toggle) => set({ navIsOpen: toggle, overflow: !toggle }),
  setLenis: (lenis) => set({ lenis }),
  setOverflow: (overflow) => set({ overflow }),
  setTriggerTransition: (triggerTransition) => set({ triggerTransition }),
  setIntroOut: (introOut) => set({ introOut }),
}))
