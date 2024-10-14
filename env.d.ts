/// <reference types="vite/client" />
// src/global.d.ts
import Echo from 'laravel-echo';
declare global {
    interface Window {
        Echo: Echo;
        Pusher: any;
    }
    // Extend ImportMeta to include environment variables
    interface ImportMetaEnv {
        BASE_URL: string;
        // Add any other environment variables you might have
        VITE_SOME_VARIABLE: string; // example
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}

export {};
