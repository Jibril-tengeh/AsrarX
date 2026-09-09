package com.asrarhub.app;

import android.os.Bundle;
import android.view.WindowManager;
import android.webkit.DownloadListener;
import android.webkit.URLUtil;
import android.webkit.JavascriptInterface;
import android.app.DownloadManager;
import android.net.Uri;
import android.os.Environment;
import android.widget.Toast;
import android.util.Base64;
import android.util.Log;
import java.io.File;
import java.io.FileOutputStream;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private boolean isScreenProtectionEnabled = true;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        try {
            // Apply screen protection safely after super.onCreate
            applyScreenProtection(true);
        } catch (Throwable e) {
            Log.w("AsrarHub", "Screen protection setup warning:", e);
        }

        this.runOnUiThread(() -> {
            try {
                if (this.bridge != null && this.bridge.getWebView() != null) {
                    // Add JavaScript Interface for dynamic control from React / Admin Panel
                    this.bridge.getWebView().addJavascriptInterface(new SecurityBridge(), "AndroidSecurity");

                    this.bridge.getWebView().setDownloadListener(new DownloadListener() {
                        @Override
                        public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimeType, long contentLength) {
                            if (url == null || url.isEmpty()) return;
                            
                            try {
                                if (url.startsWith("data:")) {
                                    saveDataUrlToDownloads(url, mimeType);
                                    return;
                                }
                                
                                if (url.startsWith("blob:")) {
                                    // Blob URLs cannot be handled by DownloadManager directly
                                    return;
                                }
                                
                                if (url.startsWith("http://") || url.startsWith("https://")) {
                                    DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                                    if (mimeType != null && !mimeType.isEmpty()) {
                                        request.setMimeType(mimeType);
                                    }
                                    String fileName = URLUtil.guessFileName(url, contentDisposition, mimeType);
                                    request.setTitle(fileName);
                                    request.setDescription("Téléchargement AsrarHub...");
                                    request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                                    request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName);
                                    
                                    DownloadManager dm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
                                    if (dm != null) {
                                        dm.enqueue(request);
                                        Toast.makeText(getApplicationContext(), "Téléchargement démarré : " + fileName, Toast.LENGTH_SHORT).show();
                                    }
                                }
                            } catch (Exception e) {
                                Log.e("AsrarHub", "Download listener error", e);
                            }
                        }
                    });
                }
            } catch (Exception e) {
                Log.e("AsrarHub", "WebView setup error", e);
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (isScreenProtectionEnabled) {
            applyScreenProtection(true);
        }
    }

    @Override
    public void onAttachedToWindow() {
        super.onAttachedToWindow();
        if (isScreenProtectionEnabled) {
            applyScreenProtection(true);
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (isScreenProtectionEnabled) {
            applyScreenProtection(true);
        }
    }

    public void applyScreenProtection(boolean enable) {
        isScreenProtectionEnabled = enable;
        runOnUiThread(() -> {
            try {
                if (getWindow() != null) {
                    if (enable) {
                        getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
                        getWindow().setFlags(
                            WindowManager.LayoutParams.FLAG_SECURE,
                            WindowManager.LayoutParams.FLAG_SECURE
                        );
                        Log.d("AsrarHub", "FLAG_SECURE enabled (anti-screenshot active)");
                    } else {
                        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
                        Log.d("AsrarHub", "FLAG_SECURE disabled");
                    }
                }
            } catch (Throwable e) {
                Log.e("AsrarHub", "Failed to update FLAG_SECURE", e);
            }
        });
    }

    public class SecurityBridge {
        @JavascriptInterface
        public void setScreenProtection(boolean enabled) {
            Log.d("AsrarHub", "SecurityBridge.setScreenProtection called with: " + enabled);
            applyScreenProtection(enabled);
        }

        @JavascriptInterface
        public boolean isScreenProtectionEnabled() {
            return isScreenProtectionEnabled;
        }
    }

    private void saveDataUrlToDownloads(String dataUrl, String mimeType) {
        try {
            int commaIndex = dataUrl.indexOf(",");
            if (commaIndex == -1) return;
            
            String header = dataUrl.substring(0, commaIndex);
            String base64Data = dataUrl.substring(commaIndex + 1);
            
            byte[] fileData = Base64.decode(base64Data, Base64.DEFAULT);
            String fileName = "asrarhub_" + System.currentTimeMillis();
            if (header.contains("image/png") || (mimeType != null && mimeType.contains("png"))) {
                fileName += ".png";
            } else if (header.contains("pdf") || (mimeType != null && mimeType.contains("pdf"))) {
                fileName += ".pdf";
            } else {
                fileName += ".png";
            }

            File downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            if (!downloadsDir.exists()) {
                downloadsDir.mkdirs();
            }
            File outFile = new File(downloadsDir, fileName);
            FileOutputStream fos = new FileOutputStream(outFile);
            fos.write(fileData);
            fos.flush();
            fos.close();
            
            Toast.makeText(getApplicationContext(), "Fichier enregistré dans Téléchargements : " + fileName, Toast.LENGTH_SHORT).show();
        } catch (Exception e) {
            Log.e("AsrarHub", "Data URL save error", e);
        }
    }
}

