// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  /**
   * People on stackoverflow say that it's bad idea
   * to save api endpoints in environment file, but
   * I don't like idea to waste user time to fetch
   * config every time. Moreover, It's gonna be really bad
   * if someone will forget to put frontend config on server.
   * It doesn't sound bad to me if I will have to recompile
   * project to update config.
   */
  apis: {
    auth: {
      endpointV1: '/api/auth/v1',
    },
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
