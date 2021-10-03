## Environment Variables

- DOOJON_CONFIG -
  Path to config of the application.
  Defaults to `cfg/doojon.json`

- DOOJON_RUN_DB_MIGRATIONS -
  If equals 1 then runs database migrations on startup

- DOOJON_GCP_ID -
  Google Cloud project id. Used in Cloud Spanner

- CLOUD_SPANNER_EMULATOR
  **host[:port]** - host with Cloud Spanner emulator

- CLOUD_SPANNER_INSTANCE -
  Cloud Spanner instance id

- CLOUD_SPANNER_DATABASE -
  Cloud Spanner database
