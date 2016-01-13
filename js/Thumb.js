(function (window) {

	Thumb = function (img, title, slideNum) {
        this.img = img;
        this.title = title;
        this.slideNum = slideNum;
        if ((img == null) && (title == "")) {
            this.active = false;
        } else if (title == null) {
            this.isListThumb = true;
        }
		this.initialize();
	}

	var p = Thumb.prototype = new createjs.Container();

// public constants:
	Thumb.IMG_W = 131;
	Thumb.IMG_H = 88;
	Thumb.ICON_WH = 43;
    Thumb.TITLE_H = 22;

// public properties:
    p.active = false;   //true
    p.isListThumb = false;

    p.img;
    p.title;
    p.slideNum;

    p.thumbContainer;
    p.thumbMask;
    p.thumbBitmap;
    p.thumbOutline;

    p.titleHolder;
    p.titleBkg;
    p.thumbTitle;

    p.inactiveBkg;

// constructor:
	p.Container_initialize = p.initialize;	//unique to avoid overriding base class

	p.initialize = function () {
		this.Container_initialize();

        this.thumbContainer = new createjs.Container();

        if (!this.isListThumb) {
            this.titleHolder = new createjs.Container();
            this.titleHolder.y =  Thumb.IMG_H;
            this.titleHolder.alpha = 0;

            this.thumbMask = new createjs.Shape();
            this.thumbMask.regX = this.thumbMask.regY = Thumb.ICON_WH/2;
            this.thumbMask.x = Thumb.IMG_W/2;
            this.thumbMask.y = Thumb.IMG_H/2;
            this.thumbMask.visible = false;
        }

        this.buildThumb();
        this.addChild(this.thumbContainer);
        var ths = this;
        if (!this.isListThumb) {
            this.buildTitle();
            this.buildMask();
            this.addChild(this.titleHolder);
            this.addChild(this.thumbMask);
            this.thumbContainer.mask = this.thumbMask;
            this.hitArea = this.thumbMask;
            this.addEventListener("mouseover", function(event) {
                //console.log("INFO Thumb :: mouseover, ths.active is " + ths.active);
                if (ths.active) {
                    ths.dispatchEvent("over");
                    ths.expand();
                }
            });
            this.addEventListener("mouseout", function(event) {
                if (ths.active) {
                    ths.backTo();
                }
            });
        }
	}

// public methods:
	p.buildThumb = function () {
        if (this.img != null) {
            if (!this.isListThumb) {
                this.thumbOutline = new createjs.Bitmap("assets/image/sq43x43.jpg");
                this.thumbOutline.regX =  this.thumbOutline.regY = Math.floor(this.thumbMask.regX);
                this.thumbOutline.x = Math.floor(this.thumbMask.x);
                this.thumbOutline.y = Math.floor(this.thumbMask.y);
                this.thumbContainer.addChild(this.thumbOutline);
                this.active = false;
            }

            this.thumbBitmap = new createjs.Bitmap(this.img);
            if (!this.isListThumb) this.thumbBitmap.alpha = 0;
		    this.thumbContainer.addChild(this.thumbBitmap);

        } else {
            this.active = false;
            this.inactiveBkg = new createjs.Shape();
            var g = this.inactiveBkg.graphics;
            g.beginFill(createjs.Graphics.getRGB(0,0,0)).drawRect(0, 0, Thumb.IMG_W, Thumb.IMG_H);
            this.thumbContainer.addChild(this.inactiveBkg);
        }
	}

    p.buildTitle = function () {
        this.titleBkg = new createjs.Shape();
        var g = this.titleBkg.graphics;
        g.beginFill(createjs.Graphics.getRGB(255,255,0)).drawRect(0, 0, Thumb.IMG_W, Thumb.TITLE_H);
        this.titleHolder.addChild(this.titleBkg);

        this.thumbTitle = new createjs.Text(this.title, "8px STD0755", "#000000");
        this.thumbTitle.x = 6;
        this.thumbTitle.y = 7;
        this.titleHolder.addChild(this.thumbTitle);
    }

    p.buildMask = function () {
        var g = this.thumbMask.graphics;
		g.beginFill(createjs.Graphics.getRGB(0,0,0)).drawRect(0,0,Thumb.ICON_WH,Thumb.ICON_WH);
    }

    p.expand = function () {
        createjs.Tween.get(this.thumbMask,{override:true}).to({scaleX:3.05, scaleY:2.05}, 300, createjs.Ease.sineOut);
        createjs.Tween.get(this.titleHolder,{override:true}).wait(100).to({alpha:1}, 200, createjs.Ease.linear);
    }

    p.backTo = function () {
        //warning: call back function is not called on complete for some reason, it called earlier
        createjs.Tween.get(this.thumbMask,{override:true}).to({scaleX:1, scaleY:1}, 150, createjs.Ease.linear).call(backToComplete);
        createjs.Tween.get(this.titleHolder,{override:true}).to({alpha:0}, 150, createjs.Ease.linear);

        var ths = this;
        function backToComplete() {
            ths.dispatchEvent("outDone");
        }
    }

    p.showImage = function (delay) {
        //TODO: ERROR on some browser? when this.thumbBitmap doesn't exist
        if (this.thumbBitmap) {
            if (this.thumbBitmap.alpha <1) {
                //this.active = true;
                createjs.Tween.get(this.thumbBitmap,{override:true}).wait(delay).to({alpha:1}, 500, createjs.Ease.linear).call(onShowImageComplete);
            }
        }

        var ths = this;
        function onShowImageComplete() {
            ths.thumbOutline.visible = false;
            ths.thumbOutline = null;
            ths.thumbContainer.removeChild(ths.thumbOutline);

            ths.active = true;
            ths.cursor = "pointer";
        }
    }

    p.hide = function() {
        this.visible = false;
    }

    p.show = function() {
        this.visible = true;
    }

	window.Thumb = Thumb;

}(window));