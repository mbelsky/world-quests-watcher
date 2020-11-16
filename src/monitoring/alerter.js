import Rollbar from "rollbar";

export class Alerter {
  static #instance;

  static get instance() {
    if (!this.#instance) {
      if (!process.env.ROLLBAR_TOKEN) {
        throw new Error(`ROLLBAR_TOKEN is not defined`)
      }

      this.#instance = new Rollbar({
        accessToken: process.env.ROLLBAR_TOKEN,
        captureUncaught: true,
        captureUnhandledRejections: true,
      });
    }

    return this.#instance;
  }

  static error() {
    this.instance.error(...arguments);
  }
  
  static warn() {
    this.instance.warn(...arguments);
  }
}
