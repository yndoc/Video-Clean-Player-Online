/*
 * This file is part of ADkill Player Offline
 * <http://bbs.kafan.cn/thread-1514537-1-1.html>,
 * Copyright (C) yndoc xplsy 15536900
 *
 * ADkill Player Offline is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * GNU General Public License, see <http://www.gnu.org/licenses/>.
 */

var proxyflag = 0;	//proxy调试标记
var cacheflag = false;	//用于确定是否需要清理缓存,注意由于隐身窗口的cookie与缓存都独立与普通窗口,因此使用API无法清理隐身窗口的缓存与cookie.
//var xhr = new XMLHttpRequest();	

//====================================Crossdomin Spoofer Test
//pac script
var pac = {
  mode: "pac_script",
  pacScript: {
    data: "function FindProxyForURL(url, host) {\n" +
    	"	var regexpr = /.*\\/crossdomain\\.xml/;\n" +	//使用过程中\\将被解析成\,所以在正常正则表达式中的\/需要改写成\\/
    	"	if(regexpr.test(url)){\n " +
    	"		return 'PROXY yk.pp.navi.youku.com:80';\n" +
    	"	}\n" +
    	"	return 'DIRECT';\n" +
    	"}"
  }
};
//Permission Check + Proxy Control
function ProxyControl(pram) {
	chrome.proxy.settings.get({incognito: false}, function(config){
		//console.log(config.levelOfControl);
		//console.log(config);
		//console.log(pac);
		switch(config.levelOfControl) {
			case "controllable_by_this_extension":
			// 可获得proxy控制权限，显示信息
			console.log("Have Proxy Permission");
			proxyflag = 1;
			if(pram == "set"){
				console.log("Setup Proxy");
				chrome.proxy.settings.set({value: pac, scope: "regular"}, function(details) {});
			}
			break;
			case "controlled_by_this_extension":
			// 已控制proxy，显示信息
			console.log("Already controlled");
			proxyflag = 2;
			if(pram == "unset"){
				console.log("Release Proxy");
				chrome.proxy.settings.clear({scope: "regular"});
				FlushCache();
			}
			break;
			default:
			// 未获得proxy控制权限，显示信息
			console.log("No Proxy Permission");
			console.log("Skip Proxy Control");
			proxyflag = 0;
			break;
		}
	});
}
function FlushCache() {
	if(cacheflag) {
		chrome.browsingData.remove(
			{},{
			"cache": true,
			"fileSystems": true,
		},
		function() {
			console.log('Now flushing Cache!');
		});
	}
}
//Listeners
chrome.webRequest.onBeforeRequest.addListener(function(details) {
	for (var i = 0; i < proxylist.length; i++) {
		if (proxylist[i].find.test(details.url) && proxylist[i].extra == "crossdomain") {
			//console.log(details.url);
			console.log('Crossdomin Spoofer Rule : ' + proxylist[i].name);
			switch (proxylist[i].name) {
				default:
				//console.log("In Proxy Set");
				ProxyControl("set");
				break;
			}
		}
	}
	//return {cancel: false};
},
{urls: ["http://*/*", "https://*/*"]},
["blocking"]);
chrome.webRequest.onCompleted.addListener(function(details) {
	for (var i = 0; i < proxylist.length; i++) {
		if (proxylist[i].monitor.test(details.url) && proxylist[i].extra == "crossdomain") {
			//console.log(details);
			cacheflag = false;
			cacheflag = details.fromCache;
			console.log("Capture Moniter Url :" + details.url + " fromCache :" + details.fromCache + " ip :" + details.ip);
			switch (proxylist[i].name) {
				default:
				console.log("Now Release Proxy ");
				ProxyControl("unset");
				break;
			}
			break;
		}
	}
},
{urls:  ["http://*/*", "https://*/*"]});
//标签开启
chrome.tabs.onCreated.addListener(function(tab) {
	ProxyControl("unset");
});
///标签关闭
chrome.tabs.onRemoved.addListener(function(tabId) {
	ProxyControl("unset");
});
//====================================Headers Modifier Test
chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
	//console.log(details);
	for (var i = 0; i < refererslist.length; i++) {
		if (refererslist[i].find.test(details.url)) {
			//console.log(details);
			console.log('Referer Modifier Rule : ' + refererslist[i].name);
			for (var j = 0; j < details.requestHeaders.length; ++j) {
				if (details.requestHeaders[j].name === 'Referer') {
				//console.log(details.requestHeaders[j]);
					switch (refererslist[i].name) {
						case "referer_youku":
						if (/(youku|tudou)/i.test(details.requestHeaders[j].value)) {
							console.log("Referer Modifier : No need to change");
							break;
						}
						case "referer_iqiyi":     //bilibili中iqiyi外链都已经下架，仅保留备用！
						if (/qiyi\.com/i.test(details.requestHeaders[j].value)) {
							console.log("Referer Modifier : No need to change");
							break;
						}
						default:
						console.log("Referer Modifier : Switch Default");
						if (refererslist[i].extra === "remove"){
							console.log('Referer Modifier Action : Remove');
							details.requestHeaders.splice(j, 1);
						} else {
							console.log('Referer Modifier Action : Modify');
							details.requestHeaders[j].value = refererslist[i].replace;
						}
						break;
					}
				//console.log(details.requestHeaders[j]);
					break;
				}
				/*if (details.requestHeaders[i].name === 'User-Agent') {
	//details.requestHeaders.splice(i, 1);
			details.requestHeaders[i].value = "Mozilla/5.0 (LETVC1;iPad; CPU OS 5_0 like Mac OS X) AppleWebKit/535.35 (KHTML, like Gecko)";
					//console.log(details.requestHeaders[i]);
				}*/
			}
		}
	}
	//Add Cache Controler
/*	for (var i = 0; i < proxylist.length; i++){
			if (proxylist[i].realurl.test(details.url)) {
				console.log('Cache-Control Modifier');
				for (var j = 0; j < details.requestHeaders.length; ++j) {
					if (details.requestHeaders[j].name === 'Cache-Control') {
						details.requestHeaders[j].value = "no-cache";
				}
				break;
			}
		}
	}
*/
	return {requestHeaders: details.requestHeaders};
},{urls: ["http://*/*", "https://*/*"]},
["blocking", "requestHeaders"]);
//====================================
//Referer修改规则
/*格式：
	name:规则名称
	find:匹配(正则)表达式
	replace:替换(正则)表达式,注意此处有多种方式,可看后续说明并按需选择
	extra:额外的属性,remove表示去除Referer参数
*/
var refererslist = [{
		name: "referer_youku",
		find: /f\.youku\.com/i,
		replace: "http://player.youku.com/player.php",
		extra: ""	//use "remove" is also acceptable
	},{
		name: "referer_56",
		find: /\.56\.com/i,
		replace: "",
		extra: "remove"
	},{  //bilibili中iqiyi外链都已经下架，仅保留备用！
		name: "referer_iqiyi",
		find: /cache\.video\.qiyi\.com/i,
		replace: "",
		extra: "remove"
	}
	]
//Crossdomain修改规则
/*格式：
	name:规则名称
	find:匹配(正则)表达式,当出现匹配地址时,启动crossdomain代理修改
	monitor:匹配(正则)表达式,当出现匹配地址时,释放crossdomain代理(接收完成后)
	extra:额外的属性,crossdomain表示启动修改
*/
var proxylist = [{
		name: "crossdomain_youku",
		find: /http:\/\/static\.youku\.com\/.*?q?(player|loader)(_[^.]+)?\.swf/i,	//播放器载入地址
		monitor:/http:\/\/v\.youku\.com\/crossdomain\.xml/i,	//youku tudou实际访问的均是这个地址
		extra: "crossdomain"
	},{
		name: "crossdomain_youku_out",
		find: /^http:\/\/player\.youku\.com\/player\.php\/(.*\/)?sid\/([\w=]+)\/v\.swf/i,
		monitor:/http:\/\/v\.youku\.com\/crossdomain\.xml/i,
		extra: "crossdomain"
	},{
		name: "crossdomain_tudou",
		find: /.*PortalPlayer[^\.]*\.swf/i,
		monitor:/http:\/\/v\.youku\.com\/crossdomain\.xml/i,
		extra: "crossdomain"
	},{
		name: "crossdomain_tudou_olc",
		find: /^http:\/\/js\.tudouui\.com\/.*olc[^\.]*\.swf/i,
		monitor:/http:\/\/v\.youku\.com\/crossdomain\.xml/i,
		extra: "crossdomain"
	},{
		name: "crossdomain_tudou_sp",
		find: /.*olc[^\.]*\.swf/i,
		monitor:/http:\/\/v\.youku\.com\/crossdomain\.xml/i,
		extra: "crossdomain"
	},{
		name: "crossdomain_sohu",
		find: /http:\/\/(tv\.sohu\.com\/upload\/swf\/.*\d+|.*\/test\/player)\/(main|playershell)\.swf/i,
		monitor: /http:\/\/live\.tv\.sohu\.com\/crossdomain\.xml/i,
		extra: "crossdomain"
	},{
		name: "crossdomain_iqiyi|pps-1",
		find: /http:\/\/www\.iqiyi\.com\/player\/(\d+\/Player|[a-z0-9]*|cupid\/.*\/(pps[\w]+|clear))\.swf/i,
		monitor: /http:\/\/data\.video\.qiyi\.com\/crossdomain\.xml/i,
		extra: "crossdomain"
	},{
		name: "crossdomain_iqiyi|pps-2",
		find: /http:\/\/www\.iqiyi\.com\/player\/cupid\/common\/icon\.swf/i,
		monitor: /http:\/\/sf\.video\.qiyi\.com\/crossdomain\.xml/i,
		extra: "crossdomain"
	}
]
