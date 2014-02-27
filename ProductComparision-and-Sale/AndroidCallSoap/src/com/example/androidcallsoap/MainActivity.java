package com.example.androidcallsoap;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;
import android.webkit.WebView;

public class MainActivity extends Activity {
	
	private WebView webView;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		webView = (WebView) findViewById(R.id.webView1);
		webView.getSettings().setJavaScriptEnabled(true);
		//webView.loadUrl("http://KC-SCE-CS551.kc.umkc.edu/aspnet_client/CS551SoapService/WebService.asmx");
		webView.loadUrl("file:///android_asset/JQuery Soap.html");
	}

	
}
