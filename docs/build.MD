Yes—while your cloud EAS build is churning away, you can kick out a local APK yourself. Here are two quick ways:

---

## 1. Local debug APK via Expo CLI

1. **Connect a device or start an emulator**
2. Run:

   ```bash
   expo run:android
   ```

   This will build a debug APK locally and install it on your device/emulator. You’ll find the raw APK in

   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

   It’s great for fast, iterative testing—but note it’s signed with a debug key, not your production keystore.

---

## 2. Local release APK via Gradle (after prebuilding)

If you need a locally-built release APK (signed with your own keystore), do this once:

1. **Prebuild the native project**

   ```bash
   expo prebuild --platform android
   ```
2. **Install dependencies**

   ```bash
   cd android
   ./gradlew clean
   ```
3. **Assemble the release APK**

   ```bash
   ./gradlew assembleRelease
   ```
4. **Grab your APK**
   The signed APK will be at

   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

   (Make sure your `android/gradle.properties` or `~/.gradle/gradle.properties` has the keystore path and credentials configured.)

---

## 3. Local EAS build

EAS also supports local builds—using your `production` profile but running on your machine:

```bash
eas build \
  --platform android \
  --profile production \
  --local
```

This mimics the cloud build exactly (including applying your keystore and build configuration) but executes it on your workstation.

---

**In practice:**

* For super-quick debug installs → **`expo run:android`**.
* For a locally-signed release APK → **Gradle assembleRelease**.
* To replicate your exact EAS “production” pipeline locally → **`eas build … --local`**.

Pick whichever fits your workflow, and you’ll never have to wait around for the cloud build just to smoke-test a change.
