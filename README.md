# unitaroJS
JavaScript Game framework for beginner.

You can draw box, move it, handle mouse clicks or ...
let's create simple game with this library.

# Reference.
## onload
> unitarojs needs to call App function at first.
```
window.addEventListener('load',function(){
	window.app = new unitaro.App(APP);
},false);
```

## APP
> unitarojs use APP object.

key| info
----| -------------------
WIDTH| application width 
HEIGHT| application height
init| initialize function
update| run 20 times per seconds
draw| draw function
onclick| mouse or touch click handler

```javascript
var APP = {
  WIDTH: 320, // <- 
  HEIGHT: 500,
  init: function(){
  },
  update: function(age){
    unitaro.dib.box(0,0,this.WIDTH,this.HEIGHT,"rgb(40,40,40)");
    unitaro.dib.textout(50,20,"minimum sample","yellow",100);
  },
  onclick: function(x,y){
  }
};
```

## Task object
> unitarojs use Task object.

key| info
----| -------------------
x| x position
y| y position
w| task width
h| task height
init| initialize function
update| run 20 times per seconds
draw| draw function(optional)
onclick| mouse or touch click handler

```javascript
var PLAYER = {
  w:20,
  h:20,
  init: function(x,y){
    this.x=x;
    this.y=y;
  },
  update: function(age){
    this.x+=1;
  },
  onclick: function(x,y){
  }
};
```

## create Task
```javascript
  new unitaro.Task(PLAYER,10,10);
```
