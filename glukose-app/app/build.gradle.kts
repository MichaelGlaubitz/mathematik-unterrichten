plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "de.glaubitz.glukose"
    compileSdk = 35

    defaultConfig {
        applicationId = "de.glaubitz.glukose"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            // Debug-Signatur, damit die APK ohne eigenen Keystore installierbar ist.
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

// Bewusst ohne externe Bibliotheken: HttpURLConnection, org.json und
// android.graphics reichen fuer alles, was diese App tut.
dependencies { }
