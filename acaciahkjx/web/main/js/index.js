(function(){
	$(function(){
		$(document).on("click ", "#nav_mobile", function (e) {
			var $container = $("#container");
			if ($container.css('left') == '0px') {
				acaciaMain.navMenuMobile.open();
			} else {
				acaciaMain.navMenuMobile.close();
			}
			acaciaMain.tabBind('hover');
		})
	})
	var option = {
	    dataRange: {
	        min: 0,
	        max: 100,
	        text:['High','Low'],
	        realtime: false,
	        calculable : true,
	        color: ['orangered','yellow','lightskyblue'],
	        show:false
	    },
	    series: [
	        {
	            name: 'Top5',
	            type: 'map',
	            mapType: '广西',
	            itemStyle:{
	                normal:{
	                	label:{
	                		show:false,
	                		formate:'{a}'
	                	},
	                    borderColor:'#D5D3D3',
	                    borderWidth:0.5,
	                    areaStyle:{
	                        color: '#F1F2F3'
	                    }
	                }
	            },
	            data:[],
	            geoCoord:{
                	"阳朔":[110.48,24.78],
                	"资源":[110.63,26.03],
                	"龙胜":[110.00,25.80],
                	"恭城":[110.83,24.83],
                	"灵川":[110.32,25.42],
                	"灌阳":[111.15,25.48],
                	"融水":[109.25,25.07],
                	"隆林":[105.33,24.77],
                	"武宣":[109.67,23.60]
               },
	            markPoint : {
	                symbol:'circle',
	                symbolSize :1,
	                effect : {
	                    show: false,
	                    shadowBlur : 0
	                },
	                itemStyle:{
	                    normal:{
	                        label:{
	                        	show:true,
	                        	formatter:function(p){
	                        		return p.name;
	                        	},
	                        	textStyle:{
	                        		color:'#666'
	                        	}
	                        }
	                    }
	                },
	                data : [
	                    {name: "阳朔", value: 193},
	                    {name: "资源", value: 194},
	                    {name: "恭城", value: 229},
	                    {name: "龙胜", value: 273},
	                    {name: "灵川", value: 279},
						{name:"灌阳",value:11},
						{name:"融水",value:11},
						{name:"隆林",value:11},
						{name:"武宣",value:11}
	                ]
	            }
	        }
	    ]
	};
	var mapCont = document.getElementById('mapCont');
	var chart = echarts.init(mapCont);
	chart.setOption(option);

})();
