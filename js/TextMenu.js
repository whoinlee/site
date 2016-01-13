(function (window) {

	var TextMenu = function(text, font, color, hoverColor, hoverBgColor) {
		this.initialize(text, font, color, hoverColor, hoverBgColor);
	}
	var p = TextMenu.prototype = new createjs.Container();

    p.active = true;
    p.color;
	p.hoverColor;
    p.hoverBgColor;
    p.bkg;
    p.text;

	p.Container_initialize = p.initialize;
	p.initialize = function(text, font, color, hoverColor, hoverBgColor, hoverOverBgColor) {
		this.Container_initialize();

        this.color = color;
		this.hoverColor = hoverColor;
        this.hoverBgColor = hoverBgColor;
        this.hoverOverBgColor = hoverOverBgColor;
        this.cursor = "pointer";

        this.bkg = new createjs.Shape();
        this.bkg.alpha = 0;
        this.addChild(this.bkg);

        this.text = new createjs.Text(text, font, color);
        this.text.textBaseline = "top";
        this.addChild(this.text);

        var side =  (this.text.getMeasuredHeight() > this.text.getMeasuredWidth())? this.text.getMeasuredHeight()+4 : this.text.getMeasuredWidth()+4;
        var xLoc = -(side - this.text.getMeasuredWidth())/2;
        var yLoc = -(side - this.text.getMeasuredHeight())/2;
        this.bkg.graphics.beginFill(this.hoverBgColor).drawRect(Math.floor(xLoc),Math.floor(yLoc), Math.round(side), Math.round(side));
        //this.bkg.graphics.beginFill(0xffffff).drawRect(xLoc,yLoc, side, side);

		//var _this = this;
		//this.addEventListener("click", function(event) {
			//alert("TextMenu CLICK");
		//})
	}

    // set up the handlers for mouseover / out:
    p.onMouseOver = function() {
       if (this.active) {
           this.text.color = this.hoverColor;
           this.bkg.alpha = 1;

       }
    }

    p.onMouseOut = function() {
        if (this.active) {
            this.text.color = this.color;
            this.bkg.alpha = 0;
        }
    }

    p.enable = function() {
        this.active = true;
        this.cursor = "pointer";
    }

    p.disable = function() {
        this.active = false;
        this.cursor = "default";
    }

    p.select = function() {
        this.text.color = this.hoverColor;
        this.bkg.alpha = 1;
        this.disable();
    }

    p.deselect = function() {
        this.text.color = this.color;
        this.bkg.alpha = 0;
        this.enable();
    }

	window.TextMenu = TextMenu;

}(window));
