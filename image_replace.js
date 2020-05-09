// ImageNetのクラスのうち、飯テロ画像と認定するもの
const foods =[
    "corn",
    "bakery, bakeshop, bakehouse",
    "cucumber, cuke",
    "bagel, beigel",
    "hot pot, hotpot",
    "meat loaf, meatloaf",
    "guacamole",
    "eggnog",
    "potpie",
    "French loaf",
    "hotdog, hot dog, red hot",
    "burrito",
    "pizza, pizza pie",
    "espresso",
    "chocolate sauce, chocolate syrup",
    "ice cream, icecream",
    "cheeseburger",
    "carbonara",
    "burrito",
    "consomme",
    "plate",
    "frying pan, frypan, skillet",
    "trifle",
    "pretzel",
    "pizza, pizza pie",
    "broccoli",
    "cauliflower",
    "mashed potato",
    "acorn squash",
    "soup bowl",
    "wok",
    "Dungeness crab, Cancer magister",
    "American lobster, Northern lobster, Maine lobster, Homarus americanus",
    "cup",
    "spaghetti squash",
    "butternut squash",
    "rotisserie"
]

function isFood(name){
    var food_flag = false;
    for(var i=0;i<foods.length;i++){
        if(name == foods[i]){
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
        if (this.parentNode && (this.parentNode.getAttribute("aria-label")=="画像"||this.parentNode.getAttribute("aria-label")=="Image") && !this.classList.contains('processed')){
            this.classList.add('processed');
            var image_url = this.style.backgroundImage.match(/\"(.+)\"/)[1]
            console.log("loaded:" + image_url);
            // いったん隠す
            this.style.backgroundImage = 'url()';

            app(image_url).then(
              (answer) =>{
                if(isFood(answer)){
                    this.style.backgroundImage='url(' + chrome.runtime.getURL("replace.jpg") + ')';
                }else{
                    this.style.backgroundImage='url(' + image_url + ')';
                }
              }
            )

        }
        
    });
};

// モデルをロードした時のメッセージ
function modelLoaded() {
    console.log('Model Loaded!');
} 

// 画像へのパスを入力し、予測結果をPromiseで返す
async function app(set_src) {
    
    const model_url = chrome.runtime.getURL("mobilenet_v1_025_224/model.json")

    const classifier = ml5.imageClassifier(model_url, modelLoaded);

    console.log("seted:" + set_src);
    
    // 画像分類器に入れるelementの生成
    let imgEl = document.createElement('img');
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

console.log("started")
// ドキュメントの変化を監視
var observer = new MutationObserver(replace_image);

// 拡張機能を実行するか否か フラグをストレージからget
var extension_flag = true;
var default_data = {'key': true };
// 非同期処理・コールバック関数しか使えない（ぴえん
chrome.storage.sync.get(default_data, function (value) {

    extension_flag = value.key;

    if(extension_flag){
        replace_image();
        observer.observe(document, {
            childList: true,
            subtree: true,
        });
    }
    
    chrome.runtime.onMessage.addListener(function (set_flag) {
        //alert(set_flag ? "ONにしました" : "OFFにしました")
        extension_flag = set_flag
        if(extension_flag){
            replace_image();
            observer.observe(document, {
                childList: true,
                subtree: true,
            });
        }else{
            observer.disconnect();
        }
    });
});

// Icons made by Freepik from www.flaticon.com