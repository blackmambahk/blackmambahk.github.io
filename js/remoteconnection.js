(function() {
    'use strict';
    /**
     * The RemoteConnection receives commands from the remote window and responds by sending events
     */
    var RCController = function(){

        var self = {};
        /**
         * Handler for the Message Event (Communicate with parent)
         * @param {Event} e
         */
        function onMessage(e){
            e.stopImmediatePropagation();
            var data, method;
            try {
                data = e.data;
                method = data.method;
            } catch (e) {
                //fail silently... like a ninja!
            }

            var params = data.params || [];
            var value = data.value;
            var eventData = data.data;
            var targetId = data.targetId || data.player_id;


            if (value !== undefined) {
                params.push(value);
            }

            if (eventData) {
                params.push(eventData);
            }

            if (targetId) {
                params.push(targetId);
            }
            switch(method){
                case 'load':
                    break;
                case 'next':
                    break;
                case 'prev':
                    break;
                case 'goToPage':
                    break;
                case 'zoom':
                    break;
                case 'printPage':
                    printPage();
                    break;
                default:
                    break;
            }
        }

        /**
         * Send a message to the parent window
         * msg are either event/data or method/value or method/params
         * @param method
         * @param data
         */
        function postMessageCall(method,data){
            if(Array.isArray(data)){
                window.parent.postMessage( { method:method, params:params}, '*');
            }else{
                window.parent.postMessage( { method:method, value:value}, '*');
            }
        }

        /**
         *
         * @param event
         * @param data
         */
        function postMessageEvent(event,data){
            window.parent.postMessage( { event:event, data:data}, '*');
        }

        /**
         * Prints the current page
         */
        function printPage() {
            html2canvas(document.body, {
                onrendered: function (canvas) {
                    postMessageEvent('printPage', canvas.toDataURL());
                }
            });
        }
        function require( url ) {
            var ajax = new XMLHttpRequest();
            ajax.open( 'GET', url, true);
            ajax.onreadystatechange = function () {
                var script = ajax.response || ajax.responseText;
                if (ajax.readyState === 4) {
                    switch( ajax.status) {
                        case 200:
                            eval.apply( window, [script] );
                            console.log("script loaded: ", url);
                            break;
                        default:
                            console.log("ERROR: script not loaded: ", url);
                    }
                }
            };
            ajax.send(null);
        }
        function loadHandler(e){
            window.removeEventListener('load',loadHandler);
            init();
        }
        /**
         *
         */
        function init(){
            if (document.readyState === 'complete') {
                //hook up message handler
                window.addEventListener('message', onMessage);
                //let parent know we are ready to receive commands
                postMessageEvent('ready');
                //get the script folder path
                var path = (new URL(document.querySelector('script[src*="remoteconnection.js"]').src)).pathname;
                path = path.split('/');
                path.pop();
                path = path.join('/');
                path+='/';
                //load scripts
                require(path+'html2canvas.js');
                require(path+'html2canvas.svg.js');
            }else{
                window.addEventListener('load', loadHandler);
            }
        }
        init();
        self.postMessageEvent = postMessageEvent;
        self.postMessageCall = postMessageCall;
        return self;
    };
    /**type PDFController*/
    window.RCController = new RCController();

})();