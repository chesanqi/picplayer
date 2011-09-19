/*轮播*/
(function($){
	$.fn.lunboFocus = function(customsetting){
		var settings = $.extend({
			lb_dd:null,             		   //大图
			lb_btn:null,                       //箭头
			lb_img_btn_dom:null,               //小图
			lb_img_btn_num:1,                  //小图显示数量
			btn_int:0,                         //小图间距
			speed:5                            //速度
		},customsetting || {});

		settings.lb_dd = $(settings.lb_dd); //大图规范为JQ对象
		settings.lb_btn = $(settings.lb_btn);//左右按钮规范为JQ对象
		var lb_img_btn = $(settings.lb_img_btn_dom);//小图规范为JQ对象
		var lb_img_btn_width = lb_img_btn.width() + settings.btn_int;//小图占位宽（宽度+外边距）
		var lb_img_box = $(lb_img_btn).parent();//小图父元素jq对象
		lb_img_box.width(lb_img_btn_width*settings.lb_img_btn_num);//小图父元素jq对象宽度
		settings.speed *= 1000//自动轮播速度
		var re_auto = lb_img_btn.length*lb_img_btn_width;//小图滚动速度，随小图数量（即总体长度）变化
		var alpha_img = .5;//小图半透明
		var alpha_img_curr = 1;//小图不透明
		var lb_auto = setInterval(lb_next,settings.speed)//启动轮播
		
		//初始状态
		lb_img_btn.fadeTo('fast',alpha_img)
		lb_img_btn.first().add(settings.lb_dd.first()).addClass('curr first').fadeTo('fast',alpha_img_curr);
		lb_img_btn.last().add(settings.lb_dd.last()).addClass('last');
		
		//小图横向排列
		lb_img_btn.each(function(i){
			$(this).css('left',settings.btn_int);
			settings.btn_int += lb_img_btn_width;
		})
		
		//点击小图
		lb_img_btn.hover(function(){
			$(this).stop($(this).fadeIn()).fadeTo('fast',alpha_img_curr);
		},function(){
			if(!$(this).is('.curr')){
				$(this).fadeTo('normal',alpha_img);
			}
		}).click(function(){
			$(this).siblings('.curr').removeClass('curr').fadeTo('normal',alpha_img);
			$(this).addClass('curr').fadeTo('normal',alpha_img_curr);
			var n = $(this).index(settings.lb_img_btn_dom);
			settings.lb_dd.filter('.curr').removeClass('curr').hide();
			settings.lb_dd.eq(n).addClass('curr').fadeTo('slow',alpha_img_curr);
		})
		
		//左右箭头
		settings.lb_btn.hover(function(){
			clearInterval(lb_auto);
			$(this).addClass('curr');
		},function(){
			$(this).removeClass('curr');
			lb_auto = setInterval(lb_next,settings.speed);
		})
		settings.lb_btn.first().click(function(){
			lb_prev();
		})
		settings.lb_btn.last().click(function(){
			lb_next();
		})
		/* 可视范围外 */
		function outview(direction){
			var currpos1 = lb_img_box.scrollLeft() - lb_img_btn_width;
			var currpos2 = lb_img_box.scrollLeft() + lb_img_box.width();
			var nnn = lb_img_btn.filter('.curr').index(settings.lb_img_btn_dom);
			if(!((nnn*lb_img_btn_width)> currpos1 && (nnn*lb_img_btn_width) < currpos2)){
				if(direction){
					lb_img_box.animate({
						scrollLeft:lb_img_box.scrollLeft() + lb_img_box.width()
					},300)
				}else{
					lb_img_box.animate({
						scrollLeft:lb_img_box.scrollLeft() - lb_img_box.width()
					},300)
				}	
			}	
		}
		/* animate */
		function lb_prev(){
			if(lb_img_btn.filter('.curr').is('.first')){
				//小图状态
				lb_img_btn.last().addClass('curr').fadeTo('slow',alpha_img_curr).end()
					.filter('.curr:first').removeClass('curr').fadeTo('slow',alpha_img);
				//大图状态
				settings.lb_dd.last().addClass('curr').fadeIn('slow').end()
					.filter('.curr:first').removeClass('curr').fadeOut('slow');	
				//滚动条
				lb_img_box.animate({
					scrollLeft:lb_img_btn_width*lb_img_btn.last().index(settings.lb_img_btn_dom)
				},re_auto)
					.scrollLeft(lb_img_btn_width*lb_img_btn.last().index(settings.lb_img_btn_dom));
			}else{
				//小图状态
				lb_img_btn.filter('.curr').prev().addClass('curr').fadeTo('slow',alpha_img_curr).end()
					.removeClass('curr').fadeTo('slow',alpha_img);
				//大图状态
				settings.lb_dd.filter('.curr').prev().addClass('curr').fadeIn('slow').end()
					.removeClass('curr').fadeOut('slow');
				//滚动条
				outview(false)
			}
		}
		function lb_next(){
			if(!settings.lb_dd) return
			if(lb_img_btn.filter('.curr').is('.last')){
				lb_img_btn.first().addClass('curr').fadeTo('slow',alpha_img_curr).end()
					.filter('.curr:last').removeClass('curr').fadeTo('slow',alpha_img);
				settings.lb_dd.first().addClass('curr').fadeIn('slow').end()
					.filter('.curr:last').removeClass('curr').fadeOut('slow');
				lb_img_box.animate({
					scrollLeft:0
				},re_auto);	
			}else{
				lb_img_btn.filter('.curr').next().addClass('curr').fadeTo('slow',alpha_img_curr).end()
					.removeClass('curr').fadeTo('slow',alpha_img);
				settings.lb_dd.filter('.curr').next().addClass('curr').fadeIn('slow').end()
					.removeClass('curr').fadeOut('slow');
				outview(true)
			}
		}
	}
})(jQuery)