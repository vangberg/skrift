# Skrift

A personal note-taking app. See my post [Note Workflows in Skrift](https://harry.vangberg.name/posts/2021-12-30-note-workflows-in-skrift/)
for the rationale behind Skrift.

![skrift](https://github.com/user-attachments/assets/04fc5744-d595-42e7-8386-7b043dc92d68)

## Installation

Download the latest release from the [Releases](https://github.com/vangberg/skrift/releases) page.

If you are on macOS, the app is unsigned (as I don't want to pay for an Apple Developer account),
and cannot run, if it is downloaded via the browser. Download it via the terminal using `curl`
instead.

## Development

- `asdf` is used for version management.
- `npm run start` will start the app in dev mode.

## Tests

- `npm run test` will run the tests.

## Build

- `npm run build && npm run dist`

## Release

- Bump version with `npm version minor`
- `npm run build && npm run release`

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
