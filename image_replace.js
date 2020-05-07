// ImageNetのクラスのうち、飯テロ画像と認定するもの
const foods =[
    "corn",
    "bakery",
    "cucumber",
    "bagel",
    "hot pot",
    "meat loaf",
    "guacamole",
    "eggnog",
    "potpie",
    "French loaf",
    "hotdog",
    "burrito",
    "pizza",
    "espresso",
    "chocolate sauce",
    "ice cream",
    "cheeseburger",
    "carbonara",
    "burrito",
    "consomme",
    "plate",
    "frying pan",
    "trifle",
    "pretzel",
    "pizza, pizza pie",
    "broccoli",
    "cauliflower",
    "mashed potato",
    "acorn squash",
    "soup bowl",
    "wok",
    "Dungeness crab",
    "American lobster"
]

function isFood(name){
    var food_flag = false;
    for(var i=0;i<foods.length;i++){
        if(name.match(foods[i])){
            food_flag=true;
            break;
        }
    }
    return food_flag;
}

// TODO The FetchEvent for "<URL>" resulted in a network error response: the promise was rejected.を何とかする
function replace_image() {
    // 非同期処理なので注意
    $('div').each(function(){
        if (this.parentNode && this.parentNode.getAttribute("aria-label")=="画像" && this.classList.contains('css-1dbjc4n'&&'r-1niwhzg'&&'r-vvn4in'&&'r-u6sd8q'&&'r-4gszlv'&&'r-1p0dtai'&&'r-1pi2tsx'&&'r-1d2f490'&&'r-u8s1d'&&'r-zchlnj'&&'r-ipm5af'&&'r-13qz1uu'&&'r-1wyyakw') && !this.classList.contains('processed')){
            this.classList.add('processed');
            var image_url = this.style.backgroundImage.match(/\"(.+)\"/)[1]
            console.log("loaded:" + image_url);
            this.style.backgroundImage = 'url()';

            app(image_url).then(
              (answer) =>{
                if(isFood(answer)){
                    this.style.backgroundImage='url(' + chrome.runtime.getURL("test.jpg") + ')';
                }else{
                    this.style.backgroundImage='url(' + image_url + ')';
                }
              }
            )

        }
        
    });
};

// When the model is loaded
function modelLoaded() {
    console.log('Model Loaded!');
} 

// 画像へのパスを入力し、予測結果をPromiseで返す
async function app(set_src) {
    // Initialize the Image Classifier method with MobileNet
    
    const model_url = chrome.runtime.getURL("mobilenet_v1_025_224/model.json")

    const classifier = ml5.imageClassifier(model_url, modelLoaded);

    console.log("seted:" + set_src);
    
    // 画像分類の実行
    let imgEl = document.createElement('img');
    imgEl.id = "img"
    //CORSに引っかからないように
    imgEl.crossOrigin = "anonymous"
    imgEl.src = set_src

    var answer

    await classifier.classify(imgEl)
    .then(results => {
        console.log("classified:"+set_src);
        console.log(results[0].label);
        answer = results[0].label;
    });

    return answer
    
}

replace_image();

// ドキュメントの変化を監視
var observer = new MutationObserver(replace_image);
observer.observe(document, {
    childList: true,
    subtree: true,
  });
observer.observe(document.documentElement, {
    attributes: true
});
