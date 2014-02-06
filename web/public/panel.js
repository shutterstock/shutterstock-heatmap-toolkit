var heatmap_script = document.createElement('script');
heatmap_script.src=host+"/js/Heatmap.js";
document.body.appendChild(heatmap_script);
var iframe = document.createElement('iframe');
iframe.src = host+'/panel.html';
iframe.style.position = "fixed";
iframe.id = "iframe";
iframe.style.top = "-40px";
iframe.style.left = 0;
iframe.style.borderWidth = "0";
iframe.style.height = "4000px";
iframe.style.width = "100%";
iframe.style.zIndex = 5000;
document.body.appendChild(iframe);
var heatmap = document.createElement('div');
heatmap.style.width='100%';
heatmap.style.height='4000px';
heatmap.style.zIndex=10000;
heatmap.style.position = 'fixed';
heatmap.style.top = 0;
heatmap.style.left = 0;
heatmap.style.pointerEvents = 'none';
heatmap.id="heatmap-overlay";
document.body.appendChild(heatmap);
document.body.style.setProperty("-webkit-transition", "-webkit-transform 0.25s ease-out");
document.body.style.webkitTransform = "translateY(40px)";



