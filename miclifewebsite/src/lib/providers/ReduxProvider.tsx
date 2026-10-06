"use client";

import { useRef, useMemo, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../store/store';

function initializeStore(preloadedState?: any): AppStore {
  // Always create a new store instance
  // This ensures each render (including SSR) has its own store
  try {
    return makeStore(preloadedState);
  } catch (error) {
    // Fallback: create store with minimal state if initialization fails
    console.warn('Store initialization warning:', error);
    try {
      return makeStore({});
    } catch (fallbackError) {
      // Last resort: create a minimal store
      console.error('Critical store initialization error:', fallbackError);
      return makeStore({});
    }
  }
}

// Create a store instance that's always available, even during build
let globalStoreInstance: AppStore | null = null;

function getOrCreateStore(preloadedState?: any): AppStore {
  if (typeof window === 'undefined') {
    // On server/build time, always create new store
    return initializeStore(preloadedState);
  }
  
  // On client, reuse global instance if it exists
  if (!globalStoreInstance) {
    globalStoreInstance = initializeStore(preloadedState);
  }
  
  return globalStoreInstance;
}

export default function ReduxProvider({
  children,
  preloadedState,
}: {
  children: React.ReactNode;
  preloadedState?: any;
}) {
  // Use useRef to maintain store instance across re-renders on client
  const storeRef = useRef<AppStore | null>(null);
  
  // Use useMemo to ensure store is created properly for both SSR and client
  const store = useMemo(() => {
    // Always create a store, whether on server or client
    // This ensures Redux context is always available
    if (typeof window === 'undefined') {
      // On server/build time, always create new store
      return getOrCreateStore(preloadedState);
    }
    
    // On client, reuse store if it exists
    if (!storeRef.current) {
      storeRef.current = getOrCreateStore(preloadedState);
    }
    
    return storeRef.current;
  }, [preloadedState]);
  
  // Ensure store is always available, even during build validation
  useEffect(() => {
    if (!store && typeof window !== 'undefined') {
      // On client, ensure store exists
      if (!storeRef.current) {
        storeRef.current = getOrCreateStore(preloadedState);
      }
    }
  }, [store, preloadedState]);
  
  // Ensure store is always available
  if (!store) {
    // This should never happen, but provide fallback
    const fallbackStore = getOrCreateStore({});
    return <Provider store={fallbackStore}>{children}</Provider>;
  }
  
  return <Provider store={store}>{children}</Provider>;
}
