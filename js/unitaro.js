/**
JavaScript Game framework for beginner.

oosamanet@gmail.com


*/
var unitaro={};
unitaro.offset=[0,0];
unitaro.scale=1.0;

unitaro.scaler=function(id){
  var scale = function () {
    var c = document.querySelector('#'+id+'-canvas');
    var cw = c.width;
    var ch = c.height;

    var vw = window.innerWidth;
    var vh = window.innerHeight;

    var scaleWidth = vw / cw;
    var scaleHeight = vh / ch;
    var aspect = ch / cw;

    s=c.style;
    s.position = 'absolute';
    s.left = '0px';
    s.right = '0px';
    s.top = '0px';
    s.bottom = '0px';
    s.margin = 'auto';
    var dw,dh;
    if (scaleHeight > scaleWidth){
      dw = Math.floor(vw);
      dh = Math.floor(vw*aspect);
      unitaro.offset=[0,(vh-dh)/2];
      unitaro.scale = ch / dh;
    }else{
      dw = Math.floor(vh/aspect);
      dh = Math.floor(vh);
      var scale = cw / dw;
      unitaro.offset=[(vw-dw)/2,0];
      unitaro.scale = cw / dw;
    }
    var rect=c.getBoundingClientRect();
    console.info(rect);
console.info(cw+":"+ch+" "+vw+":"+vh+" -> "+dw+":"+dh);
    s.width = dw + "px";
    s.height = dh + "px";
    unitaro.dw = dw;
    unitaro.dh = dh;
    unitaro.cw = cw;
    unitaro.ch = ch;
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
    this.setFont("14px bold");
  },
  setFont: function(font){
    this.ctx.font = font;
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
  setglobaloperation: function(ope){
    this.ctx.globalCompositeOperation=ope;
  }
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
          task2.onhit(task1.x,task1.y,task1.type,task1);
        }
        flag=true;
      }
      if (!flag){
        continue;
      }
      if (typeof task1.onhit == "function"){
        task1.onhit(task2.x,task2.y,task2.type,task2);
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
      try{
        t.update(age);
      }catch(e){
      }
      if (app.check_outside && !t.is_inside()){
        t.stop();
      }
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
        try{
          t[mes].apply(t,Array.prototype.slice.call(arguments,1));
        }catch(e){
        }
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

unitaro.Task=function(task){
  this.timer=0;
  this.type='';
  this.age=0;
  this.is_inside=function(){
    return !(this.x<-this.w || this.x>APP.WIDTH+this.w || this.y<-this.h || this.y>APP.HEIGHT+this.h);
  };

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
  if (this.type !== undefined){
    this.set_type(this.type);
  }
  try{
    this.init.apply(this,Array.prototype.slice.call(arguments,1));
  }catch(e){
  }
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
  movedir: function(dir,speed){
    var rad=Math.PI*dir/180.0;
    this.x += speed * Math.cos(rad);
    this.y += speed * Math.sin(rad);
  },
  hsv2rgb:function(h,s,v){
    var r=v,g=v,b=v;
    if (s>0){
      h*=6;
      var i=~~h;
      var f = h-i;
      if (i==0){
        g *= 1 - s * (1 - f);
        b *= 1 - s;
      }else if (i==1){
        r *= 1 - s * f;
        b *= 1 - s;
      }else if (i==2){
        r *= 1 - s;
        b *= 1 - s * (1 - f);
      }else if (i==3){
        r *= 1 - s;
        g *= 1 - s * f;
      }else if (i==4){
        r *= 1 - s * (1 - f);
        g *= 1 - s;
      }else if (i==5){
        g *= 1 - s;
        b *= 1 - s * f;
      }
    }
    r=~~(r*255);
    g=~~(g*255);
    b=~~(b*255);
    return "rgb("+r+","+g+","+b+")";
  },
  calcdir: function(tx,ty){
    var rad=Math.atan2(ty-this.y,tx-this.x);
    if (rad===NaN){
      return 0;
    }
    return 180.0*rad/Math.PI;
  },
  onhit: function(x,y){
    this.stop();
  }
};

unitaro.App=function(app){
  var self=this;
  self.check_outside=false;
  self.init = function(){};
  self.update = function(){};
  self.draw = function(){};
  for (i in app){
    self[i]=app[i];
  }
  self.fps = self.fps || 20;

  unitaro.dib.init(self.WIDTH,self.HEIGHT,self.target);

  if (self.res && unitaro.ResourceManager){
    unitaro.ResourceManager.load(self.res);
    window.Sound = unitaro.sound;
  }

  var _click = (window.ontouchstart === undefined)? 'mousedown' : 'touchstart';
  window.addEventListener(_click,function(e){
    var x=e.touches ? e.touches[0].pageX-unitaro.offset[0] : e.offsetX;
    var y=e.touches ? e.touches[0].pageY-unitaro.offset[1] : e.offsetY;
    if (unitaro.scaler){
      console.info(e);
      x = x * unitaro.scale;
      y = y * unitaro.scale;
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
  self.hitcheck_all=function(t1,t2){
    unitaro.TaskManager.hitcheck_all(t1,t2);
  };

  setTimeout(function(){
    self.init();
    var age=0;
    var loop = function(){
      clearTimeout(self.timer);
      self.timer=setTimeout(function(){
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
  },0);
};

//make this object to global
window.Task=unitaro.Task;

unitaro.Scene=function(scene){
  unitaro.TaskManager.clear();
  unitaro.Task.apply(this,arguments);
};
Object.setPrototypeOf(unitaro.Scene.prototype,unitaro.Task.prototype);
window.App=unitaro.App;
window.Scene=unitaro.Scene;
window.Canvas=unitaro.dib;
window.TaskManager=unitaro.TaskManager;
