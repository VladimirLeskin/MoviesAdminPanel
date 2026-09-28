// declaration.d.ts
declare module '*.scss';
declare module '*.css';
declare module '*.svg';

declare namespace NodeJS {
  interface ProcessEnv {
    ROUTER_BASENAME?: string;
    API_ORIGIN?: string;
    IMAGES_ORIGIN?: string;
    PUBLIC_PATH?: string;
  }
}
