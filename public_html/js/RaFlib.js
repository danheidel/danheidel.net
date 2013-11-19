

//Drop in replace functions for setTimeout() & setInterval() that       \\
//make use of requestAnimationFrame() for performance where available   \\
//http://www.joelambert.co.uk                                           \\
//                                                                      \\
//Copyright 2011, Joe Lambert.                                          \\  
//Free to use under the MIT license.                                    \\
//http://www.opensource.org/licenses/mit-license.php                    \\
//                                                                      \\  
//minor edits Dan Heidel 2012, all attribution to Joe Lambert           \\
//added annotation,
//moved rAF call to head of function for more accurate timing, use caution if your
//fn call runtime is longer than your delay, overlapping, multiple instances of fn will be running concurrently
//
//handle requestInterval(fn, delay)
//void clearRequestInterval(handle)
//handle requestTimeout(fn, delay)
//void clearRequestTimeout(handle)


(function initAnimation()
{
    //self-calling anonymous to ensure requestAnimationFrame and cancelAnimationFrame are available across browsers
    
    if(!window.requestAnimationFrame)
    {
        window.requestAnimationFrame = 
            window.webkitRequestAnimationFrame ? window.webkitRequestAnimationFrame :
            window.msRequestAnimationFrame ? window.msRequestAnimationFrame :
            window.oRequestAnimationFrame ? window.oRequestAnimationFrame :
            (window.mozRequestAnimationFrame && //FF5 lacks cancel, fall back to legacy func
                window.mozCancelRequestAnimationFrame) ? window.mozRequestAnimationFrame :
            function(callback, element) 
            {   //approximates rAF with setTimeout for legacy browers, aims for 60FPS, 
                //lacks rAf intelligent throttling and other features
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
    }
    
    if(!window.cancelAnimationFrame)
    {
        window.cancelAnimationFrame =
            window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame :
            window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame : // Support for legacy API 
            window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame :
            window.oCancelRequestAnimationFrame	? window.oCancelRequestAnimationFrame :
            window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame :
            clearTimeout(handle);            
    }
    
    if(!window.requestInterval)
    {
        window.requestInterval = function(userFn, delay)
        {
            var start = new Date().getTime();
            var handle = new Object();
            
            function loop()
            {
                handle.value = requestAnimationFrame(loop);
                
                var current = new Date().getTime();
                delta = current - start;
                
                if(delta >= delay)
                {
                    userFn.call();
                    start = new Date().getTime();
                }
            }; //loop()
            
            handle.value = requestAnimationFrame(loop);
            return handle;
        }; //window.requestInterval
    }

    if(!window.clearRequestInterval)        
    {
        window.clearRequestInterval = function(handle)
        {
            window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
            window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
            window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
            window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
            window.oCancelRequestAnimationFrame	? window.oCancelRequestAnimationFrame(handle.value) :
            window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
            clearInterval(handle);
        }; //clearRequestInterval
    }
 
    if(!window.requestTimeout)
    {
        window.requestTimeout = function(userFn, delay)
        {             
            var start = new Date().getTime(),
            handle = new Object();
            
            function loop()
            {
                var current = new Date().getTime(),
                delta = current - start;
                
                delta >= delay ? userFn.call() : handle.value = requestAnimationFrame(loop); 
                    //if has been longer than delay, fire fn, else new instance of loop()
            }; //loop()
            
            handle.value = requestAnimationFrame(loop);
            return handle;   
        }; //window.requestTimeout
    }
    
    if(window.clearRequestTimeout)
    {
        window.clearRequestTimeout = function(handle) 
        {
            window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
            window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
            window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
            window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
            window.oCancelRequestAnimationFrame	? window.oCancelRequestAnimationFrame(handle.value) :
            window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
            clearTimeout(handle);
        }; //window.clearRequestTimeout
    }
})();

