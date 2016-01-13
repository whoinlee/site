//---------------------------//
//-- home canvas animation --//
//---------------------------//
var noMove = false;	//true:noMove, false:move
var canvas;
var stage;
var container;
var captureContainers;
var captureIndex;
var bkg;
var grid;
var w;
var h;
var directions = ["+x", "+y", "-x", "-y"];
var cellW = 22;
var cellH = 22;
var row = 24;
var col = 24;
var speed = 61;	//22, 11
var bkgCells = [];
var bkgContainer;
var bkgCellLength;
var isHomeRunning = false;
//var counter = 0;
function homeInit() {
    isHomeRunning = true;
    canvas = document.getElementById("homeCanvas");
    stage = new Stage(canvas);	//-- stage.snapToPixel = true;
    container = new Container();
    stage.addChild(container);	//-- container at 0
    captureContainers = [];
    captureIndex = 0;
    w = canvas.width - 1;
    h = canvas.height - 1;

    bkg = new Image();
    bkg.src = "assets/image/newYork.jpg";
    bkg.onload = handleImageLoad;
}

function homeStop() {
    if (isHomeRunning) {
        Ticker.removeListener(window);
        isHomeRunning = false;
        alert("homeStop");
    }
}

function homePlay() {
    if (!isHomeRunning) {
        //alert("homePlay");
        isHomeRunning = true;
        Ticker.addListener(window);
    }
}

function handleImageLoad(event) {
    alert("handleImageLoad");
    bkgContainer = new Container();
    container.addChildAt(bkgContainer, 0);


    //-- create spritesheet and assign the associated data.
    var spriteSheet  = new SpriteSheet({
        images: [bkg],
        frames: {width:22, height:22}
    });
    var bkgCell = new BitmapAnimation(spriteSheet);

    //-- create bkgCells
    for (var r=0; r<row; r++) {
        for (var c=0; c<col; c++) {
            var index = r*col + c;
            if (Math.random()*10<6) {
                //bkgCell.gotoAndStop(index);
                bkgCell.gotoAndPlay(index);
            } else {
                //bkgCell.gotoAndStop(r*col + Math.floor(Math.random()*c));
                bkgCell.gotoAndPlay(r*col + Math.floor(Math.random()*c));	//random column in the same row
            }
            bkgCell.index = index;
            bkgCell.row = r;
            bkgCell.col = c;
            bkgCell.orgX = c*cellW;
            bkgCell.orgY = r*cellH;
            bkgCell.x = bkgCell.orgX;
            bkgCell.y = bkgCell.orgY;
            //bkgCell.visible = false;	//test 01/23/13
            //bkgCell.x = Math.floor(Math.random()*w/cellW)*cellW + bkgCell.orgX;
            //bkgCell.alpha = (Math.random() < .7)? 0: Math.random();
            //bkgCell.visible = (Math.random() < .7)? false: true;
            bkgContainer.addChild(bkgCell);
            bkgCells.push(bkgCell);
            if (c != (col-1) || r != (row-1)) {
                bkgCell = bkgCell.clone();
            }
        }//for c
    }//for r
    bkgCellLength = index + 1;

    //-- create a large number of slightly complex vector shapes, and give them random positions and velocities:
    for (var i=0; i<row; i++) {
        var arrow = new Shape();
        var dirIndex = Math.floor(Math.random()*4);
        //var isThick = ((Math.random()*4)<1)? true : false;	//change to isThick!!
        var isThick = ((Math.random()*4)<1)? false : true;
        arrow.x = Math.floor(Math.random()*col)*cellW;
        arrow.y = i*cellH;
        arrow.row = i;
        arrow.orgY = arrow.y;
        arrow.isThick = isThick;
        arrow.dirIndex = dirIndex;
        var ag = arrow.graphics;
        //var alpha = (isThick)? Math.random() : Math.random()*.3 + .8;
        var alpha = (Math.random()*10<7)? Math.random() : Math.random()*.5 + .8;
        /*var random = Math.random()*10;
         if (random < 2) {
         alpha = 0;
         } else if (random <7) {
         alpha = Math.random();
         } else {
         alpha = Math.random()*.4 + .7;
         }*/
        ag.beginFill(Graphics.getRGB(255,255,0,alpha));		//255,255,0 (yellow square)
        ag.rect(0,0,22,22);
        ag.endFill();
        if (isThick) {
            ag.setStrokeStyle(2);
        } else {
            ag.setStrokeStyle(1);
        }
        arrow.graphics.beginStroke(Graphics.getRGB(0,0,0));	//black
        //arrow.visible = false;							//test
        switch (dirIndex) {
            case 1:	//-- down
                if (isThick) {
                    ag.moveTo(11, 3).lineTo(11, 18).lineTo(7, 14).moveTo(10.5, 19).lineTo(15, 14);
                } else {
                    ag.moveTo(11, 3).lineTo(11, 20).lineTo(7, 14).moveTo(11, 19.5).lineTo(15, 14);
                    arrow.x += .5;
                }
                //arrow.visible = true;
                break;
            case 2:	//-- left
                if (isThick) {
                    ag.moveTo(20, 11).lineTo(5, 11).lineTo(9, 7).moveTo(4, 10.5).lineTo(9, 15);
                } else {
                    ag.moveTo(20, 11).lineTo(3, 11).lineTo(9, 7).moveTo(3.5, 11).lineTo(9, 15);
                    arrow.y += .5;
                }

                break;
            case 3:	//-- up
                if (isThick) {
                    ag.moveTo(11, 19).lineTo(11, 4).lineTo(7, 8).moveTo(10.5, 3).lineTo(15, 8);
                } else {
                    ag.moveTo(11, 19).lineTo(11, 2).lineTo(7, 8).moveTo(11, 2.5).lineTo(15, 8);
                    arrow.x += .5;
                }
                arrow.y += 1;	//-- visual adjustment for some reason
                break;
            default: //-- right
                if (isThick) {
                    ag.moveTo(3, 11).lineTo(18, 11).lineTo(14, 7).moveTo(19, 10.5).lineTo(14, 15);
                } else {
                    ag.moveTo(3, 11).lineTo(20, 11).lineTo(14, 7).moveTo(19.5, 11).lineTo(14, 15);
                    arrow.y += .5;
                }
        }
        container.addChild(arrow);

        /*-- w. triangle head
         arrow.graphics.beginFill(Graphics.getRGB(0,0,0));
         arrow.graphics.moveTo(2, 11).lineTo(20, 11);
         arrow.graphics.moveTo(20, 11).lineTo(14, 6).lineTo(14, 16).lineTo(20, 11);
         arrow.graphics.endFill();
         */
    }//for

    //-- grid on top
    grid = new Bitmap("assets/image/home529x529.png");
    container.addChild(grid);

    //-- create an array of captureContainer
    for (i=0; i<100; i++) {
        var captureContainer = new Container();
        captureContainer.cache(0,0,w,h);
        captureContainers.push(captureContainer);
    }
    if (!noMove) Ticker.addListener(window);
    Ticker.setFPS(15);
    stage.update();
}

function tick()
{
    var l = container.getNumChildren() - 1;						//num of arrows, -1:grid & bkg
    captureIndex = (captureIndex+1)%captureContainers.length;	//0, 1, ..., 99, 0, 1, ....
    stage.removeChildAt(0);
    var captureContainer = captureContainers[captureIndex];		//why ?????, for 3.3 seconds
    stage.addChildAt(captureContainer,0);
    captureContainer.addChild(container);

    //-- iterate through all the children and move them according to their velocity:
    for (var i=1; i<l; i++) {	//-- starts at i=1, because grid is at i=0
        var arrow = container.getChildAt(i);
        if (arrow.x < -20 || arrow.x > (w+20) || arrow.y < - 20 || arrow.y > (h + 20)) {
            //-- reset
            var dirIndex = Math.floor(Math.random()*4);
            if (dirIndex != arrow.dirIndex) {
                arrow.dirIndex = dirIndex;
                arrow.x = Math.floor(Math.random()*col)*cellW;
                arrow.y = arrow.orgY;
                arrow.alpha = 1;
                //-- redraw
                var isThick = arrow.isThick;
                var ag = arrow.graphics;
                ag.clear();
                /*var random = Math.random()*10;
                 var alpha;
                 if (random < 2) {
                 alpha = 0;
                 } else if (random <7) {
                 alpha = Math.random();
                 } else {
                 alpha = Math.random()*.4 + .7;
                 }
                 alpha = 0;*/
                var alpha = (Math.random()*10<7)? Math.random() : Math.random()*.5 + .8;
                ag.beginFill(Graphics.getRGB(255,255,0, alpha));	//255,255,0
                ag.rect(0,0,22,22);
                ag.endFill();
                if (isThick) {
                    ag.setStrokeStyle(2);
                } else {
                    ag.setStrokeStyle(1);
                }
                ag.beginStroke(Graphics.getRGB(0,0,0));
                //arrow.visible = false;	//?????
                switch (dirIndex) {
                    case 1:	//-- down
                        if (isThick) {
                            arrow.graphics.moveTo(11, 3).lineTo(11, 18).lineTo(7, 14).moveTo(10.5, 19).lineTo(15, 14);
                        } else {
                            arrow.graphics.moveTo(11, 3).lineTo(11, 20).lineTo(7, 14).moveTo(11, 19.5).lineTo(15, 14);
                            arrow.x += .5;
                        }
                        if (Ticker.getTime() > 1000) arrow.visible = true;
                        break;
                    case 2:	//-- left
                        if (isThick) {
                            arrow.graphics.moveTo(20, 11).lineTo(5, 11).lineTo(9, 7).moveTo(4, 10.5).lineTo(9, 15);
                        } else {
                            arrow.graphics.moveTo(20, 11).lineTo(3, 11).lineTo(9, 7).moveTo(3.5, 11).lineTo(9, 15);
                            arrow.y += .5;
                        }
                        if (Ticker.getTime() > 4000) arrow.visible = true;
                        break;
                    case 3:	//-- up
                        //arrow.graphics.beginStroke(Graphics.getRGB(0,0,255));
                        if (isThick) {
                            arrow.graphics.moveTo(11, 19).lineTo(11, 4).lineTo(7, 8).moveTo(10.5, 3).lineTo(15, 8);
                        } else {
                            arrow.graphics.moveTo(11, 19).lineTo(11, 2).lineTo(7, 8).moveTo(11, 2.5).lineTo(15, 8);
                            arrow.x += .5;
                        }
                        arrow.y += 1;	//-- visual adjustment for some reason
                        if (Ticker.getTime() > 3000) arrow.visible = true;
                        break;
                    default: //-- right
                        if (isThick) {
                            arrow.graphics.moveTo(3, 11).lineTo(18, 11).lineTo(14, 7).moveTo(19, 10.5).lineTo(14, 15);
                        } else {
                            arrow.graphics.moveTo(3, 11).lineTo(20, 11).lineTo(14, 7).moveTo(19.5, 11).lineTo(14, 15);
                            arrow.y += .5;
                        }
                        if (Ticker.getTime() > 2000) arrow.visible = true;
                }//switch
            }//if
        }//if

        //-- ["+x", "+y", "-x", "-y"];
        /*
         switch (arrow.dirIndex) {
         case 1:		//down
         if (Ticker.getTime() > 1000) {
         arrow.visible = true;
         arrow.y += cellH * Math.floor(5 + Math.random()*2);
         }
         break;
         case 2:		//left
         if (Ticker.getTime() > 4000) {
         arrow.visible = true;
         arrow.x -= cellW * Math.floor(5 + Math.random()*5);
         }
         break;
         case 3:		//up
         if (Ticker.getTime() > 3000) {
         arrow.visible = true;
         arrow.y -= cellH * Math.floor(5 + Math.random()*2);
         }
         break;
         default:	//, and "+x" (0), right
         //arrow.x += speed;
         if (Ticker.getTime() > 2000) {
         arrow.visible = true;
         arrow.x += cellH * Math.floor(5 + Math.random()*5);
         }
         //
         }//switch

         if (arrow.visible)
         arrow.alpha -= .1;	//.05
         */

        //-- ["+x", "+y", "-x", "-y"];
        switch (arrow.dirIndex) {
            case 1:

                arrow.y += speed;
                break;
            case 2:
                arrow.x -= speed;
                break;
            case 3:
                arrow.y -= speed;
                break;
            default:	//, and "+x" (0)
                arrow.x += speed;
            //
        }//switch
        arrow.alpha -= .05;

    }//for

    /**/
    for (var j=0; j<bkgCellLength; j++) {
        //if (Math.random()*30<1) {
        if (Math.random()*10<1) {
            var bkgCell = bkgCells[j];
            var nextIndex = bkgCell.currentFrame + 1;
            var rowNum = Math.floor(nextIndex/col);
            if (rowNum != bkgCell.row) {
                nextIndex = bkgCell.row * col + bkgCell.col;
            }
            bkgCell.gotoAndStop(nextIndex);
        }
    }

    captureContainer.updateCache(null);	//"source-over"

    //-- draw the updates to stage:
    stage.update();
}

/*
 function handleGridLoad(event) {
 Ticker.addListener(stage);
 alert("handleGridLoad");
 }*/

function ImgCell(src, dest, width, height, x, y) {
    this._src = src;
    this._dest = dest;
    this.width = width;
    this.height = height;
    this._hW = width / 2;
    this._hH = height / 2;
    this._srcX = x;
    this._srcY = y;
    this.x = (dest.width / 2) - (src.width / 2) + x + this._hW;	//CHECK!!
    this.y = dest.height - (src.width / 2) + y + this._hH;		//CHECK!!
    //this.r = 0;
};

/*
VideoTile.prototype.draw = function() {
    var context = this._dest.getContext('2d');
    context.save();
    context.translate(this.x + this._hW, this.y + this._hH);
    //context.rotate(this.r);
    context.drawImage(this._src, this._srcX, this._srcY, this.width,
        this.height, -this._hW, -this._hH, this.width, this.height);
    context.restore();
};          */