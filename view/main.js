$(document).ready(function() {
	var header	= document.querySelector('header');
	var video  	= document.querySelector('video');
	var canvas 	= document.querySelector('canvas');
	var initAlpha, alpha, steeringAngle;

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

			if (steeringAngle > 90) {

				video.style.transform = "rotate(" + String(-steeringAngle) + "deg)";
				canvas.style.transform = "rotate(" + String(-steeringAngle) + "deg)";
				socket_steering_handler(steeringAngle);
				header.textContent = steeringAngle;

			} else {
				video.style.transform = "rotate(" + String(steeringAngle) + "deg)";
				canvas.style.transform = "rotate(" + String(steeringAngle) + "deg)";
				socket_steering_handler(-steeringAngle);
				header.textContent = -steeringAngle;
			}
		}
	});

	var time = 0;
	var timebar = document.querySelector('.timebar-fill');

	setInterval(function(){
		timebar.style.width = (time/60)*100 + "%";
		time += 1;
	}, 1000);
})
