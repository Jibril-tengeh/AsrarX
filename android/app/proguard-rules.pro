# ==============================================================================
# Règles ProGuard / R8 Optimisées pour AsrarHub (Capacitor + Firebase + Plugins)
# ==============================================================================

# Conserver les attributs essentiels pour la gestion d'erreurs et la réflexion
-keepattributes *Annotation*,Exceptions,InnerClasses,EnclosingMethod,Signature,SourceFile,LineNumberTable

# Conserver les interfaces JavaScript injectées dans WebView
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ------------------------------------------------------------------------------
# 1. Règles Fondamentales Capacitor & Plugins
# ------------------------------------------------------------------------------
-keep class com.getcapacitor.** { *; }
-keep interface com.getcapacitor.** { *; }
-keep public class * extends com.getcapacitor.Plugin { *; }
-keepclassmembers class * extends com.getcapacitor.Plugin {
    public <methods>;
}
-keep class com.getcapacitor.Bridge { *; }
-keep class com.getcapacitor.BridgeActivity { *; }
-keep class com.getcapacitor.PluginMethod { *; }
-keep class com.getcapacitor.PluginCall { *; }
-keep class com.getcapacitor.JSObject { *; }
-keep class com.getcapacitor.JSArray { *; }

# Plugins Capacitor communautaires & natifs
-keep class com.capacitorcommunity.** { *; }
-keep class com.capacitor.** { *; }

# ------------------------------------------------------------------------------
# 2. Règles Firebase & Google Play Services
# ------------------------------------------------------------------------------
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**

# Firebase Messaging / Notifications
-keep class com.google.firebase.messaging.** { *; }
-keep class com.google.firebase.iid.** { *; }

# Protéger les modèles de données Firebase sérialisés
-keepclassmembers class * {
    @com.google.firebase.firestore.PropertyName <fields>;
    @com.google.firebase.firestore.PropertyName <methods>;
    @com.google.firebase.firestore.Exclude <fields>;
    @com.google.firebase.firestore.Exclude <methods>;
}

# ------------------------------------------------------------------------------
# 3. Réseau, HTTP & Sérialisation (OkHttp, Retrofit, Gson)
# ------------------------------------------------------------------------------
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

-keep class com.google.gson.** { *; }
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
    @com.google.gson.annotations.Expose <fields>;
}

# ------------------------------------------------------------------------------
# 4. Kotlin Coroutines & AndroidX
# ------------------------------------------------------------------------------
-dontwarn kotlinx.coroutines.**
-keepclassmembers class kotlinx.coroutines.** { *; }
-keep class androidx.webkit.** { *; }
-keep class androidx.core.** { *; }

# ------------------------------------------------------------------------------
# 5. Éviter les alertes de build bénignes
# ------------------------------------------------------------------------------
-dontnote com.getcapacitor.**
-dontnote com.google.firebase.**
-dontnote org.apache.commons.**
