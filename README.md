This is a `requestAnimationFrame` implementation in JavaScript. 

## What is requestAnimationFrame?

If you don't know what `requestAnimationFrame` is, you can see the [latest draft of the spec](http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/RequestAnimationFrame/Overview.html). It's a browser API for script-based animation. It allows the browser to control the frame rate in order to make the animation smooth while saving computation power so you don't have to worry about that.

## How to use it?

    var animationHandle;
    
    function startAnimation() {
        drawAnimationFrame();
    };
    
    function stopAnimation() {
        window.cancelRequestAnimationFrame(animationHandle);
    };
    
    function drawAnimationFrame() {
        /* draw your animation frame here */
        animationHandle = window.requestAnimationFrame(drawAnimationFrame);
    };
