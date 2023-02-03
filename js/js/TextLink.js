(function (window) {

	var TextLink = function(text, font, color, hoverColor, url, slideNum) {
		this.initialize(text, font, color, hoverColor, url, slideNum);
	}
	var p = TextLink.prototype = new createjs.Text();

	p.hoverColor;
    p.hover = false;
    p.url;
    p.active;
    p.slideNum;
    //p.underline;

	p.Text_initialize = p.initialize;
	p.initialize = function(text, font, color, hoverColor, url, slideNum) {
		this.Text_initialize(text, font, color);

		this.hoverColor = hoverColor;
		this.hover = false;
		this.hitArea = new createjs.Shape();
		this.textBaseline = "top";
        this.url = url;
        this.slideNum = slideNum;

		var _this = this;
		this.addEventListener("click", function(event) {
            if (_this.slideNum)  {
                openOverlay(_this.slideNum);
            } else {
                var win = window.open(_this.url, '_blank');
                win.focus();
            }
		})
	}

    p.Text_draw = p.draw;
    p.draw = function(ctx, ignoreCache) {
        // save default color, and overwrite it with the hover color if appropriate:
        var color = this.color;
        if (this.hover) { this.color = this.hoverColor; }

        // call Text's drawing method to do the real work of drawing to the canvas:
        this.Text_draw(ctx, ignoreCache);

        // restore the default color value:
        this.color = color;

        // update hit area so the full text area is clickable, not just the characters:
        this.hitArea.graphics.clear().beginFill("#FFF").drawRect(0,0,this.lineWidth||this.getMeasuredWidth(), this.getMeasuredHeight());

        if (this.url || this.slideNum) {
            this.cursor = "pointer";
            this.active = true;
            //draw underline

            //var bounds = p.getBounds();
            //var xLoc = Math.floor(bounds.x);
            //var yLoc = Math.round(bounds.y);
            //var w = Math.round(bounds.width);
            //this.underline.clear().setStrokeStyle(1).beginStroke("#000").moveTo(0, 16).lineTo(this.getMeasuredWidth(), 16).endStroke();
        }
    }

    // set up the handlers for mouseover / out:
    p.onMouseOver = function() {
       if (this.active) this.hover = true;
    }

    p.onMouseOut = function() {
        if (this.active) this.hover = false;
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
        this.hover = true;
        this.disable();
    }

    p.deselect = function() {
        this.hover = false;
        this.enable();
    }

	window.TextLink = TextLink;

}(window));
