//这种格式的传参，无法做到同时运动，所以传参的形式要做相应的变化startMove(obj,{attr1:target1,attr2:target2},fn)
// function startMove(obj,json,fn) {

// }
// function startMove(obj,attr,target,fn) {
function startMove(obj,json,fn) {
	//var flag = true; 
	/* 放到外面，同步运动是可以实现的，但是链式运动无法完成,因为，放到定时器外面，不会每30ms就刷新一下
		flag标志，在不做链式运动的时候，在完成动画之前，清不清除定时器，对动画的效果是没有影响的，但是一
	  	到链式动画的时候，如果不清楚动画，后面的额回调函数时候不会执行的(因为只要有一次flag是false，由于flag
	  	不是在定时器中定义赋值的，所以不会每30ms检查更新，所以会一直未false，怎么解决呢？要么就是在定时器中
	  	立flag，要么就在flag的变化if语句中，加上else判断，这样做，还是会有误差的，flag放到里面最好)*/
	//函数中有定时器的，一上来就清除定时器，防止定时器叠加
	clearInterval(obj.timer);
	obj.timer = setInterval(function() {
		var flag = true; //flag要放到里面，放到外面，链式运动，无法完成
		for(var attr in json) {
			//为了透明度通用
			//1、获取当前值
			var currentAttr = 0;//当前属性值
			if(attr == 'opacity') {
				currentAttr = Math.round(parseFloat(getStyle(obj,attr)) * 100);
			} else {
				currentAttr = parseInt(getStyle(obj,attr)); 
			}
			//2、计算速度
			var speed = (json[attr] - currentAttr)/4;//自动就有了正负
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
			//是否停止
			// if(currentAttr == json[attr]) {
			if(currentAttr != json[attr]) {
				flag = false;
				// clearInterval(obj.timer);
				//链式运动，判断是否有回调函数传入
				// if(fn) {
				// 	fn();
				// }
			// } else {
			// 	flag = true;
			}
			// } else {
				//这里没有判断是否是所有的属性变化都达到了需要的值，只是当有一个属性值达到的时候，就会停止整个动画
			if(attr == 'opacity') {
				obj.style.filter = 'alpha(opacity:'+ (currentAttr + speed) +')' ;
				obj.style.opacity = (currentAttr + speed) / 100;
			} else {
				obj.style[attr] = currentAttr + speed + 'px';
				// console.log(obj.style[attr]);
			}
		}
		if(flag) {
			// console.log(obj.style[attr]);
			clearInterval(obj.timer);
			if(fn) {
				fn();
			}
		}
		
	}, 30);
}

function getStyle(obj,attr) {
	if(obj.currentStyle) { //取属性，兼容ie
		return obj.currentStyle[attr];
	} else { //火狐和chrome
		return getComputedStyle(obj,null)[attr];
	}
}