window.onload = function(){

	var cover=document.getElementById('cover');
	var bg=document.getElementById('bg');
	var con=document.getElementById('con');
	var startBtn = document.getElementById('start');
	var gameOverPage = document.getElementById('gameOverPage');
	var gameScore = document.getElementById('gameScore');
	var panelScore = document.getElementById('panelScore');
	var restartBtn = document.getElementById('restartBtn');
	var boss;
	var bbullets=[];
	var hbullets=[];//飞机子弹
	var ebullets=[];//敌机子弹
	var enemies=[];//敌人
	var addB=null;
	var addBb=null;
	var updateBoss=null;
	var eSpeed=5;
	var bSpeed=1;
	var hbSpeed=20;
	var ebSpeed=8;
	var gameState=0;
	var SCORE=0;
	var conw=con.offsetWidth;
	var	conh=con.offsetHeight;


	restartBtn.onclick=function(){
		gameState=1;
		con.innerHTML='';
		enemies=[];
		ebullets=[];
		hbullets=[];
		bbullets=[];
		gameOverPage.style.display='none';
		SCORE=0;
		gameScore.innerHTML = SCORE;
		hero = document.createElement('img');
		hero.src = 'img/hero.png';
		con.appendChild(hero);
		hero.style.display='block';
		hero.style.left = '240px'
		hero.style.top = '600px';
		hero.style.width = '109px';
		hero.style.height  = '82px';
		hero.style.position = 'absolute';
		
		addHb=setInterval(heroBullets,200);
		updateTimer = setInterval(update,30);
		addEnemyTimer = setInterval(myEnemy,200);
		addEb=setInterval(enemyBullets,1000);
	}

	startBtn.onclick = function(){
		cover.style.display = 'none';
		hero.style.display='block';
		gameState= 1;
		bgMove();
	}

	function bgMove(){
		go=setInterval(function(){
			var nowT=parseInt(window.getComputedStyle(bg,null).top);
			if (nowT>=0) {
				clearInterval(go);
				bg.style.top=-768+'px';
				bgMove();
			}else{
			bg.style.top=(nowT+5)+'px';
			}
		},10)
	}


	con.onmousemove=function(ev){
			var ev=window.event||ev;
			var x=ev.clientX;
			var y=ev.clientY;
			if (x>=457) {
				hero.style.left=403+'px';
			}else if (x<=55) {
				hero.style.left=0+'px';
			}else{
				hero.style.left=(x-55)+'px';
			}
			if (y>=727) {
				hero.style.top=686+'px';
			}else if (y<=41) {
				hero.style.top=0+'px';
			}else{
				hero.style.top=(y-41)+'px';
			}
		}


		//添加hero的子弹,200毫秒生成一对
	var addHb=setInterval(heroBullets,200);
	function heroBullets(){
		if(gameState==1){
		var hx=hero.offsetLeft;
		var hy=hero.offsetTop;

		var hbullet1=document.createElement('img');
		hbullet1.src='img/bullet1.png';
		hbullet1.style.position='absolute';
		hbullet1.style.top=hy -10 + 'px';
		hbullet1.style.left=(hx + hero.offsetWidth/2 -20)+'px';
		hbullet1.style.width='20px';
		hbullets.push(hbullet1);
		con.appendChild(hbullet1);

		var hbullet2=document.createElement('img');
		hbullet2.src='img/bullet1.png';
		hbullet2.style.position='absolute';
		hbullet2.style.top=(hy -10)+'px';
		hbullet2.style.left=(hx + hero.offsetWidth/2 +10)+'px';
		hbullet2.style.width='20px';
		hbullets.push(hbullet2);
		con.appendChild(hbullet2);
		}
	}

	//添加敌机子弹,隔一秒添加一个
	var addEb=setInterval(enemyBullets,1000);
	function enemyBullets(){
		for (var i = 0; i < enemies.length; i++) {
			var e=enemies[i];
			var ex=e.offsetLeft;
			var ey=e.offsetTop;

			var eb=document.createElement('img');
			eb.src='img/bullet2.png';
			eb.style.position='absolute';
			eb.style.left=ex+35+'px';
			eb.style.top=ey+40+'px';
			eb.style.width='30px';

			ebullets.push(eb);
			con.appendChild(eb);
		}
	}

	var updateTimer=setInterval(update,30);
	function update(){
		if (gameState==1) {
			flag=true;
			for (var p = 0; p < hbullets.length; p++) {
				var hb=hbullets[p];
				hb.style.top=hb.offsetTop-hbSpeed+'px';
				if (hb.offsetTop<0) {
					con.removeChild(hb);
					hbullets.splice(p,1);
				}
			//每隔30毫秒所有hero的子弹向移动20px;
			
			for (var j = 0; j < enemies.length; j++) {
				var em=enemies[j];
				var result=collision(hb,em);
				if (result) {
					em.src='img/bomb.png';
					(function(node){
						setTimeout(function(){
							con.removeChild(node);
						},200);
					})(em);//如果敌机和hero的子弹碰撞，就把敌机换成子弹的图片，
						//200毫秒后，移除这个bomb
					con.removeChild(hb);//移除hero的子弹;
					hbullets.splice(p,1);
					enemies.splice(j,1);
					SCORE++;
					gameScore.innerHTML=SCORE;
					if (SCORE==20) {
						clearInterval(addEb);
						clearInterval(addHb);
						clearInterval(addEnemyTimer);
						addB=setTimeout(addBoss,3000);
					}
				}
			}
		}
		for (var m = 0; m < enemies.length; m++) {
			var en=enemies[m];
			en.style.top=en.offsetTop+eSpeed+'px';
			if (en.offsetTop>768-80) {
				con.removeChild(en);
				enemies.splice(m,1);
			}

			var result = collision(en,hero);
			if(result){
				enemies.splice(m,1);
				con.removeChild(en);
				con.removeChild(hero);
				gameOver();
			}
		}

		for (var q = 0; q < ebullets.length; q++) {
			var ebt=ebullets[q];
			ebt.style.top=ebt.offsetTop+ebSpeed+'px';
			if (ebt.offsetTop>768) {
				ebullets.splice(q,1);
				con.removeChild(ebt);
			}
			var result=collision(ebt,hero);
			if (result) {
				ebullets.splice(q,1);
				con.removeChild(ebt);
				con.removeChild(hero);
				gameOver();
			}
		}
	}
	}

	//添加敌机
	var addEnemyTimer=setInterval(myEnemy,200);
	function myEnemy(){
		if (gameState==1) {
			var enemy =document.createElement('img');
			var index=Math.floor(Math.random()*3+1);
			enemy.src='img/enemy'+index+'.png';
			enemy.style.position='absolute';
			enemy.style.width='100px';

			var x=Math.random()*(conw-100);
			enemy.style.left=x+'px';
			enemy.style.top='0px';
			con.appendChild(enemy);
			enemies.push(enemy);
		}
	}

	function collision(a,b){
		var ax=a.offsetLeft;
		var ay=a.offsetTop;
		var aw=a.offsetWidth;
		var ah=a.offsetHeight;

		var bx=b.offsetLeft;
		var by=b.offsetTop;
		var bw=b.offsetWidth;
		var bh=b.offsetHeight;
		if(bx+bw>ax && bx<ax+aw && by+bh>ay && by<ay+ah){
			return true;
		}else{
			return false;
		}	
	}

	function addBoss(){
		if (gameState==1) {
			boss =document.createElement('img');
			boss.src='img/enemy1.png';
			boss.style.position='absolute';
			boss.style.width='300px';
			boss.style.left='106px';
			boss.style.top='-200px';
			con.appendChild(boss);
			addHb=setInterval(heroBullets,200);
			addBb=setInterval(bossBullets,1500);
			updateBoss=setInterval(updateB,30);
		}
	}

	function updateB(){
		if (gameState==1) {
			for (var p = 0; p < hbullets.length; p++) {
			var hb=hbullets[p];
			var result=collision(hb,boss);
			if (result) {
				hb.src='img/bomb.png';
				hb.style.width='60px';
				console.log(hb.style.width);
					(function(node){ 
						setTimeout(function(){
							con.removeChild(node);
						},200);
					})(hb);
				hbullets.splice(p,1);
				SCORE++;
				gameScore.innerHTML=SCORE;
				if (SCORE==50) {
					boss.src='img/bomb.png';
					setTimeout(removeB,500);
					clearInterval(addBb);
					clearInterval(addHb);
					setTimeout(gameOver,2000);
				}
			}
		}
		function removeB(){
			con.removeChild(boss);
		}
		boss.style.top=boss.offsetTop+bSpeed+'px';
			if (boss.offsetTop>768-80) {
				con.removeChild(boss);
			}
			var result = collision(boss,hero);
			if(result){
				con.removeChild(boss);
				con.removeChild(hero);
				gameOver();
			}
		

		for (var q = 0; q < bbullets.length; q++) {
			var bbt=bbullets[q];
			bbt.style.top=bbt.offsetTop+ebSpeed+'px';
			if (bbt.offsetTop>768) {
				bbullets.splice(q,1);
				con.removeChild(bbt);
			}
			var result=collision(bbt,hero);
			if (result) {
				bbullets.splice(q,1);
				con.removeChild(bbt);
				con.removeChild(hero);
				gameOver();
			}
		}
	}
	}

	function bossBullets(){
		if(gameState==1){
		var bsx=boss.offsetLeft;
		var bsy=boss.offsetTop;
		
		var bbullet1=document.createElement('img');
		bbullet1.src='img/bullet2.png';
		bbullet1.style.position='absolute';
		bbullet1.style.top=bsy +200 + 'px';
		bbullet1.style.left=(bsx + boss.offsetWidth/2 -90)+'px';
		bbullet1.style.width='40px';
		bbullets.push(bbullet1);
		con.appendChild(bbullet1);

		var bbullet2=document.createElement('img');
		bbullet2.src='img/bullet2.png';
		bbullet2.style.position='absolute';
		bbullet2.style.top=bsy +200 + 'px';
		bbullet2.style.left=(bsx + boss.offsetWidth/2+50)+'px';
		bbullet2.style.width='40px';
		bbullets.push(bbullet2);
		con.appendChild(bbullet2);
	}
	}

	function gameOver(){
		gameOverPage.style.display='block';
		clearInterval(addEnemyTimer);//清除增加敌机的定时器
		clearInterval(updateTimer);//清除子弹移动定时器
		clearInterval(addHb);//清除增加我飞机子弹的定时器
		clearInterval(addEb);
		if (addB!=null) {
			clearTimeout(addB);
		}
		if (addBb!=null) {
			clearInterval(addBb);
		}if (updateBoss!=null) {
			clearInterval(updateBoss);
		}
		
		if (localStorage['BetScore']) {
			if (SCORE>localStorage['BetScore']) {
				localStorage['BetScore']=SCORE;
			}
		}else{
			localStorage['BetScore']=SCORE;
		}
		panelScore.innerHTML='最高分：'+localStorage['BetScore']+'<br>'+'分数：'+SCORE;
		gameState=0;
	}

};
       










