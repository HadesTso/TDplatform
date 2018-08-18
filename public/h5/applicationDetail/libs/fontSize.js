(function() {
     function setFontSize() {
          var winWidth = Math.min(window.innerWidth ? window.innerWidth : 1e5, window.screen.availWidth ? window.screen.availWidth : 1e5);
          document.getElementsByTagName('html')[0].style.fontSize = (winWidth / 160 * 6) + 'px';
     }
     setFontSize();
     window.onresize = function() {
          setFontSize();
     }
})();