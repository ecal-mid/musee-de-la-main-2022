class e extends class{constructor(){this._events={}}addEventListener(e,t){const n=this._events;(n[e]=n[e]||[]).push(t)}emit(e,t){const n=this._events[e];n&&n.forEach(((e,n)=>{e.apply(null,t)}))}removeEventListener(e){delete this._events[e]}}{constructor(){super(),this.handlers={open:this.onOpenWSConnection.bind(this),error:this.onWSError.bind(this),message:this.onWSMessage.bind(this)},this.checkWebsocketAvailibility()}checkWebsocketAvailibility(){window.WebSocket=window.WebSocket||window.MozWebSocket,window.WebSocket?this.initConnection():alert("Il faut utiliser un autre navigateur. Chrome par exemple.")}initConnection(){this.connection=new WebSocket(`ws://${window.location.host}`),this.connection.onopen=this.handlers.open,this.connection.onerror=this.handlers.error,this.connection.onmessage=this.handlers.message}onOpenWSConnection(e){console.log("::open connection::",e)}onWSError(e){console.log("::error::",e)}onWSMessage(e){console.log("::message::",e),this.emit("message",[JSON.parse(e.data)])}}class t{constructor(){console.log("iFrame is ok"),this.handlers={message:this.onMessage.bind(this),load:this.onIFrameLoaded.bind(this)},this.frame=document.getElementById("frame"),this.frame.src=frame.src,this.frame.addEventListener("load",this.handlers.load),this.socket=new e,this.socket.addEventListener("message",this.handlers.message),this.initData()}async initData(){this.studentsData=await class{constructor(){}static loadJSON(e){return fetch(e).then((e=>e.json())).then((e=>e))}}.loadJSON("/json/studentProjects.json")}onIFrameLoaded(e){console.log("::iframe loaded::",e),this.onFrameLoad(e)}onMessage(e){if("project_id"in e){const t=parseInt(e.project_id),n=this.studentsData.projects[t].url;this.frame.src=n+`?_v=${(new Date).getTime()}`}}onFrameLoad(e){}}var n=Object.freeze({smoothenDetection:.5,cameraConstraints:{audio:!1,video:!0},mediaPipeOptions:{selfieMode:!1,modelComplexity:1,smoothLandmarks:!0,enableSegmentation:!1,smoothSegmentation:!0,minDetectionConfidence:.5,minTrackingConfidence:.5}});const o=async function(e,t={}){return new Promise(((n,o)=>{const s=document.createElement("script");document.head.appendChild(s),s.onload=n,s.onerror=o,Object.entries(t).forEach((([e,t])=>{s[e]=t})),s.src=e}))}("/scripts/mediapipe-pose.js",{type:"module"});window.onload=async()=>{await o;const e=await window.MediaPipePose.create({cameraConstraints:n.cameraConstraints,mediaPipeOptions:n.mediaPipeOptions,smoothen:n.smoothenDetection}),s=e.getVideoPlayer();e.startDetection();(new t).onFrameLoad=function(t){const n=t.target.contentWindow?.mediaPipe;n&&n.setup({stream:s.stream,width:s.width,height:s.height,pose:e})}};
//# sourceMappingURL=index.c8c7a54c.js.map