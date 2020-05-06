function replace_image() {
    $('div').each(function(){
        // TODO 開いた画像は隠さないようにする
        if (this.parentNode && this.parentNode.getAttribute("aria-label")=="画像" && this.classList.contains('css-1dbjc4n'&&'r-1niwhzg'&&'r-vvn4in'&&'r-u6sd8q'&&'r-4gszlv'&&'r-1p0dtai'&&'r-1pi2tsx'&&'r-1d2f490'&&'r-u8s1d'&&'r-zchlnj'&&'r-ipm5af'&&'r-13qz1uu'&&'r-1wyyakw') && !this.classList.contains('processed')){
            this.classList.add('processed');
            console.log(this.style.backgroundImage);
            this.style.backgroundImage='url(' + chrome.runtime.getURL("test.jpg") + ')';
        }
        // TODO 画像を判定するようにする
    });
};

// ドキュメントの変化を監視
var observer = new MutationObserver(replace_image);
observer.observe(document, {
    childList: true,
    subtree: true,
  });
observer.observe(document.documentElement, {
    attributes: true
});

replace_image();

// When the model is loaded
function modelLoaded() {
    console.log('Model Loaded!');
  }
 
const model_url = chrome.runtime.getURL("mobilenet_v1_025_224/model.json")

const classifier = ml5.imageClassifier(model_url, modelLoaded);

function app(set_src) {
// Initialize the Image Classifier method with MobileNet

    console.log(set_src);

    // 画像分類の実行
    let imgEl = document.createElement('img');
    imgEl.id = "img"
    //CORSに引っかからないように
    imgEl.crossOrigin = "anonymous"
    imgEl.src = set_src

    // Make a prediction with a selected image
    classifier.classify(imgEl, (err, results) => {
        console.log(results);
    });

}

//app(chrome.runtime.getURL("test.jpg"));
//app("https://pbs.twimg.com/media/EXU_dDqUMAEP18x?format=jpg&name=900x900");
//background-image: url("https://pbs.twimg.com/media/EXU_dDqUMAEP18x?format=jpg&name=900x900");