/**
JavaScript Game framework for beginner.

oosamanet@gmail.com


*/
var unitaro={};

unitaro.scaler=function(id){
  var scale = function () {
    var container = document.querySelector('#'+id+'-canvas');
    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetHeight;

    var viewportWidth = document.documentElement.clientWidth;
    var viewportHeight = document.documentElement.clientHeight;

    var scaleWidth = viewportWidth / containerWidth;
    var scaleHeight = viewportHeight / containerHeight;
    var scaleBoth = (scaleHeight < scaleWidth) ? scaleHeight : scaleWidth;

    var newContainerWidth = containerWidth * scaleBoth;
    var newContainerHeight = containerHeight * scaleBoth;

    var left = (viewportWidth - newContainerWidth) / 2;
    left = parseInt(left * (1 / scaleBoth), 10);

    var top = (viewportHeight - newContainerHeight) / 2;
    top = parseInt(top * (1 / scaleBoth), 10);

    // scale the whole container
    var transform = 'scale(' + scaleBoth + ',' + scaleBoth + ') translate(' + left + 'px, ' + top + 'px)';
    container.style['-webkit-transform-origin'] = 'top left 0';
    container.style['-webkit-transform'] = transform;
    container.style['transform-origin'] = 'top left 0';
    container.style['transform'] = transform;
    unitaro.scale=scaleBoth;
    unitaro.offset=[left*scaleBoth,top*scaleBoth];
  };

  window.onresize = scale;
  scale();
};

unitaro.dib={
  init: function(w,h,target){
    this.target=target;
    if (!this.target){
      this.target='unitaro-world';
    }
    var world = document.getElementById(this.target);
    if (!world) {
      world = document.createElement('div');
      world.id = this.target;
      document.body.appendChild(world);
    }
    this.canvas = document.createElement('canvas');
    this.canvas.id=this.target+"-canvas";
    this.canvas.width = w;
    this.canvas.height = h;
    world.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.textAlign = "center";
    this.ctx.font = "12px";
  },
  clear: function(x1,y1,w,h){
    this.ctx.clearRect(x1,y1,w,h);
  },
  box: function(x1,y1,w,h,color){
    if (color!=undefined){
      this.ctx.fillStyle = color;
    }
    this.ctx.fillRect(x1,y1,w,h);
  },
  textout: function(x1,y1,text,color,w){
    if (color!=undefined){
      this.ctx.fillStyle = color;
    }
    this.ctx.fillText(text,x1,y1,w);
  },
  sprites: {},
  drawsprite: function(n,x,y){
    this.ctx.drawImage(this.sprites[n], x, y);
  },
  loadedcounter: 0,
  loadcounter: 0,
  setglobaloperation: function(ope){
    this.ctx.globalCompositeOperation=ope;
  },
  loadimages: function(images,cb){
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
  }
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

unitaro.TaskManager={
  task_list: [],
  type_list: {},
  add_task: function(task){
    this.task_list.push(task);
  },
  add_type: function(type,task){
    if (!this.type_list[type]){
      this.type_list[type]=[];
    }
    this.type_list[type].push(task);
  },
  del_type: function(type,task){
    if (!this.type_list[type]){
      this.type_list[type]=[];
    }
    this.delete_if(task,this.type_list[type]);
  },
  clear: function(){
    this.task_list=[];
    this.type_list={};
  },
  hitcheck_all: function(t1,t2){
    if (! this.type_list[t1] || ! this.type_list[t2]){
       return;
    }
    for (var i in this.type_list[t1]){
      var task1 = this.type_list[t1][i];
      if (!task1.live){
        continue;
      }
      var flag=false;
      var x1_1=task1.x-task1.w/2;
      var x1_2=x1_1+task1.w;
      var y1_1=task1.y-task1.h/2;
      var y1_2=y1_1+task1.h;
      for (var j in this.type_list[t2]){
        var task2 = this.type_list[t2][j];
        if (!task2.live){
          continue;
        }
        var x2_1=task2.x-task2.w/2;
        var x2_2=x2_1+task2.w;
        var y2_1=task2.y-task2.h/2;
        var y2_2=y2_1+task2.h;
        if (x2_2 <= x1_1 || x1_2 <= x2_1 ||
            y2_2 <= y1_1 || y1_2 <= y2_1){
           continue;
        }
        if (typeof task2.onhit == "function"){
          task2.onhit();
        }
        flag=true;
      }
      if (!flag){
        continue;
      }
      if (typeof task1.onhit == "function"){
        task1.onhit();
      }
    }
  },
  delete_if:function(target,array1){
    for (var i in array1){
      if (array1[i]==target){
        array1.splice(i,1);
        return;
      }
    }
  },
  update_all: function(){
    var delete_list=[];
    for (var i in this.task_list){
      var t=this.task_list[i];
      if (t===undefined){
        continue;
      }
      t.age++;
      var age=t.age;
      t.update(age);
      if (!t.live){
        delete_list.push(t);
      }
    }
    for (var i in delete_list){
      this.delete_if(delete_list[i],this.task_list);
      for (var j in this.type_list){
        this.delete_if(delete_list[i],this.type_list[j]);
      }
    }
  },
  is_inside: function(src,x,y,w,h){
    if (w===undefined){
      w=1;
      h=1;
    }
    return (src.x===undefined) || (
      src.x-src.w/2 < x+w/2 &&
      src.x+src.w/2 > x-w/2 &&
      src.y-src.h/2 < y+h/2 &&
      src.y+src.h/2 > y-h/2
    );
  },
  call_all: function(mes){
    for (var i in this.task_list){
      var t=this.task_list[i];
      if ("function" == typeof(t[mes])){
        t[mes].apply(t,Array.prototype.slice.call(arguments,1));
      }
    }

  },
  call_all_with_hitcheck: function(mes,x,y){
    for (var i in this.task_list){
      var t=this.task_list[i];
      if (t===undefined || !this.is_inside(t,x,y)){
        continue;
      }
      if ("function" == typeof(t[mes])){
        t[mes].apply(t,Array.prototype.slice.call(arguments,1));
      }
    }

  },
  draw_all: function(){
    this.call_all('draw');
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

unitaro.Task=function(task){
  this.timer=0;
  this.type='';
  this.age=0;
  this.live=true;
  this.init=function(){};
  this.update=function(){};
  this.draw=function(){
    if (this.w > 0){
      unitaro.dib.box(this.x-this.w/2,this.y-this.h/2,this.w,this.h,this.color);
    }
  };
  for (i in task){
    this[i]=task[i];
  }

  unitaro.TaskManager.add_task(this);
  this.init.apply(this,Array.prototype.slice.call(arguments,1));
};
unitaro.Task.prototype={
  stop: function(){
    this.live=false;
  },
  set_type: function(type){
    this.type=type;
    unitaro.TaskManager.add_type(type,this);
  },
  clear: function(){
    unitaro.TaskManager.clear();
  },
  onhit: function(){
    console.dir("BOMB "+this.type+" "+this.x+","+this.y);
    this.stop();
  }
};

unitaro.App=function(app){
  var self=this;
  self.init = function(){};
  self.update = function(){};
  self.draw = function(){};
  for (i in app){
    self[i]=app[i];
  }
  self.fps = self.fps || 20;

  unitaro.dib.init(self.WIDTH,self.HEIGHT,self.target);

  if (self.assets){
    ResourceManager.load(self.assets);
  }

  var _click = (window.ontouchstart === undefined)? 'mousedown' : 'touchstart';
  window.addEventListener(_click,function(e){
    var x=e.touches ? e.touches[0].pageX : e.pageX;
    var y=e.touches ? e.touches[0].pageY : e.pageY;
    if (unitaro.scaler && unitaro.offset){
      x=x-unitaro.offset[0];
      y=y-unitaro.offset[1];
      x/=unitaro.scale;
      y/=unitaro.scale;
    }
    unitaro.TaskManager.call_all_with_hitcheck("onclick",x,y);
    if (self.onclick){
      self.onclick(x,y);
    }
  });
  var _click = (window.ontouchstart === undefined)? 'mouseup' : 'touchend';
  window.addEventListener(_click,function(e){
    unitaro.TaskManager.call_all_with_hitcheck("onclickend");
    if (self.onclickend){
      self.onclickend();
    }
  });

  var age=0;
  var loop = function(){
    clearTimeout(self.timer);
    self.timer=setTimeout(function(){
      if (age==0){
        self.init();
      }
      if (!self.paused){
        self.update(age);
        unitaro.TaskManager.update_all();
      }

      unitaro.TaskManager.draw_all();

      loop();
      age++;
    },1000/self.fps);
  };
  loop();
  if (!self.target){
    unitaro.scaler(unitaro.dib.target);
  }
};
