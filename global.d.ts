declare global {
    namespace NodeJS {
      interface ProcessEnv {
        RUNTIME: 'edge' | 'nodejs';
      }
    }
  }
  
export {}