(function() {
    Function.prototype.bind = function() {
        var fn = this, args = Array.prototype.slice.call(arguments), obj = args.shift();
        return function() {
            return fn.apply(obj, args.concat(Array.prototype.slice.call(arguments)));
        };
    };

    function YoukuAntiAds() {}
    YoukuAntiAds.prototype = {
        _players: null,
        _rules: null,
        _done: null,
        get players() {
            if(!this._players) {
                this._players = {
、、=====================在线版地址开始=================================================
//双虚线之前为在线地址，请自行需该服务器地址！如使用本地版请注释掉双虚线以上地址
                    'youku_loader': 'http://haoutil.googlecode.com/svn/trunk/player/testmod/loader.swf',
                    'youku_player': 'http://haoutil.googlecode.com/svn/trunk/player/testmod/player.swf',
                    'ku6': 'http://haoutil.googlecode.com/svn/trunk/player/ku6.swf',
                    'ku6_out': 'http://haoutil.googlecode.com/svn/trunk/player/ku6_out.swf',
                    'iqiyi': 'http://haoutil.googlecode.com/svn/trunk/player/testmod/iqiyi.swf',
                    'iqiyi5': 'http://haoutil.googlecode.com/svn/trunk/player/testmod/iqiyi5.swf',
                    'iqiyi_out': 'http://haoutil.googlecode.com/svn/trunk/player/testmod/iqiyi_out.swf',
                    'pps': 'http://haoutil.googlecode.com/svn/trunk/player/testmod/pps.swf',
                    'tudou': 'http://haoutil.googlecode.com/svn/trunk/player/testmod/tudou.swf',
                    'letv': 'http://haoutil.googlecode.com/svn/trunk/player/testmod/letv.swf',
//已无效                    'letvviki':'http://code.taobao.org/svn/noadsplayer/trunk/Player/letvviki-YN.swf',
                    'sohu':'http://code.taobao.org/svn/noadsplayer/trunk/Player/sohu.swf',
//======================在线版地址结束======================================================================================
 //双虚线之间的地址不能换为本地地址，否则外联出错，请尽量更改为自己的服务器地址！
                    'letv_o': 'http://code.taobao.org/svn/noadsplayer/trunk/Player/letv.swf',
		    'letv_c': 'http://code.taobao.org/svn/noadsplayer/trunk/Player/letv0225.swf',
                    'tudou_olc': 'http://haoutil.googlecode.com/svn/trunk/player/testmod/olc_8.swf',
                    'tudou_sp': 'http://haoutil.googlecode.com/svn/trunk/player/testmod/sp.swf',
					'letvpccs': 'http://www.letv.com/zt/cmsapi/playerapi/pccs_sdk_$1.xml',
//=======================本地版地址开始=====================================================================================
//以下为本地版地址默认已使用（/* */）注释掉！
/*                    'youku_loader': chrome.extension.getURL('swf/loader.swf'),
                    'youku_player': chrome.extension.getURL('swf/player.swf'),
                    'ku6': chrome.extension.getURL('swf/ku6.swf'),
                    'ku6_out': chrome.extension.getURL('swf/ku6_out.swf'),
                    'iqiyi': chrome.extension.getURL('swf/iqiyi.swf'),
                    'iqiyi5': chrome.extension.getURL('swf/iqiyi5.swf'),
                    'iqiyi_out': chrome.extension.getURL('swf/iqiyi_out.swf'),
                    'pps': chrome.extension.getURL('swf/pps.swf'),
                    'tudou': chrome.extension.getURL('swf/tudou.swf'),
                    'tudou_olc': chrome.extension.getURL('swf/olc.swf'),
                    'tudou_sp': chrome.extension.getURL('swf/sp.swf'),
                    'letv': chrome.extension.getURL('swf/letv.swf'),  
//已无效                    'letvviki': chrome.extension.getURL('swf/letvviki.swf'),  
                    'sohu': chrome.extension.getURL('swf/sohu.swf'),
//========================本地版地址结束========================================================
*/
               };
            }
            return this._players;
        },
        get rules() {
            if(!this._rules) {
                this._rules = {
                    'youku_loader': {
                        'find': /^http:\/\/static\.youku\.com(\/v[\d\.]+)?\/v\/swf\/loader\.swf/i,
                        'replace': this.players['youku_loader']
                    },
                    'youku_player': {
                        'find': /^http:\/\/static\.youku\.com(\/v[\d\.]+)?\/v\/swf\/q?player[^\.]*\.swf(\?.*)?/i,
                        'replace': this.players['youku_loader'] + '$2'
                    },
                    'youku_out': {
                        'find': /^http:\/\/player\.youku\.com\/player\.php\/.*sid\/([\w=]+).*(\/v)?\.swf.*/i,
                        'replace': this.players['youku_loader'] + '?showAd=0&VideoIDS=$1'
                    },
                    'ku6': {
                        'find': /^http:\/\/player\.ku6cdn\.com\/default\/.*\/\d+\/player\.swf/i,
                        'replace': this.players['ku6']
                    },
                    'ku6_out': {
                        'find': /^http:\/\/player\.ku6\.com\/(inside|refer)\/([^\/]+)\/v\.swf.*/i,
                        'replace': this.players['ku6_out'] + '?vid=$2'
                    },
                    'iqiyi': {
                        'find': /^http:\/\/www\.iqiyi\.com\/player\/\d+\/player\.swf|http:\/\/www\.bilibili\.tv\/.*\/iqiyi\.swf/i,
                        'replace': this.players['iqiyi']
                    },
                    'iqiyi_out': {
                        'find': /^http:\/\/(player|dispatcher)\.video\.i?qiyi\.com\/(.*[\?&]vid=)?([^\/&]+).*/i,
                        'replace': this.players['iqiyi_out'] + '?vid=$3'
                    },
                    'pps': {
                        'find': /^http:\/\/www\.iqiyi\.com\/player\/cupid\/.*\/pps[\w]+.swf/i,
                        'replace': this.players['pps']
                    },
                    'tudou': {
                        'find': /^http:\/\/js\.tudouui\.com\/.*player[^\.]*\.swf/i,
                        'replace': this.players['tudou']
                    },
                    'tudou_out': {
                        'find': /^http:\/\/www\.tudou\.com\/.*(\/v\.swf)?/i,
                        //'find': /^http:\/\/www\.tudou\.com\/.*\/v\.swf/i,
                        'replace': this.players['tudou_olc'] + '?tvcCode=-1&swfPath=' + this.players['tudou_sp']
                    },
/*                    'letvcore': {
                        'find': /^http:\/\/.*letv[\w]*\.com\/.*\/KLetvPlayer\.swf/i,
                        'replace':  this.players['letvcore']
                    },
                    'letvviki': {
                        'find': /^http:\/\/.*letv[\w]*\.com\/.*\/V[^\.]*\.swf/i,
                        'replace': this.players['letvviki']
                    },
*/
                    'letv': {
                        'find': /^http:\/\/.*letv[\w]*\.com\/.*\/(?!(Live|seed))((S[\w]{2,3})?[\w]{4}|swf)Player[^\.]*\.swf/i,
                        'replace': this.players['letv']
                    },
                    'letvpccs': {
                        'find': /http:\/\/www.letv.com\/zt\/cmsapi\/playerapi\/pccs.*_(\d+)\.xml/i,
                        'replace': this.players['letvpccs']
                    },

                    'letv_c': {
                        'find': /^http:\/\/.*(letv[\w]*|dwstatic)\.com\/.*(cloud|vpp)\.swf/i,
                        'replace': this.players['letv_c']
                    },
                    'letv_out': {
                        'find': /^http:\/\/.*\.letvimg\.com\/.*\/(letvbili|lbplayer|letv-wrapper)\.swf/i,
                        'replace': this.players['letv_o']
                    },
 /*                   'pplive': {
                        'find': /^http:\/\/player\.pplive\.cn\/ikan\/.*\/player4player2\.swf/i,
                        'replace': this.players['pplive']
                    },
                    'pplive_live': {
                        'find': /^http:\/\/player\.pplive\.cn\/live\/.*\/player4live2\.swf/i,
                        'replace': this.players['pplive_live']
                    },
 */
                    'sohu': {
                        'find': /^http:\/\/(tv\.sohu\.com\/upload\/swf\/.*\d+|.*\/test\/player)\/(main|playershell)\.swf/i,
                        'replace': this.players['sohu']
		    }
                }
            }
            return this._rules;
        },
        get done() {
            if(!this._done) {
                this._done = new Array();
            }
            return this._done;
        },
        initPreHandlers: function() {
            this.rules['iqiyi']['preHandle'] = function(elem, find, replace, player) {
                if(document.querySelector('span[data-flashplayerparam-flashurl]')) {
                    replace = this.players['iqiyi5'];
                }
                this.reallyReplace.bind(this, elem, find, replace)();
            }
            this.rules['iqiyi_out']['preHandle'] = function(elem, find, replace, player) {
                var match = player.match(/(autoplay)=[^&]+/ig);
                if(match) {
                    replace += '&' + match.join('&');
                }
                this.reallyReplace.bind(this, elem, find, replace)();
            }
            this.rules['tudou_out']['preHandle'] = function(elem, find, replace, player) {
                var fn = this;
                var isFx = /firefox/i.test(navigator.userAgent);
                GM_xmlhttpRequest({
                    method: isFx ? 'HEAD' : 'GET',
                    //url: isFx ? player : 'http://lovejiani.cdn.duapp.com/kafan/tfetcher?turl=' + encodeURIComponent(player + '/v.swf'),
                    url: isFx ? player : 'https://query.yahooapis.com/v1/public/yql?format=json&q=' + encodeURIComponent('use"https://haoutil.googlecode.com/svn/trunk/firefox/tudou_redirect.yql.xml" as tudou; select * from tudou where url="' + player + '" and referer="' + window.location.href + '"'),
                    onload: function(response) {
                        var finalUrl = (isFx ? response.finalUrl : response.responseText);
                        var match = finalUrl.match(/(iid|youkuid|resourceid|autoplay|snap_pic)=[^&]+/ig);
                        if(match && !/error/i.test(finalUrl)) {
                            replace += '&' + match.join('&');
                            fn.reallyReplace.bind(fn, elem, find, replace)();
                        }
                    }
                });
            }
        },
        addAnimations: function() {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = 'object,embed{\
-webkit-animation-duration:.001s;-webkit-animation-name:playerInserted;\
-ms-animation-duration:.001s;-ms-animation-name:playerInserted;\
-o-animation-duration:.001s;-o-animation-name:playerInserted;\
animation-duration:.001s;animation-name:playerInserted;}\
@-webkit-keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}\
@-ms-keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}\
@-o-keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}\
@keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}';
            document.getElementsByTagName('head')[0].appendChild(style);
        },
        animationsHandler: function(e) {
            if(e.animationName === 'playerInserted') {
                this.replace(e.target);
            }
        },
        replace: function(elem) {
            if(this.done.indexOf(elem) != -1) return;
            this.done.push(elem);

            var player = elem.data || elem.src;
            if(!player) return;

            var i, find, replace, isReplacing = false;
            for(i in this.rules) {
                find = this.rules[i]['find'];
                if(find.test(player)) {
                    replace = this.rules[i]['replace'];
                    if('function' === typeof this.rules[i]['preHandle']) {
                        isReplacing = true;
                        this.rules[i]['preHandle'].bind(this, elem, find, replace, player)();
                    }
                    if(!isReplacing) {
                        this.reallyReplace.bind(this, elem, find, replace)();
                    }
                    break;
                }
            }
        },
        reallyReplace: function(elem, find, replace) {
            elem.data && (elem.data = elem.data.replace(find, replace)) || elem.src && ((elem.src = elem.src.replace(find, replace)) && (elem.style.display = 'block'));
            this.reloadPlugin(elem);
        },
        reloadPlugin: function(elem) {
            var nextSibling = elem.nextSibling;
            var parentNode = elem.parentNode;
            parentNode.removeChild(elem);
            var newElem = elem.cloneNode(true);
            this.done.push(newElem);
            if(nextSibling) {
                parentNode.insertBefore(newElem, nextSibling);
            } else {
                parentNode.appendChild(newElem);
            }
        },
        init: function() {
            this.initPreHandlers();

            var handler = this.animationsHandler.bind(this);

            document.body.addEventListener('webkitAnimationStart', handler, false);
            document.body.addEventListener('msAnimationStart', handler, false);
            document.body.addEventListener('oAnimationStart', handler, false);
            document.body.addEventListener('animationstart', handler, false);

            this.addAnimations();
        }
    };

    new YoukuAntiAds().init();
})();