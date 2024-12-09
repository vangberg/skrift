# Skrift

## Development

- `asdf` is used for version management.
- `npm run start` will start the app in dev mode.

## Tests

- `npm run test` will run the tests.

## Build and release

- `npm run build && npm run dist && npm run publish`

## Notarizing on Mac

```bash
export AC_USERNAME=<email>

# https://support.apple.com/en-us/HT204397
export AC_PASSWORD=<app-speficic-password>

npm run notarize
```

### Check if app has been notarized

```
spctl -a -v dist/mac/Skrift.app
```
