import { ENV_TYPES } from "./location.types";

declare global {
  interface Window {
    ENV: ENV_TYPES;
  }
}

window.ENV = window.ENV || {};
