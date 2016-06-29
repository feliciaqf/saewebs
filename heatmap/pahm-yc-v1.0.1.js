/**
 * 杨超
 * 2015/11/16
 * 1.0 
 * @param {Object} win
 */
(function(win) {
	//map构造
	var Map = function() {
		this.keys = new Array();
		this.data = new Object();
		this.put = function(key, val) {
			if (this.data[key] == null) {
				this.keys.push(key);
			}
			this.data[key] = val;
		};
		this.clear = function() {
			this.keys = [];
			this.data = {};
		}
		this.toString = function() {
			var s = "{";
			for (var i = 0; i < this.keys.length; i++) {
				var k = this.keys[i];

				s += k + ":" + this.data[k];
				i == (this.keys.length - 1) ? '' : (s += ",");
			}
			s += "}";
			return s;
		};
	};
	var Rlt = function() {
		this.pageNum = 1;
		this.Init.apply(this, arguments);
	};
	Rlt.prototype = {
		Init: function() {
			var args = Array.prototype.slice.call(arguments);
			if (args && args.length > 0) {
				var config = args[0];
				if (config && typeof config == 'object') {
					this.config = config || {
						dom: [],
						time: time,
						pluginID: pluginID,
						refer: refer
					};
				}
			}
		},
		util: {
			getWindowsWH: function() {
				var ret = {};
				ret.width = window.innerWidth;
				ret.height = window.innerHeight;
				console.log(ret.width + "px," + ret.height + "px");
				return ret;
			},
			setPoint: function(x, y, a, cx, cy) {
				return Math.floor(y / cy) * a + Math.floor(x / cx);
			},
			PointArray: function() {
				console.log("初始化  PointArray");
				return new Array();
			},
			PointMap: function() {
				console.log("初始化  PointMap");
				return new Map();
			},
			getImg: function() {
				return new Image(1, 1);
			},
			getElement: function(str) {
				if (str.charAt(0) === '#') {
					var id = str.substring(1, str.length);
					return document.getElementById(id);
				} else if (str.charAt(0) === ".") {
					var clas = str.substring(1, str.length);
					return document.getElementsByClassName(clas);
				} else {
					return document.querySelectorAll(str);
				}
			},
			isArray: function(obj) {
				return obj.length;
			}
		},
		rtlTest: function(par) {
			//参数配置
			var def = {
				element: par.element,
				a: 100,
				b: 100,
				time: par.time == null ? 10 : par.time,
				url: bu[parseInt(par.refer) || 0] + "/common/skipTo.action?aimCode=pogSgo/CIOHguODNU9u1FLJX0BsEi/1d", //get请求URL
				pluginID: par.pluginID, //插件ID
				pageNum: this.pageNum, //页面编号
				href: window.location.href
			};
			//主体函数
			var that = this.util;
			var wh = that.getWindowsWH();
			var pointArray = that.PointArray();
			var pointMap = that.PointMap();
			var cx = wh.width / def.a; //分块大小
			var cy = wh.height / def.b;
			//数据清空
			var DataClear = function() {
				pointArray = [];
				pointMap.clear();
				console.log("---清空数据---");
			};
			//通过Image对象请求后端脚本
			var url_ = def.url + "&pluginID=" + def.pluginID + "&pageNum=" + def.pageNum + "&wh=" + wh.width + "," + wh.height + "&href=" + def.href + "&data=";
			var Post_ = function(u, data) {
				var img = that.getImg();
				img.src = u + data;
			};
			//整理数据
			var getData = function() {
					if (pointArray.length == 0) {
						return null;
					};
					for (var i = 0; i < pointArray.length; i++) {
						var val = 0;
						for (var j = 0; j < pointArray.length; j++) {
							if (pointArray[i] == pointArray[j]) {
								val++;
							}
						}
						pointMap.put(pointArray[i], val);
					}
					console.log("data:" + pointMap.toString());
					return pointMap.toString();
				}
				//采集点击次数
			def.element.addEventListener('mousedown', function() {
				var scrollTop = def.element.scrollTop;
				var x = window.event.clientX;
				var y = window.event.clientY + scrollTop;
				var index = that.setPoint(x, y, def.a, cx, cy);
				pointArray.push(index);
				console.log(index + ":(" + x + "," + y + ")  --> " + pointArray.length);
			}, false);
			//定时发送数据
			var si = setInterval(function() {
				var data = getData();
				if (data != null) {
					Post_(url_, data); //发送数据
					DataClear(); //清空数据
				}
			}, def.time * 1000);
			//页面关闭时发送数据
			window.onbeforeunload = function() {
				var data = getData();
				if (data != null) {
					Post_(url_, data); //发送数据
					DataClear(); //清空数据
				}
				clearInterval(si);
			};
			this.pageNum++; //计数器
		},
		Render: function() {
			var self = this;
			if (self.config) {
				for (var i in self.config.dom) {
					var el = self.util.getElement(self.config.dom[i]);
					//                console.log(self.config.dom[i]);
					//                console.log(self.util.isArray(el));
					if (self.util.isArray(el) > 0) {
						for (var j = 0; j < el.length; j++) {
							//                       console.log("el.[" + j + "]= " + el[j])
							self.rtlTest({
								element: el[j],
								time: self.config.time,
								pluginID: self.config.pluginID,
								refer:self.config.refer
							});
						}
					} else {
						self.rtlTest({
							element: el,
							time: self.config.time,
							pluginID: self.config.pluginID,
							refer:self.config.refer
						});
					}
				}
			}
		}
	};
	win.RELITU = function(params) {
		new Rlt(params).Render();
	};
	//解析配置文件执行方法
	if (config_) {
		console.log("解析配置。。。")
		RELITU({
			dom: config_.dom,
			time: config_.time,
			pluginID: config_.pluginID,
			refer: config_.refer
		});
	} else {
		return null;
	}
	window.addEventListener('load',function(e){
	    var h = document.body.scrollHeight;
	    var w = document.body.scrollWidth;
	    var data = {url:window.location.href,h:h+10,w:w}
	    if(window.parent){
	    	window.parent.postMessage(data,'*');
	    }
	})
    var mt = {};
    mt.p = {};
    mt.p.getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    };
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
})(window); 
