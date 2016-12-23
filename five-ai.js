var canvas=document.getElementById("c1") ;
var ctx=canvas.getContext("2d");
ctx.strokeRect(0,0,450,450);
/*1、棋盘画法*/
var N=30;
var drawBox=function(){
	for (var i=0;i<15 ;i++){
		ctx.beginPath();
		ctx.moveTo(15+i*N,15);
		ctx.lineTo(15+i*N,435);
		ctx.stroke();
		ctx.moveTo(15,15+i*N);
		ctx.lineTo(435,15+i*N);
		ctx.closePath();
		ctx.stroke();
	}
}
	var chessBox=[];
	for (var i=0;i<15;i++){
		chessBox[i]=[];
		for (var j=0;j<15;j++){
			chessBox[i][j]=0;
		}
	}
 var oneStep=function(i,j,pc){
	ctx.beginPath();
	ctx.arc(15+i*N,15+j*N,13,0,Math.PI*2,true);
		var gradient=ctx.createRadialGradient(15+i*N,15+j*N,0,15+i*N,15+j*N,5);
		if (!pc){
			gradient.addColorStop(0,"#aaa");
			gradient.addColorStop(1,"#f9f9f9");
			chessBox[i][j]=1;
		}else{
			gradient.addColorStop(0,"#aaa");
			gradient.addColorStop(1,"#0a0a0a");
			chessBox[i][j]=2;
		}
		ctx.closePath();
		ctx.fillStyle=gradient;
		ctx.fill();
 }
/*2、赢法统计*/
var wins=[];
var count=0;
for (var i=0;i<15 ;i++ ){
	wins[i]=[]; for (var j=0;j<15 ;j++ ){
		wins[i][j]=[];
	}
}
 /*横线赢法*/
for (var i=0;i<15 ;i++ ){
	for (var j=0;j<11 ;j++ ){
		for (var k=0;k<5 ;k++ ){
			wins[i][j+k][count]=true;
		} count++;
	}
}
/*竖线赢法*/
for (var i=0;i<11 ;i++ ){
	for (var j=0;j<15 ;j++ ){
		for (var k=0;k<5 ;k++ ){
			wins[i+k][j][count]=true;
		} count++;
	}
}
/*斜线赢法*/
for (var i=0;i<11 ;i++ ){
	for (var j=0;j<11 ;j++ ){
		for (var k=0;k<5 ;k++ ){
			wins[i+k][j+k][count]=true;
		} count++;
	}
}
/*反斜线赢法*/
for (var i=0;i<11 ;i++ ){
	for (var j=14;j>3 ;j-- ){
		for (var k=0;k<5 ;k++ ){
			wins[i+k][j-k][count]=true;
		} count++;
	}
}
//console.log(count);//572
// /*3、赢法计算*/
  var myWin=[];
	var pcWin=[];
  for(var i=0;i<count;i++){
		myWin[i]=0;
		pcWin[i]=0;
 	}
/******执行顺序******/
drawBox();
var over=false;
var pc;
	canvas.onclick=function(e){
		if (over){return;}
		if(!pc){
			var x=e.offsetX;
			var y=e.offsetY;
			var i=Math.floor(x/30);
			var j=Math.floor(y/30);
			if (chessBox[i][j]==0){
				oneStep(i,j,pc);
				if(chessBox[i][j]==1){
					for (var k=0;k<count;k++ ){
						if (wins[i][j][k]){
							myWin[k]++; pcWin[k] =6;
							if (myWin[k]==5){
								alert("恭喜你,你赢了！");
								over = true;
							}
						}
					}
				}
			}
		}
		//console.log("u+v+me:"+i+"-"+j+"-"+pc);
		if(!over){
			pc=!pc;
			pcAuto();
		}
	}
	var pcAuto=function() {
		if (over) { return }
		var myScore = [];
		var pcScore = [];
		var max = 0;/////////
		var u = 0, v = 0;
		for (var i = 0; i < 15; i++) {
			myScore[i] = [];
			pcScore[i] = [];
			for (var j = 0; j < 15; j++) {
				myScore[i][j] = 0;
				pcScore[i][j] = 0;
			}
		}
		for (var i = 0; i < 15; i++) {
			for (var j = 0; j < 15; j++) {
				if (chessBox[i][j] == 0) {
					for (var k = 0; k < count; k++) {
						if (wins[i][j][k]) {
							switch (myWin[k]) {
								case  1:
									myScore[i][j] += 100;
									break;
								case  2:
									myScore[i][j] += 200;
									break;
								case  3:
									myScore[i][j] += 500;
									break;
								case  4:
									myScore[i][j] += 1000;
									break;
							}
							switch (pcWin[k]) {
								case  1:
									pcScore[i][j] += 110;
									break;
								case  2:
									pcScore[i][j] += 220;
									break;
								case  3:
									pcScore[i][j] += 550;
									break;
								case  4:
									pcScore[i][j] += 2000;
									break;
							}
						}
					}
					//if(myScore[i][j]!=0){ console.log("u+v+pc:"+i+"-"+j+"-"+pc); console.log(myScore[i][j]); } if (pcScore[i][j]!=0){ console.log("u+v+pc:"+i+"-"+j+"-"+pc); console.log(pcScore[i][j]); }
					if (myScore[i][j] > max) {
						max = myScore[i][j]; u = i; v = j;
					} else if (myScore[i][j] == max) {
						if (pcScore[i][j] > pcScore[u][v]) {
							u = i; v = j;
						}
					}
					if (pcScore[i][j] > max) {
						max = pcScore[i][j]; u = i; v = j;
					} else if (pcScore[i][j] == max) {
						if (myScore[i][j] > myScore[u][v]) {
							u = i; v = j;
						}
					}
				}
			}
		}
		//console.log("u+v+pc:"+u+"-"+v+"-"+pc);
		oneStep(u, v, pc);
		if (chessBox[u][v] == 2) {
			for (var k= 0; k < count; k++) {
				if (wins[u][v][k]) {
					pcWin[k]++; myWin[k] = 6;
					if (pcWin[k] == 5) {
						alert("计算机赢了！"); over = true;
					}
				}
			}
		}
		pc=!pc;
	}
