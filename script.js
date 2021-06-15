var sX=1;
var sY=1;
var board=new Array(12);
var situation=1;
var step=0;
var score=-1;
var speed=1;
var disabled=0;
var environment=0;

onload = function(){ init(); };

function init(){
	reset();
	var canvas = document.getElementById('peanutsBoard');
	canvas.onmousedown=function(e){
		click(e);
		e.preventDefault();
		return false;
	}
	canvas.ontouchstart=function(){
		click(event.touches[0]);
		event.preventDefault();
		return false;
	}
	
	if(navigator.userAgent.indexOf('iPhone')>=0||
		navigator.userAgent.indexOf('iPad')>=0||
		navigator.userAgent.indexOf('iPod')>=0||
		navigator.userAgent.indexOf('Android')>=0) environment=1;
	else environment=0;
	draw();
}

function reset(){
	var i;
	for(i=0;i<12;i++) board[i]=0;
	step=0;
	score=0;
	speed=1;
	sX=1;
	sY=1;
	disabled=0;
}

function click(e){
	var canvas = document.getElementById('peanutsBoard');
	var rect = e.target.getBoundingClientRect();
	var pX,pY;
	
	if(disabled>0) return;
	
	if(e.offsetX!=null){
		pX=Math.floor((e.offsetX)/120);
		pY=Math.floor((e.offsetY+step*3/2)/120);
	}else if(e.pageX!=null){
		pX=Math.floor((e.pageX-rect.left-window.pageXOffset)/120);
		pY=Math.floor((e.pageY-rect.top-window.pageYOffset+step*3/2)/120);
	}else{
		pX=Math.floor((e.clientX-rect.left-document.body.scrollLeft)/120);
		pY=Math.floor((e.clientY-rect.top-document.body.scrollTop+step*3/2)/120);
	}
	
	var d;
	var i;
	if(situation==3){
		reset();
		situation=1;
		draw();
	}else if(situation==1){
		sX=1;
		sY=1;
		situation=2;
		score=0;
		speed=1;
		idle();
	}else if(situation==2){
		if(sX==pX){
			if(pY>sY){
				d=pY-sY;
				for(i=0;i<d;i++) moveUpper();
			}else if(pY<sY){
				d=sY-pY;
				for(i=0;i<d;i++) moveLower();
			}
		}else if(sY==pY){
			if(pX>sX){
				d=pX-sX;
				for(i=0;i<d;i++) moveLeft();
			}else if(pX<sX){
				d=sX-pX;
				for(i=0;i<d;i++) moveRight();
			}
		}
	}
}

function moveLeft(){
	if(sX>=2) return;
	board[sX+sY*3]=board[sX+sY*3+1];
	board[sX+sY*3+1]=0;
	sX++;
}

function moveRight(){
	if(sX<=0) return;
	board[sX+sY*3]=board[sX+sY*3-1];
	board[sX+sY*3-1]=0;
	sX--;
}

function moveUpper(){
	if(sY>=3) return;
	board[sX+sY*3]=board[sX+sY*3+3];
	board[sX+sY*3+3]=0;
	sY++;
}

function moveLower(){
	if(sY<=0) return;
	board[sX+sY*3]=board[sX+sY*3-3];
	board[sX+sY*3-3]=0;
	sY--;
}

function idle(){
	step+=speed;
	checkPeanuts();
	draw();
	if(step>=80) shift();
	if(situation==2) setTimeout(idle,100);
}

function enable(){
	disabled=0;
}

function shift(){
	var x;
	var y;
	var panel=new Array(0,0,0,0);
	if(sY<=0){
		situation=3;
		disabled=1;
		setTimeout(enable,1000);
		draw();
		return;
	}
	if(board[0]>0||board[1]>0||board[2]>0){
		situation=3;
		disabled=1;
		setTimeout(enable,1000);
		draw();
		return;
	}
	sY--;
	
	for(y=1;y<4;y++){
		for(x=0;x<3;x++){
			if(board[x+y*3]>0&&board[x+y*3]<=3){
				panel[board[x+y*3]]++;
			}
			board[x+y*3-3]=board[x+y*3];
		}
	}
	board[9]=Math.floor(Math.random()*4);
	if(panel[board[9]]>=2||board[9]==board[6]) board[9]=0;
	if(board[9]>0&&board[9]<=3) panel[board[9]]++;

	board[10]=Math.floor(Math.random()*4);
	if(panel[board[10]]>=2||board[10]==board[7]||board[10]==board[9]) board[10]=0;
	if(board[10]>0&&board[10]<=3) panel[board[10]]++;

	board[11]=Math.floor(Math.random()*4);
	if(panel[board[11]]>=2||board[11]==board[8]||board[11]==board[10]) board[11]=0;
	if(board[11]>0&&board[11]<=3) panel[board[11]]++;

	step=0;
}

function checkPeanuts(){
	var x;
	var y;
	for(y=0;y<4;y++){
		for(x=0;x<3;x++){
			if(board[x+y*3]<0) board[x+y*3]=0;
		}
	}
	for(y=0;y<4;y++){
		for(x=0;x<3;x++){
			if(board[x+y*3]==0) continue;
			if(x<2&&board[x+y*3]==board[x+y*3+1]){
				board[x+y*3]=-1;
				board[x+y*3+1]=-1;
				score++;
				speed=Math.floor(score/10)+1;	
			}
			if(y<3&&board[x+y*3]==board[x+y*3+3]){
				board[x+y*3]=-1;
				board[x+y*3+3]=-1;
				score++;
				speed=Math.floor(score/10)+1;	
			}
		}
	}
}

function draw(){
	var canvas = document.getElementById('peanutsBoard');
	var x,y;
	if(!canvas||!canvas.getContext){
		return false;
	}
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0,0,360,360);
	for(y=0;y<4;y++){
		for(x=0;x<3;x++){
			if(x==sX&&y==sY) continue;
			ctx.beginPath();
			ctx.fillStyle = "rgb(255,255,255)";
			if(board[x+y*3]==-1) ctx.fillStyle = "rgb(216,216,216)";
			if(board[x+y*3]==0) ctx.fillStyle = "rgb(192,192,192)";
			if(board[x+y*3]==1) ctx.fillStyle = "rgb(255,0,0)";
			if(board[x+y*3]==2) ctx.fillStyle = "rgb(0,255,0)";
			if(board[x+y*3]==3) ctx.fillStyle = "rgb(0,0,255)";
			ctx.fillRect(1+120*x,1+120*y-step*3/2,118,118);
		}
	}
	if(situation==1){
		ctx.font="48px sans-serif";
		ctx.strokeStyle="white";
		ctx.lineWidth=3.0;
		ctx.textAlign="center";
		ctx.strokeText("Peanuts Lite",180,200);
		ctx.fillStyle="#303030";
		ctx.textAlign="center";
		ctx.fillText("Peanuts Lite",180,200);
		
		ctx.font="36px sans-serif";
		ctx.strokeStyle="white";
		ctx.textAlign="center";
		if(environment>0)	ctx.strokeText("Tap to start",180,300);
		else				ctx.strokeText("Click to start",180,300);
		ctx.fillStyle="#606060";
		ctx.textAlign="center";
		if(environment>0)	ctx.fillText("Tap to start",180,300);
		else				ctx.fillText("Click to start",180,300);
	}else if(situation==3){
		ctx.font="48px sans-serif";
		ctx.fillStyle="white";
		ctx.textAlign="center";
		ctx.strokeText("Game Over",180,200);
		ctx.fillStyle="#303030";
		ctx.textAlign="center";
		ctx.fillText("Game Over",180,200);
		
		ctx.font="36px sans-serif";
		ctx.strokeStyle="white";
		ctx.textAlign="center";
		ctx.strokeText("Score: "+score,180,300);
		ctx.fillStyle="#606060";
		ctx.textAlign="center";
		ctx.fillText("Score: "+score,180,300);
	}
}

