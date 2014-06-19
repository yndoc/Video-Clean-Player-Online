(function() {
    Function.prototype.bind = function() {
        var fn = this, args = Array.prototype.slice.call(arguments), obj = args.shift();
        return function() {
            return fn.apply(obj, args.concat(Array.prototype.slice.call(arguments)));
        };
    };

    function YoukuAntiAds() {}
    YoukuAntiAds.prototype = {
        iURL: chrome.extension.getURL('swf/'),  //本地地址,默认！
//        iURL: 'http://code.taobao.org/svn/mujj/trunk/swf/',  //在线地址
        iURL_on: 'http://code.taobao.org/svn/mujj_test/trunk/swf/', //必须在线的地址
        _players: null,
        _rules: null,
        _done: null,
        get players() {
            if(!this._players) {
                this._players = {
//=====================在线版or本地版（由iURL决定）地址开始=================================================
//双虚线之前为在线地址，请自行需该服务器地址！如使用本地版请注释掉双虚线以上地址
                    'youku_loader': this.iURL + 'loader.swf',
                    'youku_player': this.iURL + 'player.swf',
                    'ku6': this.iURL + 'ku6.swf',
                    'ku6_out': this.iURL + 'ku6_out.swf',
                    'iqiyi': this.iURL + 'iqiyi.swf',
                    'iqiyi5': this.iURL + 'iqiyi5.swf',
                    'iqiyi_out': this.iURL + 'iqiyi_out.swf',
                    'pps': this.iURL + 'pps.swf',
                    'pplive': this.iURL + 'pplive.swf',
                    'pplive_live': this.iURL + 'pplive_live.swf',
                    'tudou': this.iURL + 'tudou.swf',
                    'letv': this.iURL + 'letv.swf',
//                    'sohu':this.iURL + 'sohu.swf',
//                    '17173': this.iURL + '17173/17173.swf', 
//                    '17173_live': this.iURL + '17173/17173_live.swf',
//======================必须在线版地址开始======================================================================================
//双虚线之间的地址不能换为本地地址，否则外联出错，请尽量更改为自己的服务器地址！
                    'letv_o': this.iURL_on + 'letv.swf',
                    'letv_c': this.iURL_on + 'letv0225.swf',
                    'tudou_olc': this.iURL_on + 'olc_8.swf',
                    'tudou_sp': this.iURL_on + 'sp.swf',
                    'sohu': this.iURL_on + 'sohu/sohu.swf',
                    '17173': this.iURL_on + '17173/17173.swf', 
                    '17173_live': this.iURL_on + '17173/17173_live.swf',
//========================必须在线版地址结束========================================================
               };
            }
            return this._players;
        },
        get rules() {
            if(!this._rules) {
                this._rules = {
                    'youku_loader': {
                        'find': /^http:\/\/static\.youku\.com(\/v[\d\.]*)?\/v\/swf\/loaders?\.swf/i,
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
                        'find': /^http:\/\/player\.ku6cdn\.com\/default\/.*\/\d+\/(v|player)\.swf/i,
                        'replace': this.players['ku6']
                    },
                    'ku6_out': {
                        'find': /^http:\/\/player\.ku6\.com\/(inside|refer)\/([^\/]+)\/v\.swf.*/i,
                        'replace': this.players['ku6_out'] + '?vid=$2'
                    },
                    'iqiyi': {
                        'find': /^http:\/\/www\.iqiyi\.com\/player\/\d+\/player\.swf|http:\/\/www\.bilibili\.tv\/iqiyi\.swf/i,
                        'replace': this.players['iqiyi']
                    },
                    'iqiyi_out': {
                        //'find': /^http:\/\/(player|dispatcher)\.video\.i?qiyi\.com\/(.*[\?&]vid=)?([^\/&]+).*/i,
                        'find': /^http:\/\/player\.video\.qiyi\.com\/([^\/]*)\/.*tvId=([^-]*).*$/i,
                        //'replace': this.players['iqiyi_out'] + '?vid=$3'
                        'replace': this.players['iqiyi_out'] + '?vid=$1&tvId=$2&autoplay=1'
                    },
                    'iqiyi_out2': {
                        'find': /^http:\/\/(player|dispatcher)\.video\.i?qiyi\.com\/.*\/shareplayer\.swf/i,
                        'replace': this.players['iqiyi_out']
                    },
                    'pps': {
                        'find': /^http:\/\/www\.iqiyi\.com\/player\/cupid\/.*\/pps[\w]+.swf/i,
                        'replace': this.players['pps']
                    },
                    'pplive': {
                        'find': /^http:\/\/player\.pplive\.cn\/ikan\/.*\/player4player2\.swf/i,
                        'replace': this.players['pplive']
                    },
                    'pplive_live': {
                        'find': /^http:\/\/player\.pplive\.cn\/live\/.*\/player4live2\.swf/i,
                        'replace': this.players['pplive_live']
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
                    'letv': {
                        'find': /^http:\/\/.*letv[\w]*\.com\/.*\/(?!(Live|seed))((S[\w]{2,3})?[\w]{4}|swf)Player[^\.]*\.swf/i,
                        'replace': this.players['letv']
                    },
                    'letv_hz': {
                        'find': /^http:\/\/.*letv[\w]*\.com\/(hz|.*player\/(s)?sdkletv)player\.swf.*/i,
                        'replace': this.players['letv']
                    },
                    'letv_c': {
                        'find': /^http:\/\/.*(letv[\w]*|dwstatic)\.com\/.*(cloud|vpp)\.swf/i,
                        'replace': this.players['letv_c']
                    },
                    'letv_out': {
                        'find': /^http:\/\/.*\.letvimg\.com\/.*\/(letvbili|lbplayer|letv-wrapper|acfunletv[^\.]*)\.swf/i,
                        'replace': this.players['letv_o']
                    },
                    'letv_skin': {
                        'find': /http:\/\/.*letv[\w]*\.com\/p\/\d+\/\d+\/(?!1456)\d*\/newplayer\/\d+\/SLetvPlayer\.swf/i,
                        'replace': 'http://player.letvcdn.com/p/201403/05/1456/newplayer/1/SLetvPlayer.swf'
                    },
                    'sohu': {
                        'find': /^http:\/\/(tv\.sohu\.com\/upload\/swf\/.*\d+|.*\/test\/player)\/(main|playershell)\.swf/i,
                        'replace': this.players['sohu']
                    },
                    'sohu_out_1': {
                        'find': /^http:\/\/.*\.sohu\.com\/my\/v\.swf/i,
                        'replace': this.players['sohu'] + '?'
                    },
                    'sohu_out_2': {
                        'find': /^http:\/\/.*\.sohu\.com\/(\d+)\/v\.swf/i,
                        'replace': this.players['sohu'] + '?vid=$1'
                    },
                    '17173': {
                        'find': /^http:\/\/f\.v\.17173cdn\.com\/(\d+)\/flash\/.*(file)\.swf/i,
                        'replace': this.players['17173'] 
                    },
                    '17173_live': {
                        'find': /^http:\/\/f\.v\.17173cdn\.com\/(\d+)\/flash\/.*(stream).*\.swf/i,
                        'replace': this.players['17173_live']
                    },
                    '17173_out': {
                        'find': /^http:\/\/f\.v\.17173cdn\.com\/player_f2\/.*\.swf/i,
                        'replace': this.players['17173'] + '?autoplay=0'
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
