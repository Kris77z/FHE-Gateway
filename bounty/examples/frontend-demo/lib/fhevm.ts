'use client';

// Dynamic import to avoid SSR issues with @zama-fhe/relayer-sdk
// The SDK uses browser-only APIs (self, window) that don't exist in Node.js

let fhevmModule: typeof import('@zama-fhe/relayer-sdk/web') | null = null;
let instance: any = null;
let initialized = false;

// Lazy load the SDK only in browser environment
const loadFhevmModule = async () => {
  console.log('[FHEVM] Loading module...');
  console.log('[FHEVM] typeof window:', typeof window);
  console.log('[FHEVM] typeof global:', typeof global);
  console.log('[FHEVM] typeof globalThis:', typeof globalThis);
  console.log('[FHEVM] typeof fetch:', typeof fetch);

  if (fhevmModule) {
    console.log('[FHEVM] Module already loaded, returning cached');
    return fhevmModule;
  }

  if (typeof window === 'undefined') {
    throw new Error('FHEVM SDK can only be used in browser environment');
  }

  console.log('[FHEVM] Importing @zama-fhe/relayer-sdk/web...');
  try {
    fhevmModule = await import('@zama-fhe/relayer-sdk/web');
    console.log('[FHEVM] Module imported successfully');
    console.log('[FHEVM] Available exports:', Object.keys(fhevmModule));
  } catch (importError: any) {
    console.error('[FHEVM] Import failed:', importError);
    console.error('[FHEVM] Import error stack:', importError.stack);
    throw importError;
  }

  return fhevmModule;
};

// Use Zama's official Sepolia configuration
// SepoliaConfig includes all the correct contract addresses and gateway URLs for v0.9
export const createFhevmInstance = async () => {
  if (instance) {
    console.log('[FHEVM] Returning existing instance');
    return instance;
  }

  console.log('[FHEVM] ========================================');
  console.log('[FHEVM] Initializing FHEVM with SepoliaConfig...');
  console.log('[FHEVM] ========================================');

  try {
    const sdk = await loadFhevmModule();

    console.log('[FHEVM] SepoliaConfig:', JSON.stringify(sdk.SepoliaConfig, null, 2));

    // Initialize the SDK first (loads WASM modules)
    if (!initialized) {
      console.log('[FHEVM] Calling initSDK()...');
      try {
        await sdk.initSDK();
        initialized = true;
        console.log('[FHEVM] SDK initialized successfully');
      } catch (initError: any) {
        console.error('[FHEVM] initSDK() failed:', initError);
        console.error('[FHEVM] initSDK() error message:', initError.message);
        console.error('[FHEVM] initSDK() error stack:', initError.stack);
        throw initError;
      }
    }

    // Use the official Sepolia configuration from Zama
    // This includes all the correct contract addresses for v0.9:
    // - ACL, KMS, InputVerifier on Sepolia (chainId: 11155111)
    // - Gateway on chain 10901
    // - Relayer at https://relayer.testnet.zama.org
    console.log('[FHEVM] Calling createInstance()...');
    try {
      instance = await sdk.createInstance(sdk.SepoliaConfig);
      console.log('[FHEVM] Instance created successfully');
      console.log('[FHEVM] Instance methods:', Object.keys(instance));
    } catch (createError: any) {
      console.error('[FHEVM] createInstance() failed:', createError);
      console.error('[FHEVM] createInstance() error message:', createError.message);
      console.error('[FHEVM] createInstance() error stack:', createError.stack);
      throw createError;
    }

  } catch (error: any) {
    console.error('[FHEVM] Failed to create FHEVM instance:', error);
    console.error('[FHEVM] Error type:', error.constructor.name);
    console.error('[FHEVM] Error message:', error.message);
    throw error;
  }

  return instance;
};

export const getInstance = () => instance;

// Helper to reset instance (useful when switching networks)
export const resetInstance = () => {
  instance = null;
  initialized = false;
  console.log('[FHEVM] Instance reset');
};
