## mpeg video stream for development

1. `npm install`
2. `npm run mac` to run it locally with your webcam
3. `npm run pi` to run it on the pi with attached usb camera.

It usually takes a minute for the video to start streaming.

Explanation found [here](https://stackoverflow.com/questions/56504378/low-latency-50ms-video-streaming-with-node-js-and-html5)

If u get error because the port is already in use, run `pkill node`