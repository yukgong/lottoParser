const result = document.querySelector('.lotto_result');
const refreshBtn = document.querySelector('.refresh-btn');
const pastResult = [];
const randomNumArray = [];

function randomNum() {
    return new Promise((resolve, reject) => {
        let i = 0;

        // 배열 만들기
        while (i < 6) {
            let n = Math.floor(Math.random() * 45) + 1;
            if (!sameNum(n)) {
                randomNumArray.push(n);
                i++;
            }
        }
        function sameNum(n) {
            for (let i = 0; i < randomNumArray.length; i++) {
                if (n === randomNumArray[i]) {
                    return true;
                }
            }
            return false;
        }

        // 배열 정렬
        randomNumArray.sort(function (a, b) {
            return a - b;
        })

        console.log(randomNumArray);
        resolve();
    })
}

// 같은 배열인지 비교하기
function compareArray(a, b) {
    for (let i = 0; i < b.length; i++) {
        if (a.join('') === b[i][1].join('')) {
            console.log('중복');
            paintNum('다시하세요');
            return "false"
        }
        else {
            continue
        }
    }
    console.log('비교완료');
    paintNum(a);
};

// 파일 읽어들이기
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function makeArray() {
    return new Promise((resolve, reject) => {
        readTextFile("lottoNum.json", function (text) {
            let originData = JSON.parse(text).excel;
            const totalCount = Object.keys(originData).length;
            for (let i = 0; i < totalCount; i++) {
                let group = [];
                let winNumArray = [];
                let num = Object.values(originData[i])[0];
                group.push(num);

                for (let j = 1; j < Object.keys(originData[i]).length-1; j++) {
                    let num = Object.values(originData[i])[j];
                    winNumArray.push(num);
                }
                group.push(winNumArray);
                pastResult.push(group);
            }
            console.log(pastResult);
        })
        resolve();
    })
}

function paintNum(array){
    result.innerHTML = array;
}

function init() {
    const time1 = new Promise((resolve, reject) => {
        resolve("Success!");
        console.log(1);
        makeArray();
    }).then(r => {
        console.log(2);
        randomNum().then(r => {
            console.log(3);
            setTimeout(function () {
                compareArray(randomNumArray, pastResult);
            }, 200)
        })
    });

    refreshBtn.addEventListener('click', function(){
        window.location.reload(true);
    });
}

init();