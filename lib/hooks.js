'use client';

import { useLayoutEffect, useEffect } from 'react';

// Hook that provides useLayoutEffect on client and useEffect on server
export const useIsomorphicLayoutEffect = 
  typeof window !== 'undefined' ? useLayoutEffect : useEffect; 