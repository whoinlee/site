(function (window) {

	var ScrollPane = function(width, height) {
        //console.log("INFO ScrollPane, width is " + width);
        //console.log("INFO ScrollPane, height is " + height);
		this.initialize(width, height);
	}
	var p = ScrollPane.prototype = new createjs.Container();

    ScrollPane.SCROLLBAR_W = 16;

	p.contentHolder;
    p.contentMask;
    p.scrollBar;
    p.width;
    p.height;
    p.contentHeight;
    p.endLine;

	p.Container_initialize = p.initialize;
	p.initialize = function(width, height) {
		this.Container_initialize();

		this.width = width;
		this.height = height;

		this.contentHolder = new createjs.Container();
        this.addChild(this.contentHolder);
        this.contentHeight = 0;

		this.contentMask = new createjs.Shape();
        this.contentMask.graphics.f("#0f0").dr(0,0,width,height).ef();
        this.contentMask.visible = false;
        //this.contentMask.alpha = .5;
        this.addChild(this.contentMask);

        this.contentHolder.mask = this.contentMask;

        /*  commented out for specific use with no scrollBar
        this.scrollBar = new ScrollBar(ScrollPane.SCROLLBAR_W, this.height);
        this.scrollBar.x = this.width - ScrollPane.SCROLLBAR_W;
        this.scrollBar.visible = false;
        this.addChild(this.scrollBar);


        var _this = this;
        this.scrollBar.addEventListener("change", function(event) {
			_this.updatePosition(event);
		}) */
	}

	p.updatePosition = function (param) {
		var event = param;
        this.contentHolder.y = -(this.scrollBar.value/100) * (this.contentHeight - this.height);
        //console.log("INFO updatePosition :: this.scrollBar.value: " + this.scrollBar.value);
        //console.log("INFO updatePosition :: this.contentHolder.y: " + this.contentHolder.y);
	}

    p.addContent = function(content, contentHeight) {
        //console.log("INFO addContent :: content.y? " + content.y);
        //console.log("INFO ScrollPane :: addContent - called???");
        //content.y = yLoc;
        this.contentHolder.addChild(content);
        this.contentHeight += contentHeight;

        //console.log("INFO addContent :: this.contentHeight is " + this.contentHeight);
        /*if (this.contentHeight > this.height) {
            console.log("INFO addContent :: showing scrollBar??");
            //this.scrollBar.visible = true;
        }*/
    }
    /*
    p.addEndLine = function() {
        if (this.endLine) return;
        this.endLine = new createjs.Shape();
        this.endLine.y = this.contentHeight + 2;
        this.endLine.graphics.setStrokeStyle(.1).beginStroke(createjs.Graphics.getRGB(0,0,0)).moveTo(0,0).lineTo(this.width,0);
        this.contentHolder.addChild(this.endLine);
    }*/

    p.removeAllContent = function() {
        console.log("INFO ScrollPane :: removeAllContent - called???");
        this.contentHolder.removeAllChildren();
        this.contentHeight = 0;
        //this.scrollBar.visible = false;
    }

    p.getNumContent = function() {
        //console.log("INFO getNumChildren :: called???");
        return this.contentHolder.getNumChildren();
    }

    p.getNumPages = function() {
        return Math.floor(this.contentHeight/this.height + 1);
    }

    p.reset = function() {
        this.contentHolder.y = 0;
    }

    p.gotoPage = function(pgNum) {
        if ((pgNum <= 0) || (pgNum > this.getNumPages())) return;
        var targetY = -(pgNum - 1) * this.height;
        createjs.Tween.get(this.contentHolder).to({y:targetY}, 300, createjs.Ease.quadOut);
    }

	window.ScrollPane = ScrollPane;

}(window));
