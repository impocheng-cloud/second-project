# group-1
<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>抽牌比大小 GROUP1</title>

<style>
body{
    margin:0;
    font-family:"Microsoft JhengHei",sans-serif;
    background:#0b6b2a;
    color:white;
    text-align:center;
}

h1{
    margin-top:20px;
}

#deck{
    width:120px;
    height:170px;
    background:#1e40af;
    border:4px solid white;
    border-radius:10px;
    margin:20px auto;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:60px;
    box-shadow:0 0 20px black;
}

.container{
    display:flex;
    justify-content:center;
    gap:80px;
    margin-top:20px;
}

.area{
    text-align:center;
}

.card{
    width:120px;
    height:170px;
    background:white;
    color:black;
    border-radius:10px;
    border:3px solid black;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:36px;
    font-weight:bold;
    white-space:pre-line;
    box-shadow:0 0 15px black;
}

.red{
    color:red;
}

button{
    margin-top:30px;
    padding:12px 30px;
    font-size:20px;
    cursor:pointer;
    border:none;
    border-radius:8px;
}

#result{
    margin-top:30px;
    font-size:30px;
    font-weight:bold;
}

#remain{
    margin-top:15px;
    font-size:18px;
}
</style>

</head>

<body>

<h1>🃏 抽牌比大小 GROUP1</h1>

<div id="deck">🂠</div>

<div class="container">

<div class="area">
<h2>玩家</h2>
<div id="playerCard" class="card">?</div>
</div>

<div class="area">
<h2>電腦</h2>
<div id="computerCard" class="card">?</div>
</div>

</div>

<button onclick="drawCards()">抽牌</button>

<div id="result"></div>

<div id="remain"></div>

<script>

const suits=[
{name:"♠",value:4,color:"black"},
{name:"♥",value:3,color:"red"},
{name:"♦",value:2,color:"red"},
{name:"♣",value:1,color:"black"}
];

const ranks=[
{name:"A",value:14},
{name:"K",value:13},
{name:"Q",value:12},
{name:"J",value:11},
{name:"10",value:10},
{name:"9",value:9},
{name:"8",value:8},
{name:"7",value:7},
{name:"6",value:6},
{name:"5",value:5},
{name:"4",value:4},
{name:"3",value:3},
{name:"2",value:2}
];

let deck=[];

function createDeck(){

    deck=[];

    for(let suit of suits){

        for(let rank of ranks){

            deck.push({
                suit:suit.name,
                suitValue:suit.value,
                color:suit.color,
                rank:rank.name,
                value:rank.value
            });

        }

    }

    updateRemain();

}

createDeck();

function updateRemain(){
    document.getElementById("remain").innerHTML="剩餘牌數："+deck.length+" 張";
}

function drawOne(){

    if(deck.length===0){

        alert("牌已抽完，重新洗牌！");
        createDeck();

    }

    let index=Math.floor(Math.random()*deck.length);

    return deck.splice(index,1)[0];

}

function showCard(card,id){

    let div=document.getElementById(id);

    div.className="card";

    if(card.color==="red"){
        div.classList.add("red");
    }

    div.innerHTML=card.suit+"\n"+card.rank;

}

function drawCards(){

    let player=drawOne();

    let computer=drawOne();

    showCard(player,"playerCard");

    showCard(computer,"computerCard");

    let result="";

    if(player.value>computer.value){

        result="🎉 玩家獲勝！";

    }else if(player.value<computer.value){

        result="💻 電腦獲勝！";

    }else{

        if(player.suitValue>computer.suitValue){

            result="🎉 玩家獲勝！（花色較大）";

        }else if(player.suitValue<computer.suitValue){

            result="💻 電腦獲勝！（花色較大）";

        }else{

            result="平手！";

        }

    }

    document.getElementById("result").innerHTML=result;

    updateRemain();

}

</script>

</body>
</html>

