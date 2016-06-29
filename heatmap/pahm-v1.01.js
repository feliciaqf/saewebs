/** pahm.js : collector script
 * @author: ex-qinfang001
 */
(function() {
    var h = {},
        mt = {},
        c = {
            a: 100,
            b: 100,
            s: "/common/skipTo.action?aimCode=pogSgo/CIOHguODNU9u1FLJX0BsEi/1d",
            w: window.innerWidth,
            h: window.innerHeight
        };
    var q = void 0,
        r = !0,
        s = null,
        w = !1,
        bu = bu || ["https://gbd.pa18.com/pabrain", "https://test-gbd.pa18.com:42443/pabrain"];

    mt.p = {};
    mt.p.extend = function(target, source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                target[p] = source[p];
            }
        }
        return target;
    };
    mt.p.jsonToURI = function(s) {
        if (typeof s === "object") {
            var ts = '',
                key;
            for (key in s) {
                if (typeof s[key] === "object") {
                    ts += '&' + key + "=" + encodeURIComponent(JSON.stringify(s[key]));
                } else {
                    ts += '&' + key + "=" + encodeURIComponent(s[key]);
                }
            }
            return ts.substr(1);
        }
        return s;
    };
    mt.p.isEmptyObject = function(obj) {
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) return w;
        }
        return r;
    };
    mt.p.getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    };
    mt.event = {};
    mt.event.add = function(target, types, fn) {
        if (target && target.length)
            for (var i = 0, len = target.length; i < len; i++) {
                (function(idx) {
                    target[i].addEventListener(types, fn, w);
                })(i)
            } else {
            target.addEventListener(types, fn, w);
        }
    };
    h.d = {
        dom: ['body'],
        time: 5*60,
        pluginID: "",
        refer: 0
    };
    h.data = [];
    h.el = [];
    (h.cfg = function() {
        var u = mt.p,
            d = h.d;
        if (typeof config_ != "undefined" && typeof config_ === "object") return u.extend(d, config_);
        return d;
    }());
    (function(){
    	var u = mt.p,
            e = mt.event,
            debug = u.getQueryString('pahm_debug'),
            dhandler = {
	            add:function(){
			    	var l = document.createElement("link"),
			    		pl = document.getElementsByTagName('head')[0],
			    		s = document.createElement("script"),
			    		ps = document.getElementsByTagName('script')[0];
			        
			        l.rel = "stylesheet";
			        l.href = "http://1.feliciaqin.sinaapp.com/heatmap/mobile-console.min.css";
			        pl.appendChild(l, pl);

			        s.src = "http://1.feliciaqin.sinaapp.com/heatmap/mobile-console.min.js";
			        ps.parentNode.insertBefore(s, ps);
	            },
	            load:function(){
	                mobileConsole.show();
	            }
            };

        if (debug == "true"){
        	dhandler.add();
        	e.add(window, 'load',dhandler.load);
        }
    })();
    (function() {
        var cfg = h.cfg,
            e = mt.event,
            u = mt.p;

        function Collector() {
            this.data = {
                href: window.location.href,
                pageNum: (arguments[0] || 0) + 1, //页面编号
                pluginID: cfg.pluginID,
                wh: c.w + "," + c.h,
                data: {}
            };
            this.init.apply(this, arguments);
        }
        Collector.prototype = {
            init: function() {
                this.listen(arguments[1] || document);
            },
            listen: function(elem) {
                e.add(elem, 'click', this.make.bind(this));
            },
            make: function(e) {
                var e = window.event || e,
                    x = e.pageX,
                    y = e.pageY,
                    d = this.data,
                    data = d.data,
                    cx = c.w / c.a,
                    cy = c.h / c.b,
                    index = Math.floor(y / cy) * c.a + Math.floor(x / cx);

                if (data.hasOwnProperty(index)) {
                    data[index] = data[index] + 1;
                } else {
                    data[index] = 1;
                }
                console && console.log(index + "(" + x + "," + y + ") -->" + data[index], "pageNum -->", d.pageNum);
                e.stopPropagation();
                e.preventDefault();
            }

        };
        return h.M = Collector;
    })();
    (function() {
        var u = mt.p,
            e = mt.event,
            cfg = h.cfg,
            d = h.d,
            m = h.M,
            ims = bu[parseInt(cfg.refer) || 0] + c.s,
            els = h.el;

        function a() {
            this.init.apply(this, arguments);
            console && console.log("%cInit collector script...", 'color:#0FB2C7');
        }

        a.prototype = {
            init: function() {
                e.add(window, "load", this.load.bind(this));
                e.add(window, "unload", this.send.bind(this));
            },
            load: function() {
                var h = document.body.scrollHeight,
                    w = document.body.scrollWidth,
                    elems = document.querySelectorAll(cfg.dom.join()),
                    data = {
                        url: window.location.href,
                        h: h + 10,
                        w: w
                    },
                    i, l;
                for (i = 0, l = elems.length; i < l; i++) {
                    (function(idx) {
                        var clct = new m(idx, elems[idx]);
                        els.push(clct);
                    })(i);
                }
                new m(); //init document collector event
                setInterval(this.send.bind(this), cfg.time * 1e3);
                if (window.parent) {
                    window.parent.postMessage(data, '*');
                }
            },
            send: function() {
                var dr = h.data,
                    i, l, d;
                if (dr.length) dr = [];
                for (i = 0, l = els.length; i < l; i++) {
                    if (!u.isEmptyObject(els[i].data.data)) {
                        dr.push(els[i].data);
                    }
                }
                if (dr.length) {
                    for (i = 0, l = dr.length; i < l; i++) {
                        d = dr[i].data;
                        if (u.isEmptyObject(d)) return;
                        var img = new Image;
                        img.onload = img.onerror = img.onabort = function() {
                            img.onload = img.onerror = img.onabort = s;
                        }
                        dr[i].data = JSON.stringify(d).replace(/\"/g, "");
                        img.src = ims + "&" + u.jsonToURI(dr[i]);
                        console && console.log(u.jsonToURI(dr[i]));
                        console && console.log("%csend... " + dr[i].data + "   pageNum : " + dr[i].pageNum, 'color:#0FB2C7');
                        dr[i].data = {};
                        h.data = [];
                    }
                }
            }
        }
        return new a();
    })()
})();
