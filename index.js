let $start = document.querySelector("#start");
let $game = document.querySelector("#game");
let $time = document.querySelector("#time");
let $game_time = document.querySelector("#game-time");
let $time_header = document.querySelector("#time-header");
let $result_header = document.querySelector("#result-header");
let $result = document.querySelector("#result");
let $login = document.querySelector("#login");
let $appPage = document.querySelector(".app");
let $loginPage = document.querySelector(".login");
let $nameUser = document.querySelector("#nameUser");
let $list = document.querySelector(".list");

let score = 0;
let user = {};
let list = [];
let check = false;
$start.addEventListener("click", start);

function start() {
  if (Object.keys(user).length > 0) {
    // user != user,name == undefined
    check = true;
  }
  list = getData("listUsers");
  score = 0;
  $start.classList.add("hide");
  $game.style.backgroundColor = "white";
  createBox();
  timer();
  setTime();
  $game_time.setAttribute("disabled", "true");
  setLocal();
}

function createBox() {
  $game.innerHTML = "";
  let box = document.createElement("div");
  let boxColor = `rgb(${getRandom(0, 254)},${getRandom(0, 254)},${getRandom(
    0,
    254
  )})`;
  let boxSize = getRandom(30, 100);
  let top = getRandom(0, 300 - boxSize);
  let left = getRandom(0, 300 - boxSize);
  box.style.backgroundColor = boxColor;
  box.style.width = box.style.height = boxSize + "px";
  box.style.left = left + "px";
  box.style.top = top + "px";
  box.style.cursor = "pointer";
  box.style.position = "absolute";
  box.setAttribute("data-box", "true");
  $game.insertAdjacentElement("afterbegin", box);
}

$game.addEventListener("click", clickedBox);
function clickedBox(event) {
  if (event.target.dataset.box) {
    createBox();
    score++;
  }
}
function timer() {
  let interval = setInterval(function () {
    $time.textContent = ($time.textContent - 0.1).toFixed(1);
    if ($time.textContent <= 0.0) {
      clearInterval(interval);
      end();
    }
  }, 100);
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function end() {
  $start.classList.remove("hide");
  $game.style.backgroundColor = "#ccc";
  $game.innerHTML = "";
  $game_time.removeAttribute("disabled");
  $result.textContent = score;
  toogle($result_header, $time_header);
  checkUser();
}

function checkUser() {
  if (check == true) {
    list = getData("listUsers");
    if (list[list.length - 1] < score) {
      list.pop();
      login();
      showUser();
    }
  } else {
    login();
    showUser();
  }
}

$game_time.addEventListener("change", setTime);
function setTime() {
  $time.textContent = $game_time.value;
  toogle($time_header, $result_header);
}

// function showResult(){
//     $time_header.classList.add("hide")
//     $result_header.classList.remove("hide")
// }

// function showTime(){
//     $time_header.classList.remove("hide")
//     $result_header.classList.add("hide")
// }

function toogle(first, second) {
  first.classList.remove("hide");
  second.classList.add("hide");
}

$login.addEventListener("click", function () {
  toogle($appPage, $loginPage);
});

function login() {
  user.name = $nameUser.value;
  user.score = score;
  list.push(user);
  sendData(list);
}

function showUser() {
  $list.innerHTML = "";
  list = getData("listUsers");
  list.sort(compare);
  if (list.length > 10) {
    list.splice(10, list.length - 10);
  }
  list.forEach(function (elem) {
    $list.insertAdjacentHTML(
      "beforeend",
      `
            <div class="user">
                ${elem.name} ------${elem.score}
                </div>
                `
    );
  });
}

function sendData(data) {
  localStorage.setItem("listUsers", JSON.stringify(data));
}

function getData(key) {
  return JSON.parse(localStorage.getItem(key));
}

function setLocal() {
  sendData([]);
}

function compare(a, b) {
  if (a.score > b.score) {
    return -1;
  }
  if (b.score < a.score) {
    return 1;
  }
  return 0;
}
