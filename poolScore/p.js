/* jQuery.pool.js
* version : v1.0
* Author:ex-qinfang001 
* Email:ex-qinfang001@pingan.com.cn
*/
/* _____________                       __________                
   | _p1(x1,y1)| _p2(x2,y2) _p3(x3,y3) |        |_p4(x4,y4)
   |________   |                       |  ______|
            |  |          _poolheight->| |                      
            |  |                       | |
            |  |                       | |
            |  |                       | |
            |  |    <-_poolWidth->     | |
  _p5(x5,y5)|  |_______________________| |_p6(x6,y6)     
            |____________________________|      . _p7              
*/
+function($){
    'use strict';

    function Pool(element,options){
        var DEFAULTS = Pool.DEFAULTS,self = this;
            
        this.$element = $(element);
        this.options = $.extend(true,{}, DEFAULTS, options);
        this.delta = 1; //偏移量
        this.alpha = 1;
        this.ki = 0;

        this.render();
    }

    Pool.DEFAULTS = {
        full: { //满池状态相关配置
            show: true, //满池状态是否显示
            fillStyle: ["Linear", [0, 0, 200, 0], [0, '#edf7ff'], [0.5, '#f5faff'], [1, '#edf7ff'] ] // 满池状态的颜色 
        },
        grid: { //网格配置
            x: 30, //左边距
            y: 30, //上边距
            x2: 30, //右边距
            y2: 30 //下边距
        },
        lfbar: { //左边框横条配置
            lineWidth: 20, //横线宽
            strokeStyle: '#000', //横线颜色
            lineLength: 40 //横线长度
        },
        rtbar: { //右边框横条配置
            lineWidth: 20, //横线宽
            strokeStyle: '#000', //横线颜色
            lineLength: 40 //横线长度
        },
        lfside: { //左边框竖条配置
            lineWidth: 20,
            strokeStyle: '#000'
        },
        rtside: { //右边框竖条配置
            lineWidth: 20, //横线宽
            strokeStyle: '#000' //横线颜色
        },
        btside: { //底边框配置
            lineWidth: 20, //横线宽
            strokeStyle: '#000' //横线颜色
        },
        markLine: { //刻度线配置
            show: true, //是否显示
            strokeStyle: '#333', //刻度颜色
            fillStyle: '#333', //文字颜色
            lineWidth: 2, //刻度宽
            lineLength: 25, //刻度长
            splitNumber: 5, //均分数
            font: "14px Arial", //文字样式
            max: 2000, //最大刻度值
            maxTextWidth: 60, //最大刻度值宽度
            splitText: true, // 是否显示每条刻度的文字，ture：显示，false：不显示
            maxText: true, //是否显示最大刻度， ture：显示,false：不显示
            toFixed: 2 // 文字精度
        },
        bubbles: { //气泡设置
            show: true, //是否显示
            strokeStyle: '#f5f5f5', //气泡边缘颜色
            fillStyle: '#e1f4fd', //气泡填充颜色
            num: 10, //气泡数目
            animation: false, //是否开启动画
            animationDuration: 100 //动画时长
        },
        water: { //静水配置，与数据有关
            stroke: false, //是否描边
            fillStyle: ['Linear', [0, 0, 200, 0], [0, '#c7e4fd'], [0.5, '#f0f8ff'], [1, '#c7e4fd'] ] //填充颜色 
        },
        data: { //数据配置
            data: [{
                value: 800, //值
                time: '12:30' //时间
            }],
            wave: { //波浪配置，可单独与data.data配置，在data.data未进行配置的值取当前wave默认配置
                K: 1, //大于0，影响波两边直线的长度，越大，越长
                F: 20, // 波频，越小，波长越小
                speed: 0.1, //波速，为0，静止，(0,1)间缓慢
                noise: 4, //振幅
                stroke: false,
                attenuation: 1, //衰减，大于0，(0,1)间将增大振幅
                animation: true,
                animationDuration: 50, // 运动时间表明运动速度的快慢，时间越长，运动越慢
                fillStyle: ['Linear', [0, 0, 290, 0], [0, '#bfe6fa'], [0.5, '#67b9ff'], [1, '#bfe6fa'] ] //波浪水域颜色
            },
            lineFillStyle: '#ff0', //横线填充色
            lineStrokeStyle: '#000', //横线描边色
            lineWidth: 1, //横线宽
            lineLength: 30, //横线长
            maxTextWidth: 46, //文字的最大宽度
            font: "14px Arial", //文字样式
            fillStyle: '#f9c831', //文字填充色
            strokeStyle: '#000' //文字描边色
        }
    }


    var _drawLine = function(ctx,p0x,p0y,p1x,p1y) {
        ctx.beginPath();
        ctx.moveTo(p0x,p0y);
        ctx.lineTo(p1x,p1y);
        ctx.stroke();
    }

    var _drawArc = function(ctx,x,y,r,sa,ea) {
        ctx.beginPath();
        ctx.arc(x,y,r,sa,ea);
        ctx.fill();
        ctx.stroke();
    }

    var _getColor = function (ctx,colorset){
        if(typeof colorset == "string"){
            return colorset;
        }else if(colorset instanceof Array && colorset.length>0){
            try{
                var i=2,len = colorset.length,gradient_funcstr = 'create'+colorset[0] + 'Gradient',tStyle = ctx[gradient_funcstr].apply(ctx,colorset[1]);
                for(i;i<len;i++){
                    tStyle.addColorStop(colorset[i][0],colorset[i][1]);
                }
                return tStyle;
            }catch(e){
                return console && console.log('%c'+e,"color:#840808") ,"black";
            }
        }else {
            return console && console.log("%cColor formate error!","color:#840808"),"black";
        }
    }

    Pool.prototype = {
        render:function(){
            var $element = this.$element,self = this,
                settings = this.options,
                pw = $element.width(),
                ph = $element.height();

            if(!pw || !ph){
                throw new Error('dom needs width & height!');
            }
            
            if(!$element.css('position') || $element.css('position') == 'static'){
                $element.css({
                    'position':'relative'
                })
            }

            this._width = pw;
            this._height = ph;

            var _x = settings.grid.x,
                _y = settings.grid.y,
                _x2 = settings.grid.x2,
                _y2 = settings.grid.y2,
            
                x1 = _x,
                x2 = _x + settings.lfbar.lineLength,
                x4 = this._width - _x2,
                x3 = x4 - settings.rtbar.lineLength,
                x5 = x3 - settings.rtside.lineWidth,
                x8 = x2 + settings.lfside.lineWidth/2,
                x9 = x3 - settings.rtside.lineWidth/2, 
                y1 =  _y + settings.lfbar.lineWidth/2,
                y3 = this._height - _y2,
                y4 = y3 - settings.btside.lineWidth,
                y2 = y3 - settings.btside.lineWidth/2;
                

            this._p0 = {x:_x,y:_y};
            this._p1 = {x:x1,y:y1};
            this._p2 = {x:x2,y:y1};
            this._p3 = {x:x3,y:y1};
            this._p4 = {x:x4,y:y1};
            this._p5 = {x:x2,y:y2};
            this._p6 = {x:x3,y:y2};
            this._p7 = {x:x4,y:y3};
            this._p8 = {x:x8};
            this._p9 = {x:x9}; 
            this._poolHeight = Math.abs(_y-this._p7.y)-settings.btside.lineWidth;
            this._poolWidth = Math.abs(x9-x8);

            //clear dom
            $element.html("");
            this.draw();
            return this;
        },
        draw:function(){
            var settings = this.options,
                data = settings.data;

            if(settings.full.show == true){
                this._fillArea();
            }

            if(settings.bubbles.show == true){
                this._drawBubbles();
            }

            this._drawSides();
            if(data.data.length>1){
                data.data.sort(function(a,b){
                    return a.time - b.time;
                })
            }
            if(data && data.data && data.data.length){
                for(var i = 0,item=data.data,n = item.length;i<n;i++){
                    var scale = item[i].value/settings.markLine.max;
                    scale = scale>1? 1:scale.toFixed(settings.markLine.toFixed);
                    var waveopt = item[i].wave == false?item[i].wave:$.extend({},data.wave,item[i].wave);
                    this._drawWaterArea(waveopt,scale);
                    this._drawData(item[i],scale);
                }
            }else{
                console & console.info('Pool has no data,it\'s empty!');
            }

            
            
            if(settings.markLine.show == true){
                this._drawMarkLine();
            }
        },
        _drawSides:function(){
            var canvas = document.createElement('canvas');
            canvas.width = this._width;
            canvas.height = this._height;
            this.$element.append(canvas);
            canvas.style.cssText = 'position:absolute; left:0;top:0;';

            var ctx = canvas.getContext('2d'),
                settings = this.options,
                lfbar = settings.lfbar,
                rtbar = settings.rtbar,
                lfside = settings.lfside,
                rtside = settings.rtside,
                btside = settings.btside;

            ctx.clearRect(0,0,this._width,this._height);
            // draw lfbar
            ctx.strokeStyle = _getColor(ctx,lfbar.strokeStyle);
            ctx.lineWidth = lfbar.lineWidth;
            _drawLine(ctx,this._p1.x ,this._p1.y, this._p2.x , this._p2.y);
            // draw rtbar
            ctx.strokeStyle = _getColor(ctx,rtbar.strokeStyle);
            ctx.lineWidth = rtbar.lineWidth;
            _drawLine(ctx,this._p3.x ,this._p3.y, this._p4.x , this._p4.y);

            // draw lfside
            ctx.strokeStyle = _getColor(ctx,lfside.strokeStyle);
            ctx.lineWidth = lfside.lineWidth;
            _drawLine(ctx,this._p2.x ,this._p0.y, this._p2.x , this._p7.y);

            // draw rtside
            ctx.strokeStyle = _getColor(ctx,rtside.strokeStyle);
            ctx.lineWidth = rtside.lineWidth;
            _drawLine(ctx,this._p3.x ,this._p0.y, this._p3.x , this._p7.y);

            // draw btside
            ctx.strokeStyle = _getColor(ctx,btside.strokeStyle);
            ctx.lineWidth = btside.lineWidth;
            _drawLine(ctx,this._p5.x - btside.lineWidth/2,this._p5.y, this._p6.x + btside.lineWidth/2 , this._p6.y);
        },
        _fillArea:function(){
            var canvas = document.createElement('canvas');
            canvas.width = this._width;
            canvas.height = this._height;
            this.$element.append(canvas);
            canvas.style.cssText = 'position:absolute; left:0;top:0;';

            var ctx = canvas.getContext('2d'),
                settings = this.options;

            // fill water area :cover
            ctx.clearRect(0,0,this._width,this._height);
            ctx.fillStyle = _getColor(ctx,settings.full.fillStyle);  
            ctx.fillRect(this._p2.x + settings.lfside.lineWidth/2, this._p0.y,this._poolWidth,this._poolHeight);
        },
        _drawMarkLine:function(){
            var canvas = document.createElement('canvas');
            canvas.width = this._width;
            canvas.height = this._height;
            this.$element.append(canvas);
            canvas.style.cssText = 'position:absolute; left:0;top:0;';

            var ctx = canvas.getContext('2d'),
                settings = this.options,
                markLine = settings.markLine,
                splitNumber = markLine.splitNumber,
                i;

            ctx.clearRect(0,0,this._width,this._height);
            ctx.fillStyle= _getColor(ctx,markLine.fillStyle);
            ctx.lineWidth = markLine.lineWidth;

            for(i = 0 ; i <= splitNumber; i++) {
                var scale = (1/splitNumber * i).toFixed(markLine.toFixed);
                var y = this._p0.y + (1-scale)*Math.abs(this._poolHeight) + markLine.lineWidth/2;
                var num = markLine.max * scale;
                _drawLine(ctx,this._p9.x - markLine.lineLength, y,this._p9.x, y );
                //draw splitText except maxText
                if(markLine.splitText){
                    ctx.font = markLine.font;
                    ctx.fillText((num.toString().indexOf('.')!=-1?num = num.toFixed(markLine.toFixed):num),this._p6.x - markLine.maxTextWidth, y - markLine.lineWidth/2);
                }
            }

            // draw maxText
            if(markLine.maxText){
                ctx.font = markLine.font;
                ctx.fillText(markLine.max,this._p6.x - markLine.maxTextWidth, this._p0.y- markLine.lineWidth/2);
            }
        },
        _drawWaterArea:function(datawave,scale){
            var canvas = document.createElement('canvas');
            canvas.width = this._width;
            canvas.height = this._height;
            this.$element.append(canvas);
            canvas.style.cssText = 'position:absolute; left:0;top:0;';

            var ctx = canvas.getContext('2d'),
                settings = this.options,
                markLine = settings.markLine,
                water = settings.water;

            ctx.clearRect(0,0,this._width,this._height);
            if(typeof datawave == "object"){
                this._drawWaveArea(ctx,datawave,scale);
            }else{
                var warterHeight = scale*this._poolHeight,
                    x = this._p8.x,
                    x1 = this._p9.x,
                    y = this._p0.y + (1-scale)*this._poolHeight;

                ctx.fillStyle = _getColor(ctx,water.fillStyle);
                ctx.fillRect(x,y,this._poolWidth,warterHeight);
            }
        },
        _drawBubbles:function(){
            var canvas = document.createElement('canvas');
            canvas.width = this._width;
            canvas.height = this._height;
            this.$element.append(canvas);
            canvas.style.cssText = 'position:absolute; left:0;top:0;';

            var ctx = canvas.getContext('2d'),
                settings = this.options,
                data = settings.data,
                markLine = settings.markLine,
                bubbles = settings.bubbles,
                scale;

            ctx.clearRect(0,0,this._width,this._height);
            var tempArr =[];
            for(var i =0,n = data.data.length;i<n;i++){
                tempArr.push(data.data[i].value);
            }
            scale = (Math.min.apply(null,tempArr)/markLine.max).toFixed(markLine.toFixed);
  
            ctx.strokeStyle= _getColor(ctx,bubbles.strokeStyle);
            ctx.fillStyle= _getColor(ctx,bubbles.fillStyle);
            this._drawBubblesArea(ctx,scale);
            
        },
        _drawData:function(item,scale){
            var canvas = document.createElement('canvas');
            canvas.width = this._width;
            canvas.height = this._height;
            this.$element.append(canvas);
            canvas.style.cssText = 'position:absolute; left:0;top:0;';

            var ctx = canvas.getContext('2d'),
                settings = this.options,
                markLine = settings.markLine,
                data = settings.data;
            var p8 = {x:this._p8.x,y:this._p0.y + (1-scale)*this._poolHeight + markLine.lineWidth/2},
                p7 = {x:p8.x - data.lineLength,y:p8.y},
                p9 = {x:this._p9.x ,y:this._p0.y + (1-scale)*this._poolHeight + markLine.lineWidth/2 },
                p10 = {x:p9.x + data.lineLength,y:p9.y};
            
            ctx.clearRect(0,0,this._width,this._height);

            // draw data line
            ctx.lineWidth = item.lineWidth || data.lineWidth;
            ctx.strokeStyle = _getColor(ctx,item.lineStrokeStyle || data.lineStrokeStyle);
            ctx.fillStyle = _getColor(ctx,item.lineFillStyle || data.lineFillStyle);
            _drawLine(ctx,p7.x,p7.y,p8.x,p8.y);
            _drawLine(ctx,p9.x,p9.y,p10.x,p10.y);

            // draw data text
            ctx.strokeStyle = _getColor(ctx,item.strokeStyle || data.strokeStyle);
            ctx.fillStyle = _getColor(ctx,item.fillStyle || data.fillStyle); 
            ctx.font = item.font || data.font;
            ctx.fillText(item.value ,p10.x,p10.y);
            ctx.fillText(item.time,p7.x - data.maxTextWidth,p7.y - data.lineWidth/2);
        },
        _drawBubblesArea:function(ctx,scale){
            var self = this,
                settings = this.options,
                data = settings.data,
                markLine = settings.markLine,
                bubbles = settings.bubbles,
                bubblesArr = [];

            var yfrom = this._p0.y + (1-scale) * this._poolHeight;
            var yto = this._p0.y + this._poolHeight;
            var xfrom = this._p8.x;
            var xto = this._p9.x;
            
            if(yfrom >= yto - 0.1*this._poolHeight){
                return;
            }else{
                this.ki = this.ki>bubbles.num?this.ki =0:this.ki;
                for(var i = 0,n = bubbles.num;i<n;i++){
                    var x = xfrom + Math.random()*30,
                        y = yto - this.ki % (scale * this._poolHeight) - Math.random()*i*10 ,
                        r =  Math.random()*3 + y/this._poolHeight;

                    x = x - r<xfrom?xfrom:(x>xto?xto:x);
                    y = y>yto?yto:(y<yfrom?yfrom:y);

                    if(bubblesArr[i]){
                        bubblesArr[i].y +=  Math.random()*i*10;
                        bubblesArr[i].x +=  Math.random()*i;
                        bubblesArr[i].r +=  Math.random()* y/this._poolHeight;
                        bubblesArr[i].x = bubblesArr[i].x - bubblesArr[i].r<xfrom?xfrom:(bubblesArr[i].x>xto?xto:bubblesArr[i].x);
                        bubblesArr[i].y = bubblesArr[i].y>yto?yto:(bubblesArr[i].y<yfrom?yfrom:bubblesArr[i].y);
                    }else{
                        bubblesArr.push({
                            'y': y,
                            'x': x,
                            'r': r
                        });
                    }
                    
                }
                ctx.clearRect(0,0,this._width,this._height);
                for(var i = 0,n = bubbles.num;i<n;i++){
                    _drawArc(ctx,bubblesArr[i].x ,bubblesArr[i].y ,bubblesArr[i].r,0,2*Math.PI);
                }
                if(bubbles.animation == true){
                    setTimeout(function(){
                        self.ki ++ ;
                        self._drawBubblesArea(ctx,scale);
                    },bubbles.animationDuration);
                }
            }
        },
        _drawWaveArea:function(ctx,wave,scale){
            var self = this; 

            ctx.fillStyle = _getColor(ctx,wave.fillStyle);  
            ctx.clearRect(0,0,this._width,this._height);
            
            var x = this._p8.x,
                y = this._p0.y + (1-scale) * this._poolHeight,
                startX = x,
                startY = y;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            
            this.delta = (this.delta + wave.speed)%(Math.PI*64);
            this.alpha = wave.noise*Math.sin(Math.PI/this._poolHeight*startY-this._p0.y*Math.PI/this._poolHeight);

            // draw wave line,consider only wave.noise can effect on 振幅 
            var maxX = startX + this._poolWidth,
                maxY = this._p0.y + this._poolHeight;

            if(y >= maxY - wave.noise || y <= this._p0.y + wave.noise) {
                ctx.lineTo(maxX,startY);
            }else{
                for (var i=-wave.K; i<=wave.K; i+=0.01) {
                    x = startX+this._poolWidth*((i+wave.K)/(wave.K*2));
                    x = x> maxX?maxX:(x< startX?startX:x);
                    y = startY+ this.alpha * Math.pow(wave.K*4/(wave.K*4+Math.pow(i,4)),wave.K*2) * (1/wave.attenuation) * Math.sin(wave.F*i-this.delta);
                    y = y> maxY?maxY:(y< this._p0.y?this._p0.y:y);
                    ctx.lineTo(x, y);
                }
            }
            ctx.lineTo(maxX, maxY);
            ctx.lineTo(startX, maxY);
            ctx.lineTo(startX,startY);
            ctx.closePath();
            ctx.fill();

            // animation on
            if(wave.animation){
                setTimeout(function(){
                    self._drawWaveArea(ctx,wave,scale);
                },wave.animationDuration);
            }
        }
    }

    // register to jquery plugin
    $.fn.pool = function(opts){
        return this.each(function(){
            new Pool(this,opts);
        })
    }
    
}(window.jQuery);
