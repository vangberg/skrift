// import unhandled from "electron-unhandled";
import * as Sentry from "@sentry/electron";

export const setupErrors = () => {
  Sentry.init({
    dsn:
      "https://eea1db58ec474ff4a340a40b9af0a194@o522122.ingest.sentry.io/5633132",
    defaultIntegrations: false,
  });

  // unhandled({
  //   showDialog: true,
  //   reportButton: (error) => {
  //     Sentry.captureException(error);
  //   },
  // });
};
