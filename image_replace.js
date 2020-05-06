function replace_image() {
    $('div').each(function(){
        if (this.classList.contains('css-1dbjc4n') && !this.classList.contains('processed')){
            this.classList.add('processed');
            this.style.backgroundImage = 'url("dummy")';
        }
        // TODO 画像をDLし、判定するようにする
    });
};

var observer = new MutationObserver(replace_image);

observer.observe(document, {
    childList: true,
    subtree: true,
  });
observer.observe(document.documentElement, {
    attributes: true
});

replace_image();