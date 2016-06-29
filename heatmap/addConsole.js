/*
(function(){
    var pkg = {};
    var q = void 0,
        r = !0,
        s = null,
        w = !1;
    pkg.nm = {};
    pkg.nm.getFromURI = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    };
    pkg.event = {};
    pkg.event.add = function(target, types, fn) {
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
   
    
    (function(){
        var p = pkg.nm,
            e = pkg.event,
            dhandler = {
                add:function(){
                    var l = document.createElement("link"),
                        pl = document.head,
                        s = document.createElement("script"),
                        ps = document.getElementsByTagName('script')[0];
                    
                    s.src = "http://1.feliciaqin.sinaapp.com/heatmap/mobile-console.min.js";
                    ps.parentNode.insertBefore(s, ps);
                    
                    l.rel = "stylesheet";
                    l.href = "http://1.feliciaqin.sinaapp.com/heatmap/mobile-console.min.css";
                    pl.appendChild(l, pl);
                },
                load:function(){
                    mobileConsole.show();
                    var console = document.getElementById('js-mobile-console');
                    if(console){
                        e.add(console,'click',function(ev){
                        	ev.stopPropagation();
                        });
                    }
                }
            };
        
        dhandler.add();
        //e.add(window, 'load',dhandler.load);
        window.addEventListener('load',dhandler.load,false);
        
    })();
})();*/

(function(){
    
     var l = document.createElement("link"),
         pl = document.head,
         s = document.createElement("script"),
         ps = document.getElementsByTagName('script')[0],
         bd = document.body;
    
    s.src = "http://1.feliciaqin.sinaapp.com/heatmap/mobile-console.min.js";
    ps.parentNode.insertBefore(s, ps);
    
    l.rel = "stylesheet";
    l.href = "http://1.feliciaqin.sinaapp.com/heatmap/mobile-console.min.css";
    pl.appendChild(l, pl);
    
    s.src = "http://192.168.37.128:8081/target/target-script-min.js#anonymous";
    bd.appendChild(s,bd);
    
    setTimeout(function(){
     mobileConsole.show();   
    },10e3);  
    /*function load(){
        mobileConsole.show();
        var console = document.getElementById('js-mobile-console');
        if(console){
            console.addEventListener('click',function(ev){
                ev.stopPropagation();
            });
        }
    }
    window.addEventListener('load',function(){
     	setTimeout(load,1e3);   
    },false);*/
    
})();
