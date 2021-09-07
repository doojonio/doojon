
Environment Variables
---------------------

* DOOJON_CONFIG
  * **path/to/config.json** - path to config of the application.
    Defaults to `cfg/doojon.json`
* DOOJON_RUN_DB_MIGRATIONS
  * _1_ - run database migrations on startup
* DOOJON_PROJECT_ID
  * **string** - Google Cloud project id. Used in Cloud Spanner
* CLOUD_SPANNER_EMULATOR
  * **host[:port]** - host with Cloud Spanner emulator
