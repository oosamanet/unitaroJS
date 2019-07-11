/**
unitaro.js audio & picture resource plugin

oosamanet@gmail.com


*/
unitaro.dib.sprites={};
unitaro.dib.drawsprite: function(n,x,y){
    this.ctx.drawImage(this.sprites[n], x, y);
};
unitaro.dib.loadedcounter=0;
unitaro.dib.loadcounter=0;
unitaro.dib.loadimages=function(images,cb){
  var self=this;
  var row=Object.keys(images);
  var name = row[self.loadcounter++];
  var imgObj = new Image();
  imgObj.addEventListener('load',function(){
    self.loadedcounter++;
    self.sprites[name]=imgObj;
    if(row.length == self.loadedcounter){
      if ("function" == typeof cb){
        cb();
      }
    }else{
      self.loadimages(images,cb);
    }
  },false);
  imgObj.src = images[name];
};

unitaro.ResourceManager={
  res_list: {},
  load:function(list){
    var self=this;
    var images={};
    for (var i in list){
      if (list[i].match(/.mp3/)){
        (function(i){
          unitaro.sound.load(list[i],function(buf){ self.res_list[i]=buf;});
        })(i);
      }else{
        images[i]=list[i];
      }
    }
    unitaro.dib.loadimages(images);
  },
};

unitaro.sound={
  driver:undefined,
  init:function(){
    if (window.AudioContext || window.webkitAudioContext){
      this.driver=this.WebAudioDriver;
    }else{
      this.driver=this.AudioDriver;
    }
    this.driver.init();
  },
  load:function(url,cb){
    if (!this.driver){
      this.init();
    }
    this.driver.load(url,cb);
  },
  play:function(name,isloop){
    if (!this.driver){
      this.init();
    }
    this.driver.play(unitaro.ResourceManager.res_list[name],isloop);
  },
  AudioDriver:{
    init:function(){
      this.audio=new Audio("");
    },
    load:function(url,cb){
      this.audio.src=url;
      cb({duration:10});
    },
    play:function(buffer,isloop) {
      this.audio.loop=isloop;
      this.audio.play();
    },
  },
  WebAudioDriver:{
    init:function(){
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      if (window.AudioContext){
        this.context = new AudioContext();
      }
    },
    load:function(url,cb){
      var self=this;
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.setRequestHeader('Range', 'bytes=0-');
      request.responseType = 'arraybuffer';

      request.onload = function() {
        self.context.decodeAudioData(request.response, function(buffer) {
          cb(buffer);
        }, function () {
          console.debug('error');
        });
      };

      request.send();
    },
    play:function(buffer,isloop) {
      var source = this.context.createBufferSource();
      source.buffer = buffer;
      source.loop=isloop;
      source.connect(this.context.destination);
      source.start(0);
      return source;
    }
  }
};

