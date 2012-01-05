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
        var STOP = 0;
        var START = 1;
        var PAUSE = -1;
        var INTERVAL = 1000;
        
        var nextHandle = 1;
        var inQueue = [];
        var outQueue;
        var timerState = STOP;
        var timerHandle;
        
        var enqueue = function(callback) {
            var handle = nextHandle++;
            var bundle = {
                handle: handle,
                callback: callback
            };
            inQueue.push(bundle);
            return handle;
        };
        
        var deleteFromQueue = function(handle) {
            for (var i = 0, l = inQueue.length; i < l; i++) {
                if (inQueue[i].handle === handle) {
                    inQueue.splice(i, 1);
                    return;
                }
            }
        };
        
        var clearQueue = function() {
            inQueue.length = 0;
        };
        
        var switchQueue = function() {
            outQueue = inQueue;
            inQueue = [];
        };
        
        var dequeue = function() {
            var bundle = outQueue.shift();
            if (bundle) {
                return bundle.callback;
            } else {
                return;
            }
        };
        
        var timer = function() {
            var callback;
            switchQueue();
            stopTimer();
            while (callback = dequeue()) {
                if (callback) {
                    try {
                        callback(+new Date());
                    } catch (error) {
                        /* do nothing about error */
                    }
                }
            };
        };
        
        var startTimer = function() {
            if (timerState === STOP && inQueue.length > 0) {
                timerState = START;
                timerHandle = setTimeout(timer, INTERVAL);
            }
        };
        
        var stopTimer = function() {
            if (timerState === START) {
                timerState = STOP;
                clearTimeout(timerHandle);
                clearQueue();
            }
        };
        
        var pauseTimer = function() {
            if (timerState === START) {
                timerState = PAUSE;
                clearTimeout(timerHandle);
            }
        };
        
        var resumeTimer = function() {
            if (timerState === PAUSE) {
                timerState = START;
                timerHandle = setTimeout(timer, INTERVAL);
            }
        };
        
        for (var i = 0, l = prefixes.length; i < l; i++) {
            if ((prefixes[i] + 'Hidden') in document) {
                (function(prefix) {
                    document.addEventListener(prefix + 'visibilitychange', function() {
                        if (document[prefix + 'Hidden']) {
                            pauseTimer();
                        } else {
                            resumeTimer();
                        }
                    });
                })(prefixes[i]);
            }
        }
        
        window.requestAnimationFrame = function(callback) {
            var handle = enqueue(callback);
            startTimer();
            return handle;
        };
        
        window.cancelRequestAnimationFrame = function(handle) {
            deleteFromQueue(handle);
        };
    }
})(this);
