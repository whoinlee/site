/**
 * Created by IntelliJ IDEA.
 * User: WhoIN
 * Date: 2/13/14
 * Time: 6:50 PM
 * To change this template use File | Settings | File Templates.
 */

var multimediaApp = {

    main1Content: null,
    mcontent1: null,
    mcontent2: null,
    mcontent3: null,
    mcontent4: null,

    thumb1: null,
    thumb2: null,
    thumb3: null,
    thumb4: null,

    iViewAnchor1: null,
    iViewAnchor2: null,

    selectedMenuIndex: 1,
    selectedMenu: null,
    prevMenuIndex: 0,

    thumbsCount: 0,
    thumbObjArr: [],

    dataLoaded: false,

    init: function() {
        this.initMain1Content();
        this.initMain1ThumbMenu();
        this.initMain1Anchors();
    },
    initMain1Content: function() {
        //console.log("INFO initMain1Content :: called");

        var $mcontent1 = $("#mcontent1");
        var $mcontent2 = $("#mcontent2");
        var $mcontent3 = $("#mcontent3");
        var $mcontent4 = $("#mcontent4");
        $mcontent1.css("left", "0%");
        $mcontent2.css("left", "100%");
        $mcontent3.css("left", "200%");
        $mcontent4.css("left", "300%");

        this.main1Content = $("#main1Content");
        this.main1Content.css("left", "0px");
        this.mcontent1 = $mcontent1;
        this.mcontent2 = $mcontent2;
        this.mcontent3 = $mcontent3;
        this.mcontent4 = $mcontent4;
    },
    initMain1ThumbMenu: function() {
        //console.log("INFO initMain1ThumbMenu :: called");

        this.thumb1 = $("#menuThumb1");
        this.thumb2 = $("#menuThumb2");
        this.thumb3 = $("#menuThumb3");
        this.thumb4 = $("#menuThumb4");

        //select the 1st thumb and load its content
        this.selectedMenu = $("#menuThumb1");
        this.selectedMenu.addClass("selected");
        this.selectedMenuIndex = parseInt(this.selectedMenu.attr("id").substring(9));
        this.embedNextContent();

        var ths = this;
        $('.menuThumb').click(function() {
            var index = parseInt($(this).attr("id").substring(9));  //1 based index
            if (index != ths.selectedMenuIndex) {
                var prevIndex = ths.selectedMenuIndex;
                var prevContent = ths["mcontent"+prevIndex];
                var nextContent = ths["mcontent"+index];
                ths.selectedMenu.removeClass("selected");
                ths.selectedMenuIndex = index;
                ths.selectedMenu = ths["thumb"+index];
                ths.selectedMenu.addClass("selected");
                ths.prevMenuIndex = prevIndex;
                //
                var leftLoc = (-(index - 1)*528 + "px").toString();
                ths.main1Content.animate({left: leftLoc}, 300);
                //ths.embedNextContent();
                if (prevContent)
                prevContent.animate({opacity: 0}, {duration:250, complete: function() {ths.emptyPrevContent();}});
                nextContent.animate({opacity: 1}, {duration:250, complete: function() {ths.embedNextContent();}});

                var title = getThumbTitle(index-1);
                var desc = getThumbDesc(index-1);
                $('#main1Desc .mmTitle').text(title);
                $('#main1Desc .mmDesc').text(desc);
            }
        });
    },
    initMain1Anchors: function() {
        //console.log("INFO initMain1ThumbMenu :: called");

        this.iViewAnchor1 = $("#iViewAnchor1");
        this.iViewAnchor2 = $("#iViewAnchor2");

        var ths = this;
        $('.iViewLink').click(function() {
            var index = parseInt($(this).attr("id").substring(9));  //1 or 2
            //alert("iViewLink clicked, index is " + index);
            if (index == 1) {
                Site.openInst1Overlay();
            } else {
                Site.openInst2Overlay();
            }
        });
    },
    embedNextContent: function() {
        switch (this.selectedMenuIndex) {
            case 1:
                embedLightUp();
                break;
            case 2:
                $("#mcontent3").css("border", "1px solid black");
                embedVariationBW();
                break;
            case 3:
                embedWorldMap();
                break;
            case 4:
                embedScarletLetter();
                break;
        };
    },
    emptyPrevContent: function() {
        switch (this.prevMenuIndex) {
            case 1:
                emptyLightUp();
                break;
            case 2:
                $("#mcontent3").css("border", "none");
                emptyVariationBW();
                break;
            case 3:
                emptyWorldMap();
                break;
            case 4:
                emptyScarletLetter();
                break;
        };
    },

    reset: function() {
        this.selectedMenu.removeClass("selected");
        this.prevMenuIndex = this.selectedMenuIndex;
        this.emptyPrevContent();
        var title = getThumbTitle(0);
        var desc = getThumbDesc(0);
        $('#main1Desc .mmTitle').text(title);
        $('#main1Desc .mmDesc').text(desc);
        this.selectedMenuIndex=1;
        this.selectedMenu=null;
        this.prevMenuIndex=0;
        this.mcontent1.css("left", "0%");
        this.mcontent2.css("left", "100%");
        this.mcontent3.css("left", "200%");
        this.mcontent4.css("left", "300%");
        this.mcontent1.css("opacity", "1");
        this.mcontent2.css("opacity", "0");
        this.mcontent3.css("opacity", "0");
        this.mcontent4.css("opacity", "0");
    }
};//multimediaApp

function multimediaAppInit() {
    if (multimediaApp.dataLoaded) {
        multimediaApp.init();
    } else {
        var dataUrl = 'assets/data/multidata.json';
        $.ajax({
            url: dataUrl,
            type: "post",
            dataType: "json",
            context: this,
            beforeSend: function() {
                //console.log('INFO multimediaAppInit :: beforeSend');
            },
            success: function(data) {
                if (typeof(data.thumbs)=='undefined') return false;
                var thumbObjArr, thumbObj, thumbsCount;
                thumbObjArr = [];
                thumbObj = {};
                thumbsCount  = data.thumbs.length;
                for (var i=0; i<thumbsCount; i++) {
                    thumbObj = data.thumbs[i];
                    thumbObjArr.push(thumbObj);
                }
                //console.log('INFO multimedia.js :: multimediaAppInit - thumbsCount is ' + thumbsCount);

                multimediaApp.thumbObjArr = thumbObjArr;
                multimediaApp.thumbsCount = thumbsCount;

                multimediaApp.dataLoaded = true;
                multimediaApp.init();
                return false;
            },
            complete: function() {},
            error: function() {}
        }); //ajax
    }
}

function multimediaAppReset() {
    console.log("INFO multimedia.js :: multimediaAppReset");
    multimediaApp.reset();
}

function getThumbTitle(thumbIndex) {
    console.log("INFO multimedia.js :: multimedia.js getThumbTitle for thumb #" + thumbIndex + " is\n" +  multimediaApp.thumbObjArr[thumbIndex].title);
    return(multimediaApp.thumbObjArr[thumbIndex].title);   //CHECK, emmm not slideNumber - 1, the array starts from 1 index?
}

function getThumbDesc(thumbIndex) {
    console.log("INFO multimedia.js :: getThumbDesc for thumb #" + thumbIndex + " is\n" +  multimediaApp.thumbObjArr[thumbIndex].desc);
    return(multimediaApp.thumbObjArr[thumbIndex].desc);
}

function getMSlideDetailHeader(thumbIndex, slideNumber) {
    console.log("INFO multimedia.js :: getMSlideDetailHeader for slide #" + slideNumber + " is " + multimediaApp.thumbObjArr[thumbIndex]["detailHeader"+slideNumber]);
    return(multimediaApp.thumbObjArr[thumbIndex]["detailHeader"+slideNumber]);   //CHECK, emmm not slideNumber - 1, the array starts from 1 index?
}

function getMSlideDetailDesc(thumbIndex, slideNumber) {
    console.log("INFO multimedia.js :: getMSlideDetailDesc for slide #" + slideNumber + " is " + multimediaApp.thumbObjArr[thumbIndex]["detailDesc"+slideNumber]);
    return(multimediaApp.thumbObjArr[thumbIndex]["detailDesc"+slideNumber]);
}