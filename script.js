(function() {
    Function.prototype.bind = function() {
        var fn = this, args = Array.prototype.slice.call(arguments), obj = args.shift();
        return function() {
            return fn.apply(obj, args.concat(Array.prototype.slice.call(arguments)));
        };
    };

    function YoukuAntiAds() {}
    YoukuAntiAds.prototype = {
        iURL: ['http://appbank.qiniudn.com/', 'http://gesion.duapp.com/player/', 'http://code.taobao.org/svn/mujj/trunk/swf/', chrome.extension.getURL('swf/')],  
		 //在线地址供参考，请自行替换为自己的！因被墙GCode地址已取不到！iURL[0]表示[]中第一个地址（即在线），以此类推！
        _players: null,
        _rules: null,
        _done: null,

        get rules() {
            if(!this._rules) {
                this._rules = {
                    'youku_loader': {
                        'find': /^http:\/\/static\.youku\.com(\/v[\d\.]*)?\/v\/swf\/loaders?\.swf/i,
                        'replace': this.iURL[0] + 'loader.swf'
                    },
                    'youku_player': {
                        'find': /^http:\/\/static\.youku\.com(\/v[\d\.]+)?\/v\/swf\/q?player[^\.]*\.swf(\?.*)?/i,
                        'replace': this.iURL[0] + 'loader.swf' + '$2'
                    },
                    'youku_out': {
                        'find': /^http:\/\/player\.youku\.com\/player\.php\/.*sid\/([\w=]+).*(\/v)?\.swf.*/i,
                        'replace': this.iURL[0] + 'loader.swf' + '?showAd=0&VideoIDS=$1'
                    },
                    'ku6': {
                        'find': /^http:\/\/player\.ku6cdn\.com\/default\/loader\/.*\/(v|player)\.swf/i,
                        'replace': this.iURL[0] + 'ku6.swf'
                    },
                    'ku6_out': {
                        'find': /^http:\/\/player\.ku6\.com\/(inside|refer)\/([^\/]+)\/v\.swf.*/i,
                        'replace': this.iURL[0] + 'ku6_out.swf' + '?vid=$2'
                    },
                    'iqiyi': {
                        'find': /^http:\/\/www\.iqiyi\.com\/player\/(\d+\/Player|[a-z0-9]*)\.swf|http:\/\/www\.bilibili\.tv\/iqiyi\.swf/i,
                        'replace': this.iURL[0] + 'iqiyi.swf'
                    },
                    'iqiyi_out': {//如果有更多外链，请反馈给我，以便完善！
                        'find': /^http:\/\/player\.video\.i?qiyi\.com\/([^\/]*)\/.*tvId=([^-]*).*/i,
                        'replace': this.iURL[0] + 'iqiyi_out.swf' + '?vid=$1&tvId=$2&autoplay=1'
                    },
                    'iqiyi_out1': {//如果有更多外链，请反馈给我，以便完善！这个baidu.iqiyi.com类型
						//'find': /^http:\/\/(player|dispatcher)\.video\.i?qiyi\.com\/.*\/shareplayer\.swf|http:\/\/player\.video\.qiyi\.com\/qiyi/i,
                        'find': /^http:\/\/(player|dispatcher)\.video\.i?qiyi\.com\/(.*\/shareplayer\.swf|qiyi)/i,
                        'replace': this.iURL[0] + 'iqiyi_out.swf'
                    },
                    'pps': {
                        'find': /^http:\/\/www\.iqiyi\.com\/player\/cupid\/.*\/pps[\w]+.swf/i,
                        'replace': this.iURL[0] + 'pps.swf'
                    },
                    'pplive': {
                        'find': /^http:\/\/player\.pplive\.cn\/ikan\/.*\/player4player2\.swf/i,
                        'replace': this.iURL[0] + 'pplive.swf'
                    },
                    'pplive_live': {
                        'find': /^http:\/\/player\.pplive\.cn\/live\/.*\/player4live2\.swf/i,
                        'replace': this.iURL[0] + 'pplive_live.swf'
                    },
                    'tudou': {
                        'find': /^http:\/\/js\.tudouui\.com\/.*player[^\.]*\.swf/i,
                        'replace': this.iURL[0] + 'tudou.swf'
                    },
                    'tudou_out': {//此项基本失效！
                        'find': /^http:\/\/www\.tudou\.com\/.*(\/v\.swf)?/i,
                        //'find': /^http:\/\/www\.tudou\.com\/.*&iid=(\d+)\/v\.swf/i,
                        //'replace': this.iURL[0] + 'olc_8.swf' + '?iid=$1&swfPath=' + this.iURL[0] + 'sp.swf'
                        'replace': this.iURL[0] + 'olc_8.swf'+ '?tvcCode=-1&swfPath=' + this.iURL[0] + 'sp.swf'
                    },
                    'letv': {
                        'find': /^http:\/\/.*letv[\w]*\.com\/.*\/(?!(Live|seed))((S[\w]{2,3})?(?!live)[\w]{4}|swf)Player[^\.]*\.swf/i,
                        'replace': this.iURL[0] + 'letv.swf'
                    },
                    'letv_hz': {
                        'find': /^http:\/\/.*letv[\w]*\.com\/(hz|.*player\/(s)?sdkletv)player\.swf.*/i,
                        'replace': this.iURL[0] + 'letv.swf'
                    },
                    'letv_c': {
                        'find': /^http:\/\/.*(letv[\w]*|dwstatic)\.com\/.*(cloud|vpp)\.swf/i,
                        'replace': this.iURL[0] + 'letv0225.swf'
                    },
                    'letv_out': {
                        'find': /^http:\/\/.*\.letvimg\.com\/.*\/(letvbili|lbplayer|letv-wrapper|acfunletv[^\.]*)\.swf/i,
                        'replace': this.iURL[0] + 'letv.swf'
                    },
                    'letv_skin': {
                        'find': /http:\/\/.*letv[\w]*\.com\/p\/\d+\/\d+\/(?!1456)\d*\/newplayer\/\d+\/SLetvPlayer\.swf/i,
                        'replace': 'http://player.letvcdn.com/p/201403/05/1456/newplayer/1/SLetvPlayer.swf'
                    },
                    'sohu': {
                        'find': /^http:\/\/(tv\.sohu\.com\/upload\/swf\/.*\d+|.*\/test\/player)\/(main|playershell)\.swf/i,
                        'replace': this.iURL[0] + 'sohu.swf'
                    },
                    'sohu_out': {
                        'find': /^http:\/\/.*\.sohu\.com\/my\/v\.swf(.*)/i,
                        'replace': this.iURL[0] + 'sohu.swf' + '?$1'
                    },
                    'sohu_out_2': {
                        'find': /^http:\/\/.*\.sohu\.com\/(\d*)\/v\.swf/i,
                        'replace': this.iURL[0] + 'sohu.swf' + '?vid=$1'
                    },
                    '17173': {//PreloaderFile.swf
                        'find': /^http:\/\/f\.v\.17173cdn\.com\/\d*\/flash\/.*(file)\.swf/i,
                        'replace': this.iURL[0] + '17173/17173.swf' 
                    },
                    '17173_live': {
                        'find': /^http:\/\/f\.v\.17173cdn\.com\/\d*\/flash\/.*(stream).*\.swf/i,
                        'replace': this.iURL[0] + '17173/17173_live.swf'
                    },
                    '17173_out': {
                        'find': /^http:\/\/f\.v\.17173cdn\.com\/player_f2\/(\w+)\.swf/i,
                        'replace': this.iURL[0] + '17173/17173_out.swf' + '?cid=$1'
                    },
                    '17173_out1': {
                        'find': /^(http:\/\/17173\.tv\.sohu\.com\/player[^\.]*\.swf)/i,
                        'replace': this.iURL[0] + '17173/17173_out.swf'
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
                    replace = this.iURL[0] + 'iqiyi5.swf';
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
                        var match = finalUrl.match(/(iid|youkuid|resourceid|autoplay|snap_pic|code)=[^&]+/ig);
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
