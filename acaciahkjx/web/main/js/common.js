var acaciaMain = {
	init: function() {
//		this.tabBind('hover');
	},
	navMenuMobile: {

		open: function() {
			$("#container, #footer").addClass("mobile-menu-open");
			$('#tab_main_nav_close_mobile').addClass("show-table-cell").show().siblings('#tab_main_nav_mobile,#tab_main_need_help_mobile').addClass("hidden").hide();
			$("#tab_main_nav_mobile_container").addClass("mobile-menu-open");
		},

		close: function() {
			$("#tab_main_nav_mobile_container").removeClass("mobile-menu-open").css({
				'right': -100 + '%'
			});
			$("#container, #footer").removeClass("mobile-menu-open").css('left', 0);
			$('#tab_main_nav_close_mobile').removeClass("show-table-cell").hide().siblings().removeClass("hidden").show();
			$("#tab_main_nav_mobile_next_container").removeClass("mobile-menu-open")
				.animate({
					'right': -100 + '%'
				}, function() {});
		}
	},
	tabBind:function(eventType,$el){
		var $tab = $el?$el : $('.component-tab');
		$tab.each(function(i,e){
			var $this = $(this);
			var $tabhd = $this.find('.tabhd');
			var $tabbd = $this.find('.tabbd');
			var $tabhds =  $tabhd.find(".tabhd-cont");
			if(eventType == "hover"){
				$tabhds
					.on('mouseover',function(){
						var index = $(this).index(".tabhd-cont") || 0;
						var $thisbd = $tabbd.find(".tabbd-cont").eq(index);
						$tabhds.removeClass('active');
						$(this).addClass('active');
						$tabbd.hide();
						$currbd.show();
					}).on('mouseout',function(){
						$tabbd.find(".tabhd-cont").eq(0);
						$tabhds.removeClass('active');
						$(this).addClass('active');
						$tabbd.hide();
						$tabbd.find(".tabbd-cont").eq(0).show();
					})
			}else if(eventType == "click"){
				$tabhds
					.on(eventType,function(){
						var index = $(this).index(".tabhd-cont") || 0;
						var $thisbd = $tabbd.find(".tabbd-cont").eq(index);
						$tabhds.removeClass('active');
						$(this).addClass('active');
						$tabbd.hide();
						$currbd.show();
					})
			}
		})
	}
};
