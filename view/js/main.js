var ROUND_TIME = 30;
var collected = 0;
var $points = $('.points-wrapper');

function animateCSS(element, animationName, callback) {
	var node = document.querySelector(element)
	node.classList.add('animated', animationName)

	function handleAnimationEnd() {
			node.classList.remove('animated', animationName)
			node.removeEventListener('animationend', handleAnimationEnd)

			if (typeof callback === 'function') callback()
	}

	node.addEventListener('animationend', handleAnimationEnd)
}

animateCSS('body', 'fadeInUp');

function collectObject() {
	$points.text(parseInt($points.text()) + 1)
	animateCSS('#points', 'rubberBand');
}

var username = localStorage.getItem("name");

$(document).ready(function() {
	var video  	= document.querySelector('video');
	var canvas 	= document.querySelector('canvas');
	var initAlpha, alpha, steeringAngle, speedAngle;

	window.addEventListener("deviceorientation", function(event) {
		if (!video || !canvas) {
			video = document.querySelector('video');
			canvas = document.querySelector('canvas');

		} else {
			alpha = event.alpha;

			if (initAlpha == undefined) {
				initAlpha = alpha;
			}

			steeringAngle = parseFloat(alpha) - parseFloat(initAlpha);

			if (steeringAngle > 180) {
				steeringAngle -= 180;
				video.style.transform = "rotate(" + String(-steeringAngle) + "deg)";
				canvas.style.transform = "rotate(" + String(-steeringAngle) + "deg)";
				socket_steering_handler(steeringAngle);

			} else {
				video.style.transform = "rotate(" + String(steeringAngle) + "deg)";
				canvas.style.transform = "rotate(" + String(steeringAngle) + "deg)";
				socket_steering_handler(-steeringAngle);
			}
		}
	});

	$(".speed-control").on("input change", function(e) {
		speedAngle = parseInt($(this).val()) * 0.9;
		socket_speed_handler(speedAngle);
		window.navigator.vibrate(Math.abs(speedAngle) * 10);
	})

	var time = 0;
	var timebar = document.querySelector('.timebar-fill');

	var timer = setInterval(function(){
		timebar.style.width = (time/ROUND_TIME)*100 + "%";
		time += 1;

		if (ROUND_TIME - time > 10) {
			animateCSS('.timebar-clock', 'shake');
		}

		if (time == ROUND_TIME) {
			clearInterval(timer)
			timebar.style.width = "100%";
			window.navigator.vibrate([1000, 300, 300, 300, 2000]);
			animateCSS('.timebar-clock', 'jackInTheBox');
		}
	}, 1000);
})
