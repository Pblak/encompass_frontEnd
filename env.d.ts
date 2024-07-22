/// <reference types="vite/client" />
// src/global.d.ts
import Echo from 'laravel-echo';

declare global {
    interface Window {
        Echo: Echo;
        Pusher: any;
    }
}

export {};
