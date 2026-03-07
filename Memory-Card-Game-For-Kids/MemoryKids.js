const levels = {

1:['🍎','🍌','🍊'],
2:['🍎','🍌','🍊','🍇','🍓']

}

let level = 1
let score = 0
let best = localStorage.getItem("bestScore") || 0

let first = null
let second = null
let lock = false
let matches = 0
let startTime = 0

function startGame(){

document.getElementById("start-screen").classList.add("hidden")
document.getElementById("game-screen").classList.remove("hidden")

score = 0
level = 1

document.getElementById("best").innerText="🏆 Best: "+best

startLevel()

}

function startLevel(){

matches = 0
first = null
second = null
startTime = Date.now()

document.getElementById("level").innerText="Level "+level

createBoard()

}

function createBoard(){

const board=document.getElementById("board")
board.innerHTML=""

let fruits=levels[level]
let cards=[...fruits,...fruits]

cards.sort(()=>Math.random()-0.5)

/* GRID FIX */

if(level===1){

board.style.gridTemplateColumns="repeat(3,110px)"

}else{

board.style.gridTemplateColumns="repeat(5,110px)"

}

cards.forEach(fruit=>{

let card=document.createElement("div")
card.classList.add("card")
card.dataset.fruit=fruit

card.innerHTML=`

<div class="card-inner">

<div class="card-face card-front">❓</div>

<div class="card-face card-back">${fruit}</div>

</div>

`

card.onclick=()=>flip(card)

board.appendChild(card)

})

}

function flip(card){

if(lock) return
if(card===first) return

card.classList.add("flipped")

if(!first){

first=card
return

}

second=card

check()

}

function check(){

lock=true

if(first.dataset.fruit===second.dataset.fruit){

match()

}else{

setTimeout(()=>{

first.classList.remove("flipped")
second.classList.remove("flipped")

reset()

},800)

}

}

function match(){

playSound(first.dataset.fruit)

first.classList.add("matched")
second.classList.add("matched")

starBurst(first)
starBurst(second)

matches++

let speed=Math.max(10-Math.floor((Date.now()-startTime)/1000),1)

score+=speed

document.getElementById("score").innerText="⭐ Score: "+score

reset()

if(matches===levels[level].length){

setTimeout(()=>{

if(level===1){

level++
startLevel()

}else{

finish()

}

},800)

}

}

function starBurst(card){

for(let i=0;i<5;i++){

let star=document.createElement("div")
star.className="star"
star.innerText="⭐"

let rect=card.getBoundingClientRect()

star.style.left=rect.left+40+"px"
star.style.top=rect.top+"px"

document.body.appendChild(star)

setTimeout(()=>star.remove(),1000)

}

}

function reset(){

first=null
second=null
lock=false

}

function finish(){

document.getElementById("game-screen").classList.add("hidden")
document.getElementById("end-screen").classList.remove("hidden")

if(score>best){

best=score
localStorage.setItem("bestScore",score)

}

document.getElementById("final-score").innerHTML=
"⭐ Score: "+score+"<br>🏆 Best: "+best

confettiExplosion()

let speech=new SpeechSynthesisUtterance("Great job! You matched all the fruits!")
speech.rate=0.9
speech.pitch=1.1
speechSynthesis.speak(speech)

}

function confettiExplosion(){

for(let i=0;i<120;i++){

let confetti=document.createElement("div")
confetti.className="confetti"

confetti.style.left=Math.random()*100+"vw"

confetti.style.background=
`hsl(${Math.random()*360},100%,50%)`

confetti.style.animationDuration=
(2+Math.random()*2)+"s"

document.body.appendChild(confetti)

setTimeout(()=>confetti.remove(),3000)

}

}

function replay(){

document.getElementById("end-screen").classList.add("hidden")
document.getElementById("start-screen").classList.remove("hidden")

}

function playSound(fruit){

const names = {

'🍎':'Apple',
'🍌':'Banana',
'🍊':'Orange',
'🍇':'Grape',
'🍓':'Strawberry'

};

const speech = new SpeechSynthesisUtterance(names[fruit])

speech.rate = 0.9
speech.pitch = 1.2
speech.volume = 1

speechSynthesis.speak(speech)

}
