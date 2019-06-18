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
    this.y-=4;
    if (this.y<0){
      this.stop();
    }
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
    if (this.y<0){
      this.stop();
    }
  }
};

var ETAMA_PL = {
  w: 8,
  h: 8,
  color: '#ff8888',
  init: function(x,y){
    this.x=x;
    this.y=y;
    this.dir=this.calcdir(app.player.x,app.player.y);
  },
  update: function(age){
    this.dirmove(this.dir,8);
    this.y+=4;
    if (this.x<0 || this.x>APP.WIDTH || this.y<0 || this.y>APP.HEIGHT){
      this.stop();
    }
  }
};

