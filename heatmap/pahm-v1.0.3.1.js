/** pahm.js : collector script
 * @author: ex-qinfang001
 */
(function() {
    var h = {},
        mt = {},
        c = {
            a: 100,
            b: 100,
            s: "/common/skipTo.action?aimCode=pogSgo/CIOHguODNU9u1FLJX0BsEi/1d"
        };
    var q = void 0,
        r = !0,
        s = null,
        w = !1;
        
    var b_sd = false,
        bu_ = typeof bu != 'undefined'? bu : ["https://gbd.pa18.com/pabrain", "https://test-gbd.pa18.com:42443/pabrain"],
        touchSupport = ('ontouchstart' in window) || window.DocumentTouch && document instanceof Document;

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
    mt.event = {};
    mt.event.add = function(target, types, fn) {
        if (target && target.length){
            for (var i = 0, len = target.length; i < len; i++) {
                (function(idx) {
                    target[idx].addEventListener(types, fn, w);
                })(i)
            } 
        } else {
            target.addEventListener(types, fn, w);
        }
    };
    mt.event.pointer = function(e){
     	var out = {x:0, y:0};
      	if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
      		var touch = e.touches[0] || e.changedTouches[0];
      		out.x = touch.pageX;
      		out.y = touch.pageY;
      	} else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave' || e.typ =='click') {
      		out.x = e.pageX;
      		out.y = e.pageY;
      	}   
        return out;
    }
    h.d = {
        dom: ['body'],
        time: 5*60,
        pluginID: "",
        refer: 0
    };
    h.data = [];
    h.dtemp = [];
    h.el = [];
    h.urls = [window.location.href];
    (h.cfg = function() {
        var u = mt.p,
            d = h.d;
        if (typeof config_ != "undefined" && typeof config_ === "object") return u.extend(d, config_);
        return d;
    }());
    (function() {
        var cfg = h.cfg,
            e = mt.event,
            u = mt.p,
            us = h.urls,
            sd = h.data,
            std = h.dtemp,
            els = h.el;

        function Collector() {
            this.pn = 1 ;
            this.init.apply(this, arguments);
        }
        Collector.prototype = {
            init: function() {
                this.listen(document);
            },
            listen: function(elem) {
                //e.add(elem, 'click', this.make.bind(this));
                var self = this,
                    eventType = touchSupport?'touchstart':'mousedown'; //'mousedown';
                console && console.log('touch event surports:'+ touchSupport);
                //e.add(elem,eventType, this.make.bind(this));
                elem.addEventListener(eventType,function(ev){
                    self.make(ev);
                },false);
            },
            set:function(data,index){
                if (data.hasOwnProperty(index)) {
                    data[index] = data[index] + 1;
                } else {
                    data[index] = 1;
                }
                return data;
            },
            make: function(ev) {
                console.log(ev.type);
                var ev = window.event || ev,
                    x = e.pointer(ev).x,
                    y = e.pointer(ev).y,
                    //x = ev.pageX,
                    //y = ev.pageY,
                    cw = window.innerWidth,
                    ch = window.innerHeight,
                    cx = cw / c.a,
                    cy = ch / c.b,
                    index = Math.floor(y / cy) * c.a + Math.floor(x / cx),
                    d = {pluginID : cfg.pluginID,wh : cw + "," + ch,href : window.location.href},
                    data = {},b_fd = false,b_std = [],
                    i,j,l,ln;
                
                d.pageNum = this.pn;
                if(us.join().indexOf(d.href) == -1){
                	us.push(d.href);
                    d.pageNum = 1;
                }
                if(!b_sd){
                    console && console.log('available')
                    if(std.length){
                        if(sd.length){
                            for(i=0,l=std.length;i<l;i++){
                                for(j=0,ln = sd.length;j<ln;j++){
                                    if(std[i].href == sd[j].href && std[i].pageNum == sd[j].pageNum && std[i].wh == sd[j].wh){
                                       	sd[j].data = this.set(std[i].data,index);
                                        b_std[i] = true;
                                        console.log('find from sd, i:'+i);
                                        break;
                                    } 
                                }
                                console.log('end find from sd i:'+i);
                                if(!b_std[i]){
                                    sd.push(std[i]);
                                }else{
                                 	if(b_std.length == ln) break;   
                                }
                            }
                        }else{
                         	sd = std.concat();   
                        } 
                        std = [];
                    }
	                for(i=0,l=sd.length;i<l;i++){
	                    if(sd[i].href == d.href && sd[i].pageNum == d.pageNum && sd[i].wh == d.wh){
	                        data = sd[i].data;
	                        b_fd = true;
	                     	break;   
	                    }
	                }
                   
                } 
                else {
                    console && console.log('sending by the way');
                    for(i=0,l=std.length;i<l;i++){
	                    if(std[i].href == d.href && std[i].pageNum == d.pageNum && std[i].wh == d.wh){
	                        data = std[i].data;
	                        //b_std = true;
	                     	break;   
	                    }
	                }
                }
                
        		d.data = this.set(data,index);
                if(!b_fd){
                	sd.push(d); 
                }
                
                console && console.log(index + "(" + x + "," + y + ") -->" + data[index]+ "  pageNum -->"+ d.pageNum+"  href -->"+d.href +"  wh -->"+d.wh);
                //ev.stopPropagation();
                //e.preventDefault();
                
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
            ims = bu_[parseInt(cfg.refer) || 0] + c.s,
            els = h.el,
            sd = h.data;

        function a() {
            this.init.apply(this, arguments);
            console && console.log("Init collector script...");
        }

        a.prototype = {
            init: function() {
                //e.add(window, "load", this.load.bind(this));
                //e.add(window, "unload", this.send.bind(this));
                window.addEventListener("load", this.load.bind(this),false);
                window.addEventListener("unload", this.send.bind(this),false);
            },
            load: function() {
                var self =this,
                    elems = document.querySelectorAll(cfg.dom.join()),
                    evtype = touchSupport?'touchstart':'mousedown',
                    clct =new m(),
                    i, l;
                
                for (i = 0, l = elems.length; i < l; i++) {
                    (function(idx){
                        elems[idx].addEventListener(evtype,function(e){
                            clct.pn = idx + 1;
                        },false);
                    })(i)
                }
                
                setInterval(this.send.bind(this), cfg.time * 1e3);
            },
            send: function() {
                var i, l, d,dr = sd.concat();
                console && console.log('in sending ...');
				b_sd = true;
				h.data = [];
				b_sd = false;
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
                        console && console.log("send... " + dr[i].data + "   pageNum : " + dr[i].pageNum);
                        dr[i].data = {};
                    }
                }
            }
        }
        return new a();
    })()
})();
