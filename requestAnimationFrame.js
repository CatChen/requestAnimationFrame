(function(window, undefined) {
    /* Opera doesn't support requestAnimationFrame so far so the 'o' prefix is just a guessing. */
    var prefixes = ['webkit', 'moz', 'ms', 'o'];
    for (var i = 0, l = prefixes.length; !('requestAnimationFrame' in window ) && i < l; i++) {
        if ((prefixes[i] + 'RequestAnimationFrame') in window) {
            window.requestAnimationFrame = window[prefixes[i] + 'RequestAnimationFrame'];
            window.cancelRequestAnimationFrame = window[prefixes[i] + 'CancelRequestAnimationFrame'];
        }
    }
    
    if (!('requestAnimationFrame' in window )) {
        var nextHandle = 1;
        var frameQueue = [];
        var timerEnabled = false;
        
        var enqueue = function(callback) {
            var handle = nextHandle++;
            var bundle = {
                handle: handle,
                callback: callback
            };
            frameQueue.push(bundle);
            return handle;
        };
        
        var dequeue = function() {
            var bundle = frameQueue.shift();
            if (bundle) {
                return bundle.callback;
            } else {
                return;
            }
        };
        
        var deleteFromQueue = function(handle) {
            for (var i = 0, l = frameQueue.length; i < l; i++) {
                if (frameQueue[i].handle === handle) {
                    frameQueue.splice(i, 1);
                    return;
                }
            }
        };
        
        var timer = function() {
            while (frameQueue.length > 0) {
                var callback = dequeue();
                if (callback) {
                    try {
                        callback(+new Date());
                    } catch (error) {
                        /* do nothing about error */
                    }
                }
            };
            disableTimer();
        };
        
        var enableTimer = function() {
            if (!timerEnabled && frameQueue.length > 0) {
                timerEnabled = true;
                setTimeout(timer, 1000 / 60);
            }
        };
        
        var disableTimer = function() {
            timerEnabled = false;
        };
        
        window.requestAnimationFrame = function(callback) {
            var handle = enqueue(callback);
            enableTimer();
            return handle;
        };
        
        window.cancelRequestAnimationFrame = function(handle) {
            deleteFromQueue(handle);
        };
    }
})(this);
