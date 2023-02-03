/**
 * Created by IntelliJ IDEA.
 * User: WhoIN
 * Date: 5/21/13
 * Time: 9:26 PM
 * To change this template use File | Settings | File Templates.
 */
(function (window) {

    Site.ui = Site.ui || {};

    //----- Site.ui.Thumb ------------------------------------------------------------//
	Site.ui.Thumb = function (img, title) {
        //console.log("INFO Thumb :: title is " + title);
        this.img = img;
        this.title = title;
        if ((img == null) && (title == "")) {
            this.active = false;
        }
		this.initialize();
	}
	Site.ui.Thumb.IMG_W = 131;
	Site.ui.Thumb.IMG_H = 88;
	Site.ui.Thumb.ICON_WH = 43;
    Site.ui.Thumb.TITLE_H = 22;

    var p1 = Site.ui.Thumb.prototype = new createjs.Container();
    p1.img;
    p1.title;
    p1.active = true;
    p1.thumbContainer;
    p1.thumbMask;
    p1.thumbBitmap;
    p1.titleHolder;
    p1.titleBkg;
    p1.thumbTitle;
    p1.inactiveBkg;

	p1.Container_initialize = p.initialize;	//unique to avoid overiding base class    TODO:: didn't get
	p1.initialize = function () {
		this.Container_initialize();

        this.thumbContainer = new createjs.Container();

        this.titleHolder = new createjs.Container();
        this.titleHolder.y =  Site.ui.Thumb.IMG_H;
        this.titleHolder.alpha = 0;

        this.thumbMask = new createjs.Shape();
        this.thumbMask.regX = this.thumbMask.regY = Site.ui.Thumb.ICON_WH/2;
        this.thumbMask.x = Site.ui.Thumb.IMG_W/2;
        this.thumbMask.y = Site.ui.Thumb.IMG_H/2;
        this.thumbMask.visible = false;
        //this.thumbMask.alpha = 0.5;

        this.buildThumb();
        this.buildTitle();
        this.buildMask();

		this.addChild(this.thumbContainer);
        this.addChild(this.titleHolder);
        this.addChild(this.thumbMask);

		this.thumbContainer.mask = this.thumbMask;
        this.hitArea = this.thumbMask;

        var ths = this;
        this.addEventListener("click", function(event) {
			//console.log("INFO Thumb :: ThumbClick");
		});
		this.addEventListener("mouseover", function(event) {
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
	p1.buildThumb = function () {
        if (this.img != null) {
            this.thumbBitmap = new createjs.Bitmap(this.img);
		    this.thumbContainer.addChild(this.thumbBitmap);
        } else {
            this.active = false;
            this.inactiveBkg = new createjs.Shape();
            var g = this.inactiveBkg.graphics;
            g.beginFill(createjs.Graphics.getRGB(0,0,0)).drawRect(0, 0, Thumb.IMG_W, Thumb.IMG_H);
            this.thumbContainer.addChild(this.inactiveBkg);
        }
	}
    p1.buildTitle = function () {
        this.titleBkg = new createjs.Shape();
        var g = this.titleBkg.graphics;
        g.beginFill(createjs.Graphics.getRGB(255,255,0)).drawRect(0, 0, Thumb.IMG_W, Thumb.TITLE_H);
        this.titleHolder.addChild(this.titleBkg);

        this.thumbTitle = new createjs.Text(this.title, "8px STD0755", "#000000");
        this.thumbTitle.x = 6;
        this.thumbTitle.y = 7;
        this.titleHolder.addChild(this.thumbTitle);
    }
    p1.buildMask = function () {
        var g = this.thumbMask.graphics;
		g.beginFill(createjs.Graphics.getRGB(0,0,0)).drawRect(0,0,Thumb.ICON_WH,Thumb.ICON_WH);
    }
    p1.expand = function () {
        createjs.Tween.get(this.thumbMask,{override:true}).to({scaleX:3.05, scaleY:2.05}, 300, createjs.Ease.sineOut);
        createjs.Tween.get(this.titleHolder,{override:true}).wait(100).to({alpha:1}, 200, createjs.Ease.linear);
    }
    p1.backTo = function () {
        //warning: call back function is not called on complete for some reason, it called earlier
        createjs.Tween.get(this.thumbMask,{override:true}).to({scaleX:1, scaleY:1}, 150, createjs.Ease.linear).call(backToComplete);
        createjs.Tween.get(this.titleHolder,{override:true}).to({alpha:0}, 150, createjs.Ease.linear);

        var ths = this;
        function backToComplete() {
            ths.dispatchEvent("outDone");
        }
    }

	//window.Site.ui.Thumb = Site.ui.Thumb;
    //----- end Site.ui.Thumb --------------------------------------------------------//

}(window));