(function (window) {

	var ScrollBar = function(width, height) {
        //console.log("INFO ScrollBar, width is " + width);
        //console.log("INFO ScrollBar, height is " + height);
		this.initialize(width, height);
	}
	var p = ScrollBar.prototype = new createjs.Container(); // inherit from Container

    ScrollBar.SCROLLER_H = 24;

	p.track;
    //p.tArrow;
    //p.bArrow;
    p.scroller;
	p.width;
	p.height;
	p.max;
	p.min;
	p.value;
	p.label;
    //p.isMouseDown;

	p.Container_initialize = p.initialize;
	p.initialize = function(width, height) {
		this.Container_initialize();

		this.width = width;
		this.height = height;

		this.track = new createjs.Shape();
        this.track.graphics.f("#ffffff").dr(0, 0, width, height).ef();
		this.track.graphics.ss(.5).s("#000").mt(width/2,ScrollBar.SCROLLER_H/2).lt(width/2, height-ScrollBar.SCROLLER_H/2).es();

		this.track.x = 0;
		this.track.y = 0;
		this.max = 100;     //or 1?
		this.min = 0;
        //this.isMouseDown = false;

		this.addChild(this.track);
        /*
        this.tArrow = new createjs.Shape();
        this.tArrow.graphics.f("rgba(255,255,255,0)").dr(0,0,16,12).ef();
        this.tArrow.graphics.ss(1).s("#000").mt(0,12).lt(8,0).lt(16,12).es();
        this.tArrow.x = width/2 - 8;
        this.tArrow.y = 0;
        this.addChild(this.tArrow);

        this.bArrow = new createjs.Shape();
        this.bArrow.graphics.f("rgba(255,255,255,0)").dr(0,0,16,12).ef();
        this.bArrow.graphics.ss(1).s("#000").mt(0,0).lt(8,12).lt(16,0).es();
        this.bArrow.x = width/2 - 8;
        this.bArrow.y = height - 12;
        this.addChild(this.bArrow); */

        this.scroller = new createjs.Shape();
        this.scroller.graphics.f("#000").dr(0,-ScrollBar.SCROLLER_H/2,14,ScrollBar.SCROLLER_H).ef();
        this.scroller.x = width/2 - 7;
        this.scroller.y = ScrollBar.SCROLLER_H/2;
        this.addChild(this.scroller);

        //for test
        this.label = new createjs.Text("value:0", "bold 10px Arial", "#777777");
        this.label.x = -50;
        this.label.y = 100;
        this.addChild(this.label);

		var _this = this;

		this.addEventListener("click", function(event) {
			_this.updatePosition(event);
		})
		this.addEventListener("mousedown", function(event) {
            event.addEventListener("mousemove", function(event) {
				_this.updatePosition(event);
			});
		})
	}

	p.updateLabel = function () {

		this.label.text = "value:" + this.value;
	}

	p.updatePosition = function (param) {
		var event = param;
        var pt = this.globalToLocal(event.rawX, event.rawY);
        //console.log("INFO updatePosition :: event.rawX: " + event.rawX + ", event.rawY: " + event.rawY);
        //console.log("INFO updatePosition :: pt.x: " + pt.x + ", pt.y: " + pt.y);
        //TODO
        this.scroller.y = Math.min(Math.max(pt.y, ScrollBar.SCROLLER_H/2), this.height - ScrollBar.SCROLLER_H/2);
        this.value = Math.floor(this.min + ((this.scroller.y-ScrollBar.SCROLLER_H/2)/(this.height-ScrollBar.SCROLLER_H))*(this.max - this.min));
        console.log("INFO updatePosition :: " + this.value);

		this.updateLabel();
		this.dispatchEvent("change");
	}

	window.ScrollBar = ScrollBar;

}(window));
