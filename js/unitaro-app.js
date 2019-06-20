/**
JavaScript Game framework Application stub

oosamanet@gmail.com


*/
var APP = {
  WIDTH: 320,
  HEIGHT: 500,
  init: function(){
  },
  onupdate: function(age){
  },
  update: function(age){
    unitaro.dib.box(0,0,this.WIDTH,this.HEIGHT,"rgb(40,40,40)");
    unitaro.dib.box(10,10,this.WIDTH-20,this.HEIGHT-20,"rgb(0,0,0)");
    unitaro.dib.textout(50,20,"unitaroJS sample","yellow",100);
    this.onupdate(age);
  },
  onclick: function(x,y){
  }
};

window.addEventListener('load',function(){
	window.app = new unitaro.App(APP);
},false);

