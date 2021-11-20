// ==UserScript==
// @name         naver-map-script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://map.naver.com/*
// @icon         https://www.google.com/s2/favicons?domain=naver.com
// @grant        none
// @run-at       document-end
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/proj4js/1.3.1/proj4.js
// ==/UserScript==

const simulateEnterPress = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', {
        'keyCode': '13'
    }))
}

(function() {
const btn = document.createElement('button')
const placeHolder = $('.search_wrap')
btn.innerHTML = 'enter'
btn.style.padding = '5px'
btn.onclick = simulateEnterPress
console.log(proj4)
setTimeout(placeHolder.appendChild(btn), 7000)
})();
