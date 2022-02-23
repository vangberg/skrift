# Skrift

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
