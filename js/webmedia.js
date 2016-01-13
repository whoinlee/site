//---------------------------//
//----  webmedia canvas  ----//
//---------------------------//
//Site.section.Webmedia
var webmediaApp = {

    canvas: null,
    context: null,
    stage: null,

    yrsArr: [],
    yrsObj: {},
    iconsObj: {},   //same as original json data format
    iconsArr: [],
    thumbsArr: [],
    yrTxtArr: [],
    activeIconsCount: 0,
    iconsCount: 0,
    iconsLoaded: 0,
    onPreloadCompletedFunction: null,
    progressFunction: null,

    iconWidth: 43,
    iconHeight: 43,
    iconMargin: 1,

    disabled: true,
    initiated: false,
    initiating: false,
    moving: false,

    isIdle: false,
    idleStartTime: 0,
    topChildIndex: 100,

    yrsContainer: null,

    initiatedTrigger: false,

    listMenuID: "",
    thumbMenuID: "",
    selectedMenuID: "",
    viewMenuList: null,
    selectedMenu: null,

    isBuilt: false,
    currentYear: "",
    latestYear: "",
    currentYearIndex: 0,
    lastYearIndex: 0,
    firstYearIndex: 0,
    currentView: "thumbView",
    pageControlPanel: null,
    prevPage: null,
    yrPanel: null,
    nextPage: null,
    prevListHolder: null,
    currentListHolder: null,
    nextListHolder: null,
    pages: [],
    selectedPage: null,

    hBar:null,
    vBar:null,

    //ToDO: need disable/enable?
    disable: function() {
        this.disabled = true;
    },
    enable: function() {
        if (!this.context) return false;
        this.disabled = false;
        return true;
    },

    loadIcons: function() {
        var ths = this;
        var icon;
        for (var i = 0;i<this.iconsCount;i++) {
            icon = this.iconsArr[i];
            icon.img = new Image();
            icon.img.onload = icon.img.onerror = function(e) {
                //console.log("INFO icon.img.onload, this.id is " + this.id + ", this.src is " + this.src);    //OK, 0~35
                ths.onIconImgLoaded(e, this);
            }

            if (icon.src != "") icon.img.src = icon.src;    //load the image
        }
    },
    onIconImgLoaded: function(e, img) {
        if (e && (e.type=='error')) img.loaded = false;
        else img.loaded = true;

        this.iconsLoaded++;
        var stop = (this.iconsLoaded>=this.activeIconsCount);
        this.progressFunction(this.iconsLoaded, stop);
    },

    setProgressFunction: function(progressFunction) {
        this.progressFunction = progressFunction;
    },
    setOnPreloadCompletedFunction: function(f) {
        this.onPreloadCompletedFunction = f;
    },

    run: function() {
        console.log("INFO webmedia.js :: run called when preloading is complete, from webmediaAppStart()");
        if (this.disabled) return false;

        this.thumbsArr = [];
        this.disabled = true;   //TODO what???
        this.iconsResort();

        this.disabled = false;  //TODO what???
        this.repaint();

        this.initViewMenu();

        this.isBuilt = true;
        return true;
    },
    iconsResort: function() {
        //TODO: NEED? cause icons don't need to be resorted as they are organized only by year  --> yes only once
        console.log("INFO webmedia.js :: iconsResort called");
        var yr, icon, yrsCount, iconsCount;
        //var yrY = Math.floor(this.canvas.height - this.yrYOffset);
        yrsCount = this.yrsArr.length;
        for (var i=0; i<yrsCount; i++) {
            yr = this.yrsArr[i];
            yr.tw = this.context.measureText(yr.str).width;
            yr.x = i*(this.iconWidth + this.iconMargin) + Math.floor((this.iconWidth - yr.tw)/2);
            yr.y = 0;    //not yrY
            iconsCount = yr.icons.length;
            //console.log("INFO iconsResort :: iconsCount for yr " + yr.str + " is " + iconsCount, "i: " + i);
            for (var j=0; j<iconsCount; j++) {
                icon = yr.icons[j];
                //TODO need?
                /*
                if (!this.initiated) {
                    //for resizing
                    icon.x0 = icon.destX;
                    icon.y0 = icon.destY;
                } else {
                    icon.x0 = icon.x;
                    icon.y0 = icon.y;
                }  */
            }//for j
        }//for i
    },
    getTime: function() {
        return glUtils.getAnimTime();
    },
    repaint: function() {
        console.log('INFO webmedia.js :: repaint called');
        if (this.disabled) return false;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.yrsPaint();
        this.iconsUpdate();

        if (this.initiated && this.initiatedTrigger) {
            this.initiatedTrigger = false;
            //webmediaCanvasReady();        //TODO
        }
    },

    yrsPaint: function() {
        console.log("INFO webmedia.js :: yrsPaint called!!!!!!");

        var yrsCount = this.yrsArr.length;
        this.yrsContainer = new createjs.Container();
        this.yrsContainer.y = Math.floor(this.canvas.height-37);
        this.stage.addChild(this.yrsContainer);

        this.context.font = 'Bold 13px Helvetica';
        this.yrTxtArr = [];
        for (var i=0; i<yrsCount; i++) {
            yr = this.yrsArr[i];
            if (yr.str != "") {
                var yrTxt = new createjs.Text(yr.str, "Bold 13px Helvetica", "#000000");
                //var yrTxt = new createjs.Text(yr.str, "Bold 13px HelveticaNeue", "#000000");
                yrTxt.x = yr.x;
                yrTxt.alpha = 0;
                this.yrsContainer.addChild(yrTxt);
                this.yrTxtArr.push(yrTxt);
                //createjs.Tween.get(yrTxt).wait(250*i + 3000).to({alpha:1}, 500);
            }//if
        }//for
        createjs.Ticker.addEventListener("tick", this.stage);   //TODO :: EMMMM DON"T KNOW
    },
    iconsUpdate: function() {
        var yr, yrIconsCount, icon, delay, yrTxt;
        var yrsCount = this.yrsArr.length;
        yr = {};
        var prevJ = 0;
        var yrTxtIndex = 0;
        for (var i=0; i<yrsCount; i++) {
            yr = this.yrsArr[i];
            yrIconsCount = yr.icons.length;
            //console.log("INFO webmedia.js :: iconsUpdate - yrIconsCount for yr " + yr.str + " is " + yrIconsCount);
            //console.log("INFO webmedia.js :: iconsUpdate - yr.str is " + yr.str);
            if (yr.str != "") {
                yrTxt = this.yrTxtArr[yrTxtIndex];
                createjs.Tween.get(yrTxt).wait(prevJ * 100).to({alpha:1}, 200);
                yrTxtIndex++;
            }
            for (var j=0; j<yrIconsCount; j++) {
                icon = yr.icons[j];
                icon.x = icon.destX;      //TODO: check
                icon.y = icon.destY;      //TODO: check
                delay = prevJ * 100 + j*100;
                this.iconDraw(icon, delay);
            }//for
            prevJ += (j-1);
        }//for

        this.topChildIndex = this.stage.getNumChildren() - 1;
        this.showThumbImages(delay);
    },
    iconDraw: function(icon, delay) {
       //console.log("INFO iconDraw");
        var ths = this;
        var x = icon.x;
        var y = icon.y;
        var thumb;
        var wait = delay;
        thumb = (icon.img.loaded)? new Thumb(icon.img, icon.title, icon.index) : new Thumb(null, "", icon.index);
        //if (thumb.active) {                                                                                                                                          343
            //thumb.cursor = "pointer";
        //}
        thumb.x = Math.floor(x);
        thumb.y = Math.floor(y);
        //thumb.showImage(wait);
        thumb.addEventListener("over", function(event) {
            ths.stage.setChildIndex(event.target, ths.topChildIndex);
            ths.isIdle = false;
            if (!createjs.Ticker.hasEventListener("tick")) {
               createjs.Ticker.addEventListener("tick", tick);
		    }
		});
        thumb.addEventListener("outDone", function(event) {
            //console.log("INFO webmedia.js :: thumb.outDone!!");
            ths.isIdle = true;
            ths.idleStartTime = ths.getTime();
		});
        thumb.addEventListener("click", function(event) {
            //console.log("INFO webmedia.js :: thumbView thumb click, event.target.slideNum : " + event.target.slideNum);
            openOverlay(event.target.slideNum);
	    });

        thumb.alpha = 0;
        //createjs.Tween.get(thumb,{override:true}).wait(delay).to({visible:true}, 0, createjs.Ease.linear);
        createjs.Tween.get(thumb,{override:true}).wait(delay).to({alpha:1}, 250, createjs.Ease.linear);
        this.stage.addChild(thumb);
        this.thumbsArr.push(thumb);
        this.stage.update();
    },
    showThumbImages: function(delay) {
        var thumbTotal = this.thumbsArr.length;
        var thisThumb, thisThumbDelay;
        for (var i = 0; i<thumbTotal; i++) {
            thisThumb = this.thumbsArr[i];
            thisThumbDelay = delay + (Math.random(thumbTotal))*delay;
            //console.log(i + ": thisThumbDelay:" + thisThumbDelay);
            //console.log(i + ": delay:" + delay);
            thisThumb.showImage(thisThumbDelay);
            //if (thisThumb.active) thisThumb.cursor = "pointer";
        }
    },
    iconClickTrigger: function(icon, hideFlyingImg) {
        if (this.disabled) return false;
        var l = icon.x;
        var b = this.canvas.height - icon.y;
        //this.resetCurrentIndex();

        /*var slSrc = '';
        if (icon.slImg.loaded) {
            slSrc = icon.slSrc;
        }

        uiLoadSlides(icon.id, icon.tSrc, l, b, icon.fsW, icon.fsH, icon.pBgClr, slSrc, icon.code, hideFlyingImg);  */
    },

    buildListView: function(yr) {
        //console.log("INFO webmedia.js :: buildListView - yr is " + yr);
        if (yr == undefined || yr == null) return;
        var currentYear = yr;
        //console.log("INFO buildListView :: currentYear is " + currentYear);
        var icons = this.yrsObj[currentYear].icons;
        //console.log("INFO buildListView :: icons.length is " + icons.length);
        var iconLength = icons.length;
        var iconObj;

        var thumbContainer;
        var img;
        var thumb;
        var thumbHeader;
        var thumbDesc, link, underline;
        var screenShots;

        /*
        if (this.hBar == null) {
            var ths = this;
            this.hBar = new Image();
            this.hBar.src =  'assets/image/hBar20x1.png';
            this.hBar.onload = this.hBar.onerror = function(e) {
                //console.log("hBar loaded? " + e.type);
                if (e && (e.type=='error')) ths.hBar.loaded = false;
                else ths.hBar.loaded = true;
            }
        }

         if (this.vBar == null) {
            var ths = this;
            this.vBar = new Image();
            this.vBar.src =  'assets/image/vBar1x20.png';
            this.vBar.onload = this.vBar.onerror = function(e) {
                //console.log("vBar loaded? " + e.type);
                if (e && (e.type=='error')) ths.vBar.loaded = false;
                else ths.vBar.loaded = true;
            }
        }*/

        if (this.currentListHolder == null) {
            //var holderW = this.canvas.width - 5;
            //var holderH = this.canvas.height - 45;
            /*this.prevListHolder = new createjs.Container();  //new createjs.Container()
            this.currentListHolder = new createjs.Container();
            this.nextListHolder = new createjs.Container(); */

            this.prevListHolder = new ScrollPane(this.canvas.width, 484);
            this.currentListHolder = new ScrollPane(this.canvas.width, 484);
            this.nextListHolder = new ScrollPane(this.canvas.width, 484);
            this.prevListHolder.x = -(this.canvas.width);
            this.currentListHolder.x = 0;
            this.nextListHolder.x = this.canvas.width;
            this.stage.addChild(this.prevListHolder);
            this.stage.addChild(this.currentListHolder);
            this.stage.addChild(this.nextListHolder);

            //var testScroller = new ScrollBar(16, 484);
            //testScroller.x = this.canvas.width - 16;
            //this.stage.addChild(testScroller);
        } else {
            if (parseInt(currentYear) < parseInt(this.currentYear)) {
                //move to prev
                //this.nextListHolder.removeAllChildren();
                this.nextListHolder.removeAllContent();
                this.nextListHolder.x = -(this.canvas.width);    //move to the prev position
                var temp = this.nextListHolder;
                this.nextListHolder = this.currentListHolder;
                this.currentListHolder = this.prevListHolder;
                this.prevListHolder = temp;
            } else {
                //move to next
                //this.prevListHolder.removeAllChildren();
                this.prevListHolder.removeAllContent();
                this.prevListHolder.x = (this.canvas.width);    //move to the next position
                var temp = this.prevListHolder;
                this.prevListHolder = this.currentListHolder;
                this.currentListHolder = this.nextListHolder;
                this.nextListHolder = temp;
            }
        }
        //console.log("INFO webmedia.js :: num of children - " + this.currentListHolder.getNumChildren());
        if (this.currentListHolder.getNumContent() == 0) {
            //console.log("INFO webmedia.js :: FIRST BUILD");
            this.thumbsArr = [];
            var loc = this.currentListHolder.x;
            var bkg;
            var currentY;
            var comment;
            for (var i=0; i<iconLength; i++) {
                iconObj = icons[i];
                //console.log("INFO buildListView :: " + i + ", iconObj.index is " + iconObj.index);
                img = this.iconsArr[iconObj.index].img;
                if (img.loaded) {
                    thumbContainer = new createjs.Container();
                    thumbContainer.x = 0;
                    thumbContainer.y = i*97;
                    this.currentListHolder.addContent(thumbContainer, 98);
                    if ((i%5)%2 == 0) {
                        //0, 2, 4th, add a background
                        bkg = new createjs.Bitmap("assets/image/listViewBkg529x96.png");
                        bkg.alpha = .5;
                        thumbContainer.addChild(bkg);
                    }
                    thumb = new Thumb(img, null, iconObj.index);
                    thumb.cursor = "pointer";
                    thumb.x = 2;
                    thumb.y = 4;
                    thumbContainer.addChild(thumb);
                    /*thumb.addEventListener("mouseover", function(event) {
                        console.log("over");
                    });
                    thumb.addEventListener("mouseout", function(event) {
                        console.log("out");
                    });*/
                    thumb.addEventListener("click", function(event) {
                        //console.log("INFO webmedia.js :: list view thumb.click :: event.target.slideNum is " + event.target.slideNum);
                        openOverlay(event.target.slideNum);
                    });

                    thumbHeader = new createjs.Text(iconObj.header, "Bold 12px Helvetica", "#000000");
                    thumbHeader.x = 142;
                    thumbHeader.y = 8;
                    thumbContainer.addChild(thumbHeader);

                    thumbDesc = new TextLink(iconObj.descTxt, "12px Helvetica", "#000000", "#0033ff", iconObj.descLnk);
                    thumbDesc.x = 142;
                    thumbDesc.y = 24;
                    thumbContainer.addChild(thumbDesc);

                    currentY = 24 + 14;
                    if (iconObj.descLnk != undefined) {;
                        underline = new createjs.Bitmap("assets/image/hBar10x1.png");
                        underline.x = thumbDesc.x;
                        underline.y = thumbDesc.y + 11;
                        underline.scaleX = thumbDesc.getMeasuredWidth()/10;
                        thumbContainer.addChild(underline);

                        link = new createjs.Bitmap("assets/image/link9x9blue.png");
                        link.x = Math.floor(thumbDesc.x + thumbDesc.getMeasuredWidth() + 6);
                        link.y = thumbDesc.y + 2;
                        thumbContainer.addChild(link);
                    }

                    if (iconObj.comment != undefined) {
                        //console.log("INFO ever? iconObj.comment:: " + iconObj.comment)
                        comment = new createjs.Text(iconObj.comment, "10px Helvetica", "#000000");
                        comment.lineWidth = 378;
                        comment.lineHeight = 12;
                        comment.x = 142;
                        comment.y = currentY + 2;
                        thumbContainer.addChild(comment);
                    }

                    screenShots = new TextLink("screenshots", "10px Helvetica", "#33ccff", "#999999", undefined, iconObj.index);
                    screenShots.x = 142;
                    screenShots.y = 80;
                    thumbContainer.addChild(screenShots);

                    if (loc == 0) {
                        thumbContainer.alpha = 0;
                        createjs.Tween.get(thumbContainer).wait(200*i).to({alpha:1}, 500);
                    }

                    //TODO animation
                    this.thumbsArr.push(thumbContainer);
                }
            }


            if (loc != 0) {
                createjs.Tween.get(this.prevListHolder).to({x:-this.canvas.width}, 300, createjs.Ease.quadOut);
                createjs.Tween.get(this.currentListHolder).to({x:0}, 300, createjs.Ease.quadOut);
                createjs.Tween.get(this.nextListHolder).to({x:this.canvas.width}, 300, createjs.Ease.quadOut);
            }
        } else {
            //console.log("EVER???????????");
            this.currentListHolder.reset();
            createjs.Tween.get(this.prevListHolder).to({x:-this.canvas.width}, 300, createjs.Ease.quadOut);
            createjs.Tween.get(this.currentListHolder).to({x:0}, 300, createjs.Ease.quadOut);
            createjs.Tween.get(this.nextListHolder).to({x:this.canvas.width}, 300, createjs.Ease.quadOut);
        }
        var numPages = this.currentListHolder.getNumPages();
        var numContent = this.currentListHolder.getNumContent();
        if (numContent>5) {
             this.buildPageControl(numPages);
        }

        this.currentYear = currentYear;
        if (this.pageControlPanel == null) {
            this.buildControlPanel();
        }
        this.updateControlPanel();
        this.stage.update();
    },
    buildPageControl: function(numPages) {
        //var numPages = this.currentListHolder.getNumPages();
        var pgText;
        var ths = this;
        //console.log("INFO webmedia.js :: buildPageControl - numPages:" + numPages);
        this.pages = [];
        for (var i=0; i<numPages; i++) {
            //pgText = new TextMenu((i + 1) + "", "Bold 12px Helvetica", "#cccccc", "#000000", "#ffffff");
            pgText = new TextMenu((i + 1) + "", "12px Helvetica", "#000000", "#ffffff", "#000000");
            if (i==0) {
                pgText.select();
                this.selectedPage = pgText;
            }
            pgText.x = 8 + i*32;
            pgText.y =  this.canvas.height - 28;
            pgText.addEventListener("click", function(event) {
                if (ths.selectedPage != null) ths.selectedPage.deselect();
                var textMenu = event.target;
                var pgNum = Number(textMenu.text.text);
                textMenu.select();
                ths.selectedPage = textMenu;
                //console.log("INFO webmedia.js :: pgNum is " + pgNum);
                ths.currentListHolder.gotoPage(pgNum);
            })
            this.stage.addChild(pgText);
            this.pages.push(pgText);
        }
    },
    destroyPageControl: function() {
        var totalPages = this.pages.length;
        for (var i=0; i<totalPages; i++) {
            this.stage.removeChild(this.pages[i]);
        }
        this.pages = [];
        this.selectedPage = null;
    },
    buildControlPanel: function() {
        //console.log("INFO webmedia.js :: buildControlPanel called");
        var pageControlPanel, prevPage, nextPage, yrPanel;
        pageControlPanel = new createjs.Container();
        //pageControlPanel.x = this.canvas.width - 78;
        pageControlPanel.x = this.canvas.width - 88;
        pageControlPanel.y = this.canvas.height - 34;
        this.stage.addChild(pageControlPanel);

        prevPage = new createjs.Shape();
        prevPage.alpha = .4;
        var g1 = prevPage.graphics;
        g1.beginFill(createjs.Graphics.getRGB(255,255,255)).drawRect(0, 0, 20, 24);
        g1.setStrokeStyle(1);
        g1.beginStroke(createjs.Graphics.getRGB(0,0,0));
        g1.moveTo(20,0);
        g1.lineTo(0,12);
        g1.lineTo(20,24);
        prevPage.cursor = "pointer";
        pageControlPanel.addChild(prevPage);

        //yrPanel = new createjs.Text("20" + this.currentYear, "Bold 14px Helvetica", "#000000");
        //yrPanel = new createjs.Text("20" + this.currentYear, "Bold 20px Helvetica", "#000000");
        yrPanel = new createjs.Text("20" + this.currentYear, "20px Helvetica", "#000000");
        yrPanel.x = 23;
        //yrPanel.y = 6;
        yrPanel.y = 3;
        pageControlPanel.addChild(yrPanel);

        nextPage = new createjs.Shape();
        var g2 = nextPage.graphics;
        //nextPage.x = 58;
        nextPage.x = 68;
        nextPage.alpha = .4;
        g2.beginFill(createjs.Graphics.getRGB(255,255,255)).drawRect(0, 0, 20, 24);
        g2.setStrokeStyle(1);
        g2.beginStroke(createjs.Graphics.getRGB(0,0,0));
        g2.moveTo(0,0);
        g2.lineTo(20,12);
        g2.lineTo(0,24);
        nextPage.cursor = "pointer";
        pageControlPanel.addChild(nextPage);

        var ths = this;
        prevPage.addEventListener("mouseover", function(event) {
            event.target.alpha = 1;
        });
        prevPage.addEventListener("mouseout", function(event) {
            event.target.alpha = .4;
            /*g1.clear();
            g1.beginFill(createjs.Graphics.getRGB(255,255,255)).drawRect(0, 0, 20, 24);
            g1.setStrokeStyle(1);
            g1.beginStroke(createjs.Graphics.getRGB(0,0,0));
            g1.moveTo(20,0);
            g1.lineTo(0,12);
            g1.lineTo(20,24);*/
        });
        prevPage.addEventListener("click", function(event) {
            nextPage.visible = true;
            var prevYearIndex = --ths.currentYearIndex;
            if (prevYearIndex == ths.firstYearIndex) {
                prevPage.visible = false;
            }
            var prevYear = ths.yrsArr[prevYearIndex].str;
            ths.destroyPageControl();
            ths.buildListView(prevYear);
            ths.updateControlPanel();

		});
        nextPage.addEventListener("mouseover", function(event) {
            event.target.alpha = 1;
        });
        nextPage.addEventListener("mouseout", function(event) {
            event.target.alpha = .4;
        });
        nextPage.addEventListener("click", function(event) {
			prevPage.visible = true;
            var nextYearIndex = ++ths.currentYearIndex;
            if (nextYearIndex == ths.lastYearIndex) {
                nextPage.visible = false;
            }
            var nextYear = ths.yrsArr[nextYearIndex].str;
            ths.destroyPageControl();
            ths.buildListView(nextYear);
            ths.updateControlPanel();
		});

        this.pageControlPanel = pageControlPanel;
        this.prevPage = prevPage;
        this.nextPage = nextPage;
        this.yrPanel = yrPanel;
    },
    updateControlPanel: function() {
        if (this.currentYear == this.latestYear) {
            //console.log("INFO webmedia.js :: updateControlPane - this.currentYear == this.latestYear");
            this.nextPage.visible = false;
            this.prevPage.visible = true;
        } else if (this.currentYear == this.firstYearIndex) {
            //console.log("INFO webmedia.js :: updateControlPane - this.currentYear == this.firstYearIndex");
            this.prevPage.visible = false;
            this.nextPage.visible = true;
        }
        //todo working w left arrow
        if (this.currentYear != "") this.yrPanel.text = "20" + this.currentYear;
    },
    buildThumbView: function() {
        //console.log("INFO webmedia.js :: buildThumbView");
        this.run();
    },
    destroy: function() {
        //TODO:: reset list view/ thumb view related variable value
        if (this.currentListHolder) {
            this.prevListHolder = null;
            this.currentListHolder = null;
            this.nextListHolder = null;
        }
        this.pageControlPanel = null;
        this.currentYear = this.latestYear;
        this.currentYearIndex = this.lastYearIndex;

        var totalThumb = this.thumbsArr.length;
        for (var i=0; i<totalThumb; i++) {
            this.thumbsArr[i].removeAllEventListeners();   //todo: remove it's children's eventlisteners?
        }
        this.stage.removeAllChildren();
        this.stage.removeAllEventListeners();
        createjs.Ticker.removeEventListener("tick", tick);
        this.stage.clear();
        this.stage.update();
    },

    initViewMenu: function() {
        //console.log("INFO webmedia.js :: updateControlPane - initViewMenu called");
        var $viewMenuList = $("#viewList a");
        var $thumbMenu = $("#thumbIcon");
        var $listMenu = $("#listIcon");
        var $viewList = $("#viewList li");
        $viewList.css('display', 'inline');

        var id = $listMenu.attr("id");
        var src = $listMenu.attr("src");

        this.thumbMenuID = $thumbMenu.attr("id");
        this.listMenuID = $listMenu.attr("id");
        this.selectedMenuID = this.thumbMenuID;
        this.viewMenuList = $viewMenuList;

        this.selectedMenu = $thumbMenu;
        this.selectedMenu.addClass("selected");

        //TODO: the below loses icons' original fading functionality
        //$thumbMenu.css('opacity', 0);
        //$listMenu.css('opacity', 0);
        //$viewList.css('visibility', 'visible');
        //$thumbMenu.animate({opacity:1}, {duration:750});
        //$listMenu.delay(500).animate({opacity:.2}, {duration:750});

        var ths = this;
        $viewMenuList.click(function(e){
            if (ths.disabled) return false;
            if (e.preventDefault) e.preventDefault();
            var aTag = $(e.target).parent();  //$(e.target) is an <img> tag and its parent is a <a> tag
            var id = aTag.attr("id");
            //console.log("INFO webmedia.js :: onViewIconClick, id is " + id);  //'listIcon' or 'thumbIcon'
            if (ths.selectedMenuID != id) {
                ths.selectedMenu.removeClass("selected");
                ths.selectedMenu = aTag;
                ths.selectedMenu.addClass("selected");
                ths.selectedMenuID = id;
                ths.destroy();
                switch (id) {
                    case "listIcon":
                        ths.currentView = "listView";
                        ths.buildListView(webmediaApp.latestYear);
                        break;
                    case "thumbIcon":
                        ths.currentView = "thumbView";
                        ths.buildThumbView();
                }
            }
        });
    },
    resetViewMenu: function() {
        var $thumbMenu = $("#thumbIcon");
        var $listMenu = $("#listIcon");

        $thumbMenu.removeClass("selected");
        $listMenu.removeClass("selected");
    }
};//end webmediaApp

function tick(event) {
    //console.log("INFO tick :: calling stage.update");
    webmediaApp.stage.update(event);
    //giving enough time of 2 sec, otherwise it causes some issue with the very bottom thumbs on rollOut
    if (webmediaApp.isIdle && (webmediaApp.getTime() - webmediaApp.idleStartTime) > 2000) {
        //for some reason 'outdone' is not dispatched on outComplete. this should be done on thumbOutComplete
        createjs.Ticker.removeEventListener("tick", tick);
    }
}

function webmediaCanvasInit() {
    console.log('INFO webmedia.js :: webmediaCanvasInit called');
    var canvas = document.getElementById("webCanvas");
    var context = canvas.getContext("2d");
    var stage = new createjs.Stage(canvas);

    // enable touch interactions if supported on the current device:
	createjs.Touch.enable(stage);
	// enable mouse over / out events
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true; // keep tracking the mouse event when it leaves the canvas                //TODO, need for the arrows outside of Canvas case, in case?
    createjs.Ticker.setFPS(20);

    //TODO, no context while preloading
    if (!context) {
        //console.log('INFO webmedia.js :: webmediaCanvasInit - no context, ever???');
        //TODO hide menu
        return false;
    }

    webmediaApp.canvas = canvas;
    webmediaApp.context = context;
    webmediaApp.stage = stage;

    if (webmediaApp.isBuilt) {
        webmediaAppStart();
    } else {
        var canvasUrl = 'assets/data/webdata.json';
        $.ajax({
            url: canvasUrl,
            type: "post",
            dataType: "json",
            context: this,
            beforeSend: function() {
                console.log('INFO webmedia.js :: webmediaCanvasInit - beforeSend, uiUpdatePreloadingProccess(0)');
                //uiUpdatePreloadingProccess(0);   //TODO, if calls this, success function is nver called!!!!!!!!!
            },
            success: function(data) {
                if ((typeof(data.yrs)=='undefined')|(typeof(data.icons)=='undefined')) return false;
                var yrsArr, yrsObj, iconsArr, yrObj, iconObj, thisYr, thisYrIcons, thisYrIconLength, yrLength;
                var iconsCount, activeIconsCount, inactiveIconsCount, latestYear, lastYearIndex, firstYearIndex;
                yrsArr = [];
                yrsObj = {};
                iconsArr = [];
                yrLength  = data.yrs.length;
                inactiveIconsCount = 0;
                firstYearIndex = -1;
                lastYearIndex = 0;
                for (var i=0; i<yrLength; i++) {
                    thisYr = data.yrs[i];
                    yrObj = {};
                    yrObj.str = thisYr;
                    thisYrIcons = [];
                    if (thisYr != "") {
                        thisYrIcons = data.icons[thisYr];
                        thisYrIconLength = thisYrIcons.length;
                        if (thisYrIconLength>0) {
                            latestYear = thisYr;
                            lastYearIndex = i;
                            if (firstYearIndex<0) firstYearIndex = i;
                        }
                        for (var j=0; j<thisYrIconLength; j++) {
                            iconObj = thisYrIcons[j];
                            //TODO::CHECK, can add more properties, but need all of these ????? and check values
                            iconObj.colNum = i;
                            iconObj.rowNum = j;
                            iconObj.x = 0;
                            iconObj.y = 0;
                            iconObj.destX = (i - 1)*(webmediaApp.iconWidth + webmediaApp.iconMargin);
                            iconObj.destY = Math.floor(webmediaApp.canvas.height - (j+2) * (webmediaApp.iconHeight + webmediaApp.iconMargin) - webmediaApp.iconHeight/2);
                            iconObj.x0 = 0;
                            iconObj.y0 = 0;
                            iconObj.scale = 1;
                            iconObj.delay = Math.round(Math.random()*1000);
                            iconObj.alpha = 1;
                            iconObj.index = iconsArr.length;
                            iconsArr.push(iconObj);
                        }//for
                    } else {
                        inactiveIconsCount++;
                        iconObj = {"id":"", "yr":"", "order":0, "title":"", "header":"", "descTxt":"", "descLnk":"", "src":""};
                        iconObj.colNum = i;
                        iconObj.rowNum = 0;
                        iconObj.x = 0;
                        iconObj.y = 0;
                        iconObj.destX = (i - 1)*(webmediaApp.iconWidth + webmediaApp.iconMargin);
                        iconObj.destY = Math.floor(webmediaApp.canvas.height - 2*(webmediaApp.iconHeight + webmediaApp.iconMargin) - webmediaApp.iconHeight/2);
                        iconObj.x0 = 0;
                        iconObj.y0 = 0;
                        iconObj.scale = 1;
                        iconObj.delay = Math.round(Math.random()*1000);
                        iconObj.alpha = 1;
                        iconObj.index = iconsArr.length;
                        iconsArr.push(iconObj);
                        thisYrIcons.push(iconObj);
                    }//else
                    yrObj.icons = thisYrIcons;
                    yrObj.index = i;
                    yrObj.x = 0;
                    yrObj.y = 0;
                    yrObj.tw = 0;       //text width
                    yrsArr.push(yrObj);
                    if (thisYr != "") {
                        yrsObj[thisYr] = yrObj;
                        //console.log("test yrsObj[thisYr].icons.length : " + yrsObj[thisYr].icons.length)
                    }
                }//for i

                iconsCount = iconsArr.length;
                activeIconsCount = iconsCount - inactiveIconsCount;
                console.log('INFO webmedia.js :: webmediaCanvasInit - activeIconsCount is ' + activeIconsCount);

                webmediaApp.yrsArr = yrsArr;
                webmediaApp.yrsObj = yrsObj;
                webmediaApp.iconsArr = iconsArr;
                webmediaApp.iconsObj = data.icons;
                webmediaApp.iconsCount = iconsCount;
                webmediaApp.activeIconsCount = activeIconsCount;

                webmediaApp.currentYear = latestYear;
                webmediaApp.latestYear = latestYear;
                webmediaApp.firstYearIndex = firstYearIndex;
                webmediaApp.currentYearIndex = lastYearIndex;
                webmediaApp.lastYearIndex = lastYearIndex;

                uiIconsPreloadProgress.maxCount = webmediaApp.activeIconsCount;
                webmediaApp.setProgressFunction(uiIconsPreloadProgress);
                webmediaApp.setOnPreloadCompletedFunction(function() {
                    uiMainPreloading(false);
                });

                webmediaApp.loadIcons();
                return false;
            },
            complete: function() {},
            error: function() {}
        }); //ajax
    }

    return true;
}//end webmediaCanvasInit

function uiIconsPreloadProgress(loaded, stop) {
    //TODO again in regard to preloading
    var ths = uiIconsPreloadProgress;
    var maxCount = ths.maxCount;
    var progress = Math.floor(100*(loaded)/maxCount);
    if (progress<=0) progress = 0;
    if (progress>=100) progress = 100;

    if (stop) {
        console.log("INFO webmedia.js :: uiIconsPreloadProgress - stop is " + stop);
        webmediaAppStart();
        return;
    }
    //uiUpdatePreloadingProccess(progress);    //TODO when working on preloading
}//end uiIconsPreloadProgress

function webmediaAppStart() {
    console.log('INFO webmedia.js :: webmediaAppStart called');
    webmediaApp.enable();
    webmediaApp.run();
}//end webmediaAppStart

function webmediaCanvasReady() {
    //TODO again, cause no code, something like swfAddress
    console.log('INFO webmedia.js :: webmediaCanvasReady called');
    var hash = uiGetHash();
    var hashParts = hash.split('-');
    if (hashParts[0]!=='projects') return;          //TODO
    var code = hashParts[1];
    var icon;
    if (typeof(code)=='string' && code.length) {    //TODO
        code = code.toLowerCase();
        //icon = webmediaApp.getIconByCode(code);
        //if (icon) webmediaApp.iconClickTrigger(icon);
    }
}//end webmediaCanvasReady

function webmediaCanvasEnd() {
    console.log("INFO webmedia.js :: webmediaCanvasEnd");
    webmediaApp.resetViewMenu();
    webmediaApp.destroy();  //TODO, destroy listView? or thumbView?
}

function openOverlay(slideNumber) {
    console.log("INFO webmedia.js :: openOverlay");
    Site.toggleOverlay(slideNumber);
}

function getSlideHeader(slideNumber) {
    console.log("INFO webmedia.js :: getHeader for slide #" + slideNumber + " is " +  webmediaApp.iconsArr[slideNumber].header);
    return(webmediaApp.iconsArr[slideNumber].header);   //CHECK, emmm not slideNumber - 1, the array starts from 1 index?
}

function getSlideDesc(slideNumber) {
    //console.log("INFO webmedia.js :: getSlideDesc for slide #" + slideNumber + " is " +  webmediaApp.iconsArr[slideNumber].descTxt);
    return(webmediaApp.iconsArr[slideNumber].descTxt);
}

function getSlideLink(slideNumber) {
    //console.log("INFO webmedia.js :: getSlideLink for slide #" + slideNumber + " is " +  webmediaApp.iconsArr[slideNumber].descLnk);
    var link = webmediaApp.iconsArr[slideNumber].descLnk;
    if (link == undefined) link = "";
    //return(webmediaApp.iconsArr[slideNumber].descLnk);
    return(link);
}