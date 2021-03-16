#!/usr/bin/env bash

xcrun altool \
  --notarize-app \
  --primary-bundle-id com.halestreet.Skrift \
  --username "$AC_USERNAME" \
  --password "$AC_PASSWORD" \
  --file "dist/Skrift-$npm_package_version-mac.zip" \
  --asc-provider KE3Z2Z922J