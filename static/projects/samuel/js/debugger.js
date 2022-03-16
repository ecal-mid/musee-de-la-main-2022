https://www.d3-graph-gallery.com/connectedscatter.html

console.graph = (function () {
    const iframe = document.createElement('iframe')
    
    const d3 = document.createElement('script');
    d3.onload = () => {

    }
    d3.setAttribute('src','https://d3js.org/d3.v6.js');
    document.head.appendChild(d3);

    // iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);
    // frame.srcdoc = '<p>Hello world!</p>'
    document.body.appendChild(iframe)
    iframe.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100000;
        background-color: rgba(128,128,128,0.5);
        border: 0;
        display: none;
    `
    console.log(iframe.contentWindow)

    let fadeTimeout

    return function () {
        clearTimeout(fadeTimeout)
        iframe.style.display = 'block'
        // fadeTimeout = setTimeout(() => iframe.style.display = 'none', 1000)
        console.log(arguments)
    }
})()