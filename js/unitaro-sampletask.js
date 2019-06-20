/**
JavaScript Game framework Application stub

oosamanet@gmail.com


*/
var PTAMA = {
  w: 8,
  h: 8,
  color: 'yellow',
  init: function(x,y){
    this.x=x;
    this.y=y;
  },
  update: function(age){
    this.y-=5;
  }
};

var ETAMA = {
  w: 8,
  h: 8,
  color: 'red',
  init: function(x,y){
    this.x=x;
    this.y=y;
  },
  update: function(age){
    this.y+=4;
  }
};

var DIRTAMA = {
  w: 8,
  h: 8,
  color: 'yellow',
  init: function(x,y,dir,speed){
    this.x=x;
    this.y=y;
    this.dir=dir;
    this.speed=speed;
  },
  update: function(age){
    this.movedir(this.dir,this.speed);
  }
};

var ETAMA_PL = {
  w: 8,
  h: 8,
  color: '#ff8888',
  init: function(x,y,speed){
    this.x=x;
    this.y=y;
    this.dir=this.calcdir(app.player.x,app.player.y);
    this.speed=speed;
  },
  update: function(age){
    this.movedir(this.dir,this.speed);
  }
};

var MISSILE1 = {
  w: 32,
  h: 50,
  color: '#ff8888',
  init: function(x,y,dir,speed){
    this.x=x;
    this.y=y;
    this.dir=dir;
    this.speed=speed;
  },
  update: function(age){
    if (age>20){
      new unitaro.Task(MISSILE2,this.x,this.y,this.dir-20,this.speed);
      new unitaro.Task(MISSILE2,this.x,this.y,this.dir,this.speed);
      new unitaro.Task(MISSILE2,this.x,this.y,this.dir+20,this.speed);
      this.stop();
    }
    this.movedir(this.dir,this.speed);
  }
};
var MISSILE2 = {
  w: 16,
  h: 40,
  color: '#cc4444',
  init: function(x,y,dir,speed){
    this.x=x;
    this.y=y;
    this.dir=dir;
    this.speed=speed+4;
  },
  update: function(age){
    if (age>20){
      new unitaro.Task(DIRTAMA,this.x,this.y,this.dir-20,this.speed+4);
      new unitaro.Task(DIRTAMA,this.x,this.y,this.dir,this.speed+4);
      new unitaro.Task(DIRTAMA,this.x,this.y,this.dir+20,this.speed+4);
      this.stop();
    }
    this.movedir(this.dir,this.speed);
  }
};
