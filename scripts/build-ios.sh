#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"
if ! xcodebuild -version >/dev/null 2>&1; then
  echo '需要完整 Xcode（26.4 或更高版本），Command Line Tools 不能编译 iOS。' >&2
  exit 1
fi
npx expo prebuild --platform ios --clean --no-install
pushd ios >/dev/null
pod install
popd >/dev/null
mkdir -p build artifacts
WORKSPACES=(ios/*.xcworkspace)
WORKSPACE_PATH="${WORKSPACES[0]}"
SCHEME_NAME="$(basename "$WORKSPACE_PATH" .xcworkspace)"
xcodebuild \
  -workspace "$WORKSPACE_PATH" \
  -scheme "$SCHEME_NAME" \
  -configuration Release \
  -sdk iphoneos \
  -destination 'generic/platform=iOS' \
  -derivedDataPath build/ios \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO CODE_SIGN_IDENTITY='' \
  build
APP_PATH="$(find "$ROOT_DIR/build/ios/Build/Products/Release-iphoneos" -maxdepth 1 -name '*.app' -print -quit)"
test -d "$APP_PATH"
# A device Release build bundles JS and assets; a simulator app cannot be sideloaded.
test -f "$APP_PATH/main.jsbundle"
rm -rf build/ipa
rm -f artifacts/maisen-unsigned.ipa
mkdir -p build/ipa/Payload artifacts
ditto "$APP_PATH" build/ipa/Payload/MaisenErrorBook.app
pushd build/ipa >/dev/null
zip -qry "$ROOT_DIR/artifacts/maisen-unsigned.ipa" Payload
popd >/dev/null
echo 'artifacts/maisen-unsigned.ipa 已生成，需由 Sideloadly 重新签名安装。'
