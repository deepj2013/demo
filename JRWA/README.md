# Saath resident participation portal

A bilingual PHP website that stores surveys, volunteers and public problem records in JSON files.

## Run locally

From this folder, start PHP's local server:

```sh
php -S localhost:8080
```

Open `http://localhost:8080`. Admin is at `/admin.php`.

Initial admin credentials:

- Username: `admin`
- Password: `ChangeMe@2026`

Change the password hash in `data/config.json` before public use. Generate a new hash with PHP's `password_hash()` function.

## Storage

- `data/problems.json` — public issues and bilingual action plans
- `data/surveys.json` — resident survey responses
- `data/volunteers.json` — volunteer interest
- `uploads/` — evidence images added by admin

The server user must be able to write to `data/` and `uploads/`. For production, use HTTPS, restrict access to JSON data at the web-server level, change the default password and create regular backups. JSON is suitable for a small pilot; move to a database when submissions or admin users grow.
