define(['jquery','common','echartsall','pool'],function($,common){
    var basePath = common.basePath,
		getQueryString = common.getQueryString,
		request = common.request;

    // url参数配置
    var refreshTime = getQueryString('refreshTime') || 30;// 每隔30min请求一次，更新数据


    //目标屏幕的分辨率 默认为1920*1080，可通过url参数配置
    var width= getQueryString('w') || 1920,
        height=getQueryString('h') || 1080;

    // 以目标屏幕分辨率渲染图表容器
    function setContainerSize(){
        $(".wrapper").css({
            'width':width,
            'height':height
        });
        $(".chartContainer").css({
            'width':width+'px',
            "height":Math.ceil(height*0.8)+'px',
            "line-height":Math.ceil(height*0.8)+'px',
            'margin-top': '5%'
        });

        $("#left-container").css({
            "height":Math.ceil(height*0.8)+'px',
            "line-height":Math.ceil(height*0.8)+'px'
        });
        $("#right-container").css({
            "height":Math.ceil(height*0.8)+'px',
            "line-height":Math.ceil(height*0.8)+'px'
        });
    }

    // 自动缩放页面 保证页面长宽比是以目标屏幕分辨率显示的比例展示
    function fixHeight(){
        wrap=$('.wrapper');
        var scale= 1;

        var windowHeight=$(window).height();
        var windowWidth=$(window).width();
         
        var sw = windowWidth/width;
        var sh = windowHeight/height;
        if(sw<sh){
            scale=sw;
        }else if(sw>sh){
            scale=sh
        }
        if(scale<1){
            var top = (windowHeight-wrap.height())/2+'px';
            var left = (windowWidth-wrap.width())/2+'px';
            wrap.css({
                'transform':'scale('+scale+','+scale+')',
                '-webkit-transform':'scale('+scale+','+scale+')',
                'position':'absolute',
                'top':top,
                'left':left
            });
        }
        
    }


    var timer;//定时器

    //第二天凌晨零点刷新页面
    (function(){
        var now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        var t = now.getTime();
        var refreshDate = new Date(t+1*24*60*60*1000);
        var refreshMeta = '<meta http-equiv="refresh" content="'+ (refreshDate.getTime()-new Date().getTime()).toString() +'">';
        $('head').append(refreshMeta);
    })();

    var step = 0;//用于记录波浪线的一帧
    // ------------------------------------------ 积分水池（动画）绘制 ----------------------------------------
    var waterPool = {
        init:function(){
            this.initParams();
            this.initWave();
            this.createPool();
        },
        canvas:document.getElementById('water-score'),
        ctx: document.getElementById('water-score').getContext('2d'),
        SW:null,
        params:{ //默认参数
            width:300,
            height:250,
            maxTop:0,//上边距(实际容器里的尺度与容器画布的上边距)
            maxLeft:0,//左边距
            maxBottom:0,
            maxRight:0,
            factStartX:0,//开始x坐标
            factStartY:0,//开始y坐标
            factWidth:300,//水缸宽度
            factHeight:240,//水缸高度
        },
        poolParams:{
            lineWidthA:20, //水缸水平线宽度（px）
            lineALength:40,//水平线长度（px）
            lineWidthB:5//垂直线宽度（px）
        },
        ki:0,
        initParams: function(){

            var canvas = this.canvas;
            canvas.width = $("#right-container").width();
            canvas.height = $("#right-container").height();
            this.params.width = canvas.width*0.7;
            this.params.height = canvas.height*0.74;


            var ctx= this.ctx;

            //draw pool
            this.params.marginTop = 180;//
            this.params.marginLeft = 100;
            this.params.maxTop = 0;
            this.params.maxLeft = 0;

            this.params.maxBottom = this.poolParams.lineWidthA;
            this.params.maxLeft = this.poolParams.lineALength;
            this.params.maxRight = this.poolParams.lineALength;

            startPoint = {x:this.params.marginLeft,y:this.params.marginTop};
            this.params.factStartX = startPoint.x + this.params.maxLeft;
            this.params.factStartY = startPoint.y + this.params.maxTop;
            this.params.factHeight = this.params.height - this.params.maxTop - this.params.maxBottom;
            this.params.factWidth = this.params.width - this.params.maxLeft - this.params.maxRight;

        },
        createPool: function(){

            var self = this;

            self.render();

            setInterval(function(){
                
                self.render();

            },50);
        },
        initWave: function(){
            this.SW = new SiriWave({
              width: this.canvas.width,
              height: this.canvas.height,
              canvas:this.canvas
            });
            this.SW.setSpeed(0.06);
        },
        data:{
            score:500,
            scale:0.5,
            time:'12:30',
        },
        refresh:function(data){
            if(data)
            {
                this.data = data;
            }

            this.ki = 0;
        },
        render:function(){
            
            var ctx = this.ctx;

            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.drawPool();

            this.waterRulerA(this.data,this.data.scale);
            this.drawWaterArea(this.data,this.data.scale);

            this.drawNormalRuler();
        },
        drawPool: function(){ //绘画水缸边框
            var ctx = this.ctx, 
                factStartY = this.params.factStartY,
                factStartX = this.params.factStartX,
                factWidth = this.params.factWidth,
                factHeight = this.params.factHeight,
                lineWidthA = this.poolParams.lineWidthA,
                lineALength = this.poolParams.lineALength,
                lineWidthB = this.poolParams.lineWidthB;

            ctx.lineCap = 'butt';
            ctx.strokeStyle="#333";//边框颜色
            ctx.lineWidth = this.poolParams.lineWidthA;//边框宽

            var p0 = {x:factStartX - lineALength, y:factStartY + lineWidthA/2};
            var p1 = {x:factStartX , y:factStartY + lineWidthA/2};

            var lineB1 = {x:p1.x - lineWidthB/2, y:p1.y + lineWidthA/2};
            var lineB2 = {x:lineB1.x, y: lineB1.y + factHeight - lineWidthA};

            var lineC1 = {
                x:lineB1.x - lineWidthB/2,
                y:lineB2.y +lineWidthB/2
            },
            lineC2 = {
                x: lineC1.x + factWidth + lineWidthB*2,
                y: lineC1.y
            };

            var lineD1 = {
                x: lineC2.x - lineWidthB/2,
                y: lineB1.y
            },
            lineD2 = {
                x: lineD1.x,
                y: lineB2.y
            };

            var p3 = {
                x: lineD2.x - lineWidthB/2,
                y: p0.y
            },p4 = {
                x: p3.x + lineALength,
                y:p0.y
            };

            this.drawLine(p0.x ,p0.y, p1.x , p1.y);
            this.drawLine(p3.x ,p3.y, p4.x , p4.y);

            ctx.lineWidth = lineWidthB;
            this.drawLine(lineB1.x ,lineB1.y, lineB2.x , lineB2.y);
            this.drawLine(lineC1.x,lineC1.y, lineC2.x , lineC2.y);
            this.drawLine(lineD1.x ,lineD1.y, lineD2.x , lineD2.y);

            var lGrd = ctx.createLinearGradient(0,0, 200, 0);  
            lGrd.addColorStop(0, '#edf7ff');  
            lGrd.addColorStop(0.5, '#f5faff');  
            lGrd.addColorStop(1, '#edf7ff');  

            ctx.fillStyle = lGrd;  
            ctx.fillRect(factStartX, factStartY, factWidth, factHeight);
        },
        drawNormalRuler: function(){
            var ctx = this.ctx,
                factStartY = this.params.factStartY,
                factStartX = this.params.factStartX,
                factWidth = this.params.factWidth,
                factHeight = this.params.factHeight;

            ctx.strokeStyle="#666";
            ctx.lineWidth = 3;

            //横刻度
            for(var i = 0 ; i <= 5; i++)
            {
                var scale = 0.2 * (i);
                var y = factStartY+ (1-scale)*factHeight;
                this.drawLine(factStartX + factWidth  , y+1 ,factStartX + factWidth - 25 , y+1 );
                //ctx.strokeText( parseInt(maxData * scale),factStartX + factWidth  - 25 ,factStartY + (1-scale)*factHeight - 5);
            }

            // ctx.strokeStyle="#333";
            // var x = factStartX + factWidth;
            // this.drawLine(x,factStartY + factHeight, x , factStartY);

        },
        waterRulerA: function(data,scale)
        {
            var ctx = this.ctx,
                factStartY = this.params.factStartY,
                factStartX = this.params.factStartX,
                factWidth = this.params.factWidth,
                factHeight = this.params.factHeight;

            ctx.lineWidth = 1;
            if(data.old)
            {
                var lGrd = ctx.createLinearGradient(0,0, 200, 0);  
                lGrd.addColorStop(0, '#c7e4fd');  
                lGrd.addColorStop(0.5, '#f0f8ff');  
                lGrd.addColorStop(1, '#c7e4fd');  

                ctx.fillStyle = lGrd;  
                ctx.fillRect(factStartX, factStartY + (1-data.old.scale)*factHeight, factWidth,  data.old.scale*factHeight);
            }

            var lGrd = ctx.createLinearGradient(0,0, 200, 0);  
            lGrd.addColorStop(0, '#0089ff');  
            lGrd.addColorStop(0.5, '#67b9ff');  
            lGrd.addColorStop(1, '#0089ff');  

            ctx.fillStyle = lGrd;  
//            ctx.fillRect(factStartX, factStartY + (1-scale)*factHeight, factWidth,  (1-scale)*factHeight);  

        },
        drawWaterArea: function(data,scale)
        {
            var ctx = this.ctx,
                factStartY = this.params.factStartY,
                factStartX = this.params.factStartX,
                factWidth = this.params.factWidth,
                factHeight = this.params.factHeight;

            ctx.lineWidth = 1;
            ctx.strokeStyle="#c7e4fd";
                
            this.drawWaveLine(scale);

            this.drawLine(factStartX + factWidth - 5,factStartY+ (1-scale)*factHeight,factStartX + factWidth + 30,factStartY+ (1-scale)*factHeight);
            ctx.font = "20px Arial";
            ctx.fillStyle = '#f9c831';
            ctx.fillText(data.score ,factStartX + factWidth +30+5,factStartY + (1-scale)*factHeight+8);
            this.drawLine(factStartX  - 30,factStartY+ (1-scale)*factHeight,factStartX  + 10,factStartY+ (1-scale)*factHeight);
            ctx.fillText(data.time ,factStartX -90,factStartY + (1-scale)*factHeight+8);
            
            if(this.data.old)
            {
            	var scale = this.data.old.scale;
            	
            	ctx.fillStyle = '#f9c831';
            	ctx.font = "20px Arial";
                this.drawLine(factStartX + factWidth - 5,factStartY+ (1-scale)*factHeight,factStartX + factWidth + 30,factStartY+ (1-scale)*factHeight);
                
                ctx.fillText(this.data.old.score ,factStartX + factWidth +30+5,factStartY + (1-scale)*factHeight+8);

                this.drawLine(factStartX  - 30,factStartY+ (1-scale)*factHeight,factStartX  + 10,factStartY+ (1-scale)*factHeight);
                ctx.fillText(this.data.old.time ,factStartX -90,factStartY + (1-scale)*factHeight+8);
                
            }
            
            
            this.drawBubbles(scale);
        },
        drawBubbles:function(scale)
        {
            var ctx = this.ctx,
                factStartY = this.params.factStartY,
                factStartX = this.params.factStartX,
                factWidth = this.params.factWidth,
                factHeight = this.params.factHeight;

            ctx.strokeStyle="#8a9297";
            ctx.fillStyle="#e1f4fd";
            var waterHeight = (1-scale)*factHeight , ki = this.ki;;

            var pStart = {
                x:factStartX,
                y:factStartY + (1-scale)*factHeight
            };
            var bubbles = [
                {
                    x:pStart.x + 18,
                    y:pStart.y + waterHeight - ki%waterHeight - 20,
                    r:2
                },
                {
                    x:pStart.x + 38,
                    y:pStart.y + waterHeight - ki%waterHeight - 25,
                    r:3
                },
                {
                    x:pStart.x + 25,
                    y:pStart.y + waterHeight - ki%waterHeight - 35,
                    r:5
                },
                {
                    x:pStart.x + 16,
                    y:pStart.y + waterHeight - ki%waterHeight - 46,
                    r:2
                },
                {
                    x:pStart.x + 20,
                    y:pStart.y + waterHeight - ki%waterHeight - 55,
                    r:1.5
                },
                {
                    x:pStart.x + 30,
                    y:pStart.y + waterHeight - ki%waterHeight - 67,
                    r:3
                },
                {
                    x:pStart.x + 23,
                    y:pStart.y + waterHeight - ki%waterHeight - 76,
                    r:1.2
                },
                {
                    x:pStart.x + 32,
                    y:pStart.y + waterHeight - ki%waterHeight - 94,
                    r:2.3
                },
                {
                    x:pStart.x + 22,
                    y:pStart.y + waterHeight - ki%waterHeight - 104,
                    r:1.3
                },
                {
                    x:pStart.x + 42,
                    y:pStart.y + waterHeight - ki%waterHeight - 124,
                    r:3.3
                },
                {
                    x:pStart.x + 25,
                    y:pStart.y + waterHeight - ki%waterHeight - 144,
                    r:2.0
                },

            ];

            for (var i = 0; i < bubbles.length; i++) {
                if (bubbles[i].y - bubbles[i].r > pStart.y && bubbles[i].y + bubbles[i].r < factHeight + factStartY ) 
                {
                    this.drawBubble(bubbles[i].x ,bubbles[i].y ,bubbles[i].r,0,2*Math.PI);
                }
            };


            this.ki++;
        },
        // 画一条线
        drawLine: function(p0x,p0y,p1x,p1y)
        {
            var ctx = this.ctx;
            ctx.beginPath();
            ctx.moveTo(p0x,p0y);
            ctx.lineTo(p1x,p1y);
            ctx.stroke();
        },
        // 画一个泡泡（圆）
        drawBubble: function(x,y,r,sa,ea)
        {

            var ctx = this.ctx;
            ctx.strokeStyle = '#f5f5f5'; //气泡颜色

            ctx.beginPath();
            ctx.arc(x,y,r,sa,ea);
            ctx.fill();
            ctx.stroke();

        },
        // 画波浪线
        drawWaveLine: function(scale){

            var ctx = this.ctx,
                factStartY = this.params.factStartY,
                factStartX = this.params.factStartX,
                factWidth = this.params.factWidth,
                factHeight = this.params.factHeight;
            var lGrd = ctx.createLinearGradient(0,0, this.params.factWidth, 0);  
            lGrd.addColorStop(0, '#bfe6fa');  //0089ff
            lGrd.addColorStop(0.5, '#67b9ff');  
            lGrd.addColorStop(1, '#bfe6fa');  //bfe6fa

            ctx.fillStyle = lGrd;  
            //ctx.fillStyle = "rgba(0,222,255, 0.2)";
            //角度增加一度
            step++;
            //角度转换成弧度
            var angle = step*Math.PI/180;
            //矩形高度的变化量
            var deltaHeight = Math.sin(angle) * 10;
            //矩形高度的变化量(右上顶点)
            var deltaHeightRight = Math.cos(angle) * 10;

            var y = factStartY + (1-scale) *factHeight;
            var x = factStartX;
            var r = factWidth/10;

            ctx.beginPath();
            ctx.moveTo(x, y);

            this.SW._draw(scale,this.params);

            ctx.lineTo(factStartX + factWidth, factHeight + factStartY);
            ctx.lineTo(factStartX, factHeight + factStartY);
            ctx.lineTo(factStartX, factHeight/2+deltaHeight);
            ctx.closePath();
            ctx.fill();
        }

    };
    // ------------------------------------------ 积分水池（动画）绘制 END ----------------------------------------


    // ------------------------------------------ 波浪线（动画）绘制 ----------------------------------------

    function SiriWave(opt){
        this.opt = opt || {};
        this.K = 2;
        this.F = 6;
        this.speed = this.opt.speed || 0.1;
        this.noise = this.opt.noise || 8;//0.13
        this.phase = this.opt.phase || 0;

        this.basicNoise = this.noise;

        this.width =  this.opt.width;
        this.height = this.opt.height;
        this.MAX = (this.height/2)-4;

        this.canvas = this.opt.canvas;//document.getElementById('water-score');
        this.ctx = this.canvas.getContext('2d');
    }

    SiriWave.prototype = {

        _globalAttenuationFn: function(x){
            return Math.pow(this.K*4/(this.K*4+Math.pow(x,4)),this.K*2);
        },
        _justLineCurv: function(attenuation, color, width,scale,params){//画波浪线，但没有stroke

            var x, y;
                
            for (var i=-this.K; i<=this.K; i+=0.01) {
                x = params.factWidth*((i+this.K)/(this.K*2));
                x = x>  params.factWidth?  params.factWidth:x;
                y =  params.factStartY + (1-scale)* params.factHeight + this.noise * this._globalAttenuationFn(i) * (1/attenuation) * Math.sin(this.F*i-this.phase);
                this.ctx.lineTo(x +  params.factStartX, y);
            }
            //this.ctx.stroke();
        },

        _drawLine: function(attenuation, color, width,scale){
            this.ctx.moveTo(0,0);
            this.ctx.beginPath();
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = width || 1;
            var x, y;
                
            for (var i=-this.K; i<=this.K; i+=0.01) {
                x = this.width*((i+this.K)/(this.K*2));
                y = factStartY + (1-scale)*factHeight + this.noise * this._globalAttenuationFn(i) * (1/attenuation) * Math.sin(this.F*i-this.phase);
                this.ctx.lineTo(x + factStartX, y);
            }
            this.ctx.stroke();
        },
        setNoise: function(v){
            this.noise = Math.min(v, 1)*this.basicNoise*2;
        },
        _clear: function(){
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.globalCompositeOperation = 'source-over';
        },

        _draw: function(scale,params){
            this.phase = (this.phase+this.speed)%(Math.PI*64);
            //this._drawLine(1, 'rgba(0,255,255,1)', 1.5,scale);
            this.setNoise(scale);
            this._justLineCurv(1, 'rgba(0,255,255,1)', 1.5,scale,params);
        },
        setSpeed: function(v){
            this.speed = v;
        }
    };
    // ------------------------------------------ 波浪线（动画）绘制 END----------------------------------------


  //第二天凌晨零点刷新
    (function(){
        var now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        var t = now.getTime();
        var refreshDate = new Date(t+1*24*60*60*1000);
        var refreshMeta = '<meta http-equiv="refresh" content="'+ (refreshDate.getTime()-new Date().getTime()).toString() +'">';
        $('head').append(refreshMeta);
    })();

    function domEvents(){
        // 绑定resize 重新渲染
        $(window).resize(function(){
            window.location.reload();
        });
    }

    var ept = {
        init:function(){
            $("#loading").show();
            setContainerSize();
            fixHeight();
            domEvents();
        	var params = {
        			refreshTime:refreshTime
        	}
            
            ept.getInfo(params);
            var date = new Date();
            var y = date.getYear();
            var M = date.getMonth();
            var d = date.getDate();
            var h = date.getHours();
            var m = date.getMinutes();
            if( m+refreshTime==60){
            	h=h+1;
            	m=0;
            }else{
            	m=m+refreshTime;
            }
            
            var nextTime = new Date(y,M,d,h,m);
            timer && clearInterval(timer);
            setTimeout(function(){
            	ept.getInfo(params);
                timer = setInterval(function(){
                    ept.getInfo(params);
                },refreshTime*60*1000);
            },nextTime.getTime()-date.getTime());
        },
        // "/pawall/getIntegra.action" 
        getInfo:function(params){
            var url = basePath + '/common/skipTo.action' ;
            params.aimCode = 'oit8Qoh93B+7LW9EVT/bvD1btgxXsnmcH7WgTNcmY+k=';

    		var container = document.getElementById('left-container');
            $(".chartTitle").hide();
        	request('get',[url,params],function(data){
                if($("#loading").css("display")!="none"){
                    $("#loading").hide();
                }
    			if(data && data.returnCode && data.returnCode =="1"){
    				if(data.content){
    					var c = data.content;
    					if(c.resultList && c.resultList.length){
    						ept.draw(c,container);
    					}else{
    						container.innerHTML = '没有相关数据！';
    					}
    				}
    			}else{
    				if(data.returnMsg){
    					container.innerHTML = data.returnMsg;
    				}else{
    					container.innerHTML = '没有有效数据！';
    				}
    			}
        	},function(data){
        		if($("#loading").css("display")!="none"){
                    $("#loading").hide();
                }
        	 	container.innerHTML = '没有有效数据';
                console.log && console.log('请求异常'+url);
        	})
        },
        draw:function(data,container){
    		//画折线图
        	var chart = echarts.init(container);
            var list = data.resultList;
        	var options = ept.setLineOptions(list);
        	chart.setOption(options);
            var theme = ept.setTheme();
            chart.setTheme(theme);
            //画积分池
            var totalCount = data.totalCount || 0;
            var poolData = list[list.length-1];
            var count = poolData.count || 0;
            var time = poolData.time ;
            var scale = totalCount != 0?(count/totalCount>1?1:count/totalCount):0;
            waterPool.init();
        	waterPool.refresh({
                score: count,
                scale:scale,
                time:time
            });
	        $(".chartTitle").show();
            

        },
        /* 设置折线图的Option
         * @param data:[{time:'09:05',count:44544},{time:'09:00',count:45453},{time:'08:55',count:45500}]
         */
        setLineOptions:function(data){
        	var options = null;
			
			//类目轴数据
			var categoryAxisData =[];
			
			//加工数据
			var finalData = (function(){
				var temp = [];
				temp.push({
					time:data[0].time,
					count:0
				})
				for(var i=1,n = data.length;i<n;i++){
					temp.push({
						time:data[i].time,
						count:data[i-1].count-data[i].count
					});
				}
				return temp;
			})();
			
			//系列数据
			var seriesData =[];
			
			for(var i = 0,n = finalData.length;i<n;i++){
				categoryAxisData.push(finalData[i].time);
				seriesData.push(parseInt(finalData[i].count)||0);
			}
			
        	options = {
			    title : {
			        text: '积分消耗情况 '
			    },
			    tooltip : {
			        trigger: 'item'
			    },
			    calculable:true,
                animation:false,
			    xAxis : [
			        {
                        name:'时间',
			            type : 'category',
			            boundaryGap : false,
			            data : categoryAxisData
			        }
			    ],
			    yAxis : [
			        {
			            name : '积分',
			            type : 'value'
			        }
			    ],
			    series : [
			        {
			            name:'积分',
			            type:'line',
                        symbol:'none',
            			smooth:false,
			            data:seriesData
			        }
			    ]
			};
				                    
        	return options;
        },
        setTheme:function(){
            var theme = {
                color:['#f9c831'],
                title:{
                    x:'center',
                    y:100,
                    textStyle: {
                        color: '#fff',
                        fontSize:40,
                        fontWeight:'lighter',
                        fontFamily: 'Microsoft YaHei'
                    }
                },
                legend:{
                    textStyle: {
                        color: '#fff',
                        fontSize:20,
                        fontFamily: 'Microsoft YaHei'
                    },
                    x:'3%',
                    y:'bottom'
                },
                grid:{
                    borderWidth:0,
                    x:180,
                    y:240
                },
                categoryAxis:{
                    nameTextStyle:{
                        fontSize:20,
                        color:'#fff',
                        fontFamily:'Microsoft YaHei'
                    },
                    position:'bottom',
                    splitLine:{
                        show:false
                    },
                    axisLine : { 
                        onZero: false,   
                        show: true,
                        lineStyle: {
                            color: '#666',
                            type: 'solid',
                            width: 1
                        }
                    },
                    axisTick:{
                        show:true
                    },
                    axisLabel : {
                        show:true,
                        textStyle: {
                            color: '#fff',
                            fontSize:22,
                            fontFamily: 'Microsoft YaHei',
                            fontStyle: 'normal'
                        }
                    }
                },
                valueAxis:{
                    nameTextStyle:{
                        fontSize:20,
                        color:'#fff',
                        fontFamily:'Microsoft YaHei'
                    },
                    position: 'left',
                    splitLine:{
                        show:true,
                        lineStyle:{
                            type: 'solid',
                            color:'#333333'
                        }
                    },
                    axisLine : {    
                        show: true,
                        lineStyle: {
                            color: '#333333',
                            type: 'solid',
                            width: 1
                        }
                    },
                    axisTick:{
                        show:true
                    },
                    axisLabel : {
                        show:true,
                        textStyle: {
                            color: '#fff',
                            fontSize:20,
                            fontFamily: 'Microsoft YaHei'
                        }
                    }
                }
            }
            return theme;
        }
    }

    return ept;

});