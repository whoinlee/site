Site = {
	global: {}
};

;(function($) {
    $(document).ready(function(){
        Site.global.main = new Site.main();

        //$("#FOOTER copyright").css("visibility", "visible");
        /*
            $("#preloading").css("display", "none");
            $("#HEADER").css("visibility", "visible");
            $("#CONTENT").css("visibility", "visible");
        */
        console.log("INFO site.js :: document.ready!!!");
    });
})(jQuery);

/*
window.onhashchange = function(e) {
   // uiOnHashChange();
    console.log("INFO site.js :: window.onhashchange");
}  */

//-- open an overlay for Webmedia
Site.toggleOverlay = function(number) {
    //toggle the overlay for webmedia slides
    console.log("INFO siteOnline.js :: Site.toggleOverlay called, number is " + number);
    //
    var overlay = $("#overlay");
    var contentHolder =  $("#overlayContentHolder");
    if (contentHolder.css("display") == "block"){
        //console.log("overlay is visible, then close/hide");
        overlay.css("display", "none");
        contentHolder.css("display", "none");
    } else {
        //console.log("overlay is invisible, then open/show");
        //console.log("INFO site.js :: Site.toggleOverlay - slidenum-"+number);
        //
        $('a[data-slidesjs-item="' + (number-1) + '"]').trigger('click');
        if (number <10) {
            $("div#slidesjs-log").css("left", '79px');
        } else {
            $("div#slidesjs-log").css("left", '74px');
        }
        var header = getSlideHeader(number);
        var desc = getSlideDesc(number);
        var link = getSlideLink(number);
        $('#slideDesc .detailHeader').text(header);
        $('#slideDesc .detailDesc a').text(desc);
        //$('#slideDesc .detailDesc a').attr('href', link);
        if (link == "") {
            link = "javascript:void(0);";
            $('#slideDesc .detailDesc a').addClass("inactive");
            $('#slideDesc .detailDesc a').attr('target', "_self");
        } else {
            $('#slideDesc .detailDesc a').removeClass("inactive");
            $('#slideDesc .detailDesc a').attr('target', "_blank");
        }
        $('#slideDesc .detailDesc a').attr('href', link);
        //
        overlay.css("display", "block");
        contentHolder.css("display", "block");
    }
}

Site.gotoSlide = function(slidenum) {
   //alert("GotoSlide::slidenum-"+slidenum);
   $('a[data-slidesjs-item="' + (slidenum-1) + '"]').trigger('click');
}

Site.main = function() {
    console.log ("INFO site.js :: Site.main called");

    //-- INITIALIZATION
    var sectionArr = ['#home', '#multimedia', '#webmedia', '#info'];
    var selectedSection = "#home";   //default
    var $menuLinks = $("#menu a");
    var $logoLink = $("logo a");
    var isScrolled = true;
    $menuLinks.click(scrollPage);
    $logoLink.click(scrollPage);

    //-- if we enter a URL containing a hash, make it active and scroll to it
    var hash = window.location.hash.toLowerCase();
    //console.log("INFO hash: " + hash);     //#multimedia
    if ((hash != "") && (hash != selectedSection)) {
        var $active = $("#menu a[href='" + hash + "']");
        $active.addClass("selected");
        $(window).load(function() {
            console.log("INFO site.js :: $window.load, calling active.click");
            $active.click();    //works only when the hash is #multimedia, #webmedia, or #info
        });
    }

    //TODO: need to separate? to outside of the main function? (refer ui.js)
    //-- when changes hash location in the browser w/o reloading
    $(window).on('hashchange', function() {
        hash = window.location.hash.toLowerCase();
        console.log("INFO site.js :: onHashChange, selectedSection is " + selectedSection);
        if ((hash != "") && (hash != selectedSection) && isScrolled) {
           // alert("selectedSection::" + selectedSection);
            if (selectedSection == "#webmedia") {
                webmediaCanvasEnd();
            } //else if (selectedSection == "#multimedia") {
                //multimediaAppReset();
            //}
            $("#menu a.selected").removeClass("selected");
            var $active = $("#menu a[href='" + hash + "']");
            $active.addClass("selected");
            if (hash == "#webmedia") $("#menu li.menu a[href='#multimedia']").addClass("selected"); //set its parent menu
            selectedSection = hash;
            isScrolled = true;
        }
    });

    //-- private functions
    var ths = this;
    function scrollPage(e) {
        if (e.preventDefault) e.preventDefault();
        var aTag = $(e.target);
        var section = aTag.attr("href").toLowerCase();
        if (section == selectedSection) return;
        // console.log("INFO site.js :: scrollPage, section is " + section + ", prevSection is " + selectedSection);
        if (section.substr(0, 4) == "http") {
            window.open(section);
            return;
        }
        if (selectedSection == "#webmedia") {
            webmediaCanvasEnd();
        } 
        // else if (selectedSection == "#multimedia") {
        //     multimediaAppReset();
        // }

        selectedSection = section;
        $menuLinks.removeClass("selected"); //remove selected from all menu
      	var isSub = aTag.attr("isSub");
        var hasSub = aTag.attr("hasSub");
        var rel = aTag.attr("rel");
        if (rel != "index") {
        	//-- if not home (logo)
        	//homeStop();	//TODO
	       /**/
	        aTag.addClass("selected");
		    if (isSub == "true") { //MULTIMEDIA or WEBMEDIA (subMenu)
	        	$("#menu li.menu a[rel='" + rel + "']").addClass("selected");  //add 'selected' to its parent menu (WORK)
	        } else if (hasSub == "true") { //WORK  (menu with subMenu)
                //console.log('INFO scrollPage :: WORK-Multimedia!!');
	         	$("#menu li.subMenu a[rel='" + rel + "'][index='0']").addClass("selected");  //add 'selected' to the first sub by default (Multimedia)
	        } 
        } else {
            console.log('INFO site.js :: scrollPage - HOME-logo!!');
        	//-- if home (logo click)
        	//homePlay();	//TODO
        }


        //-- SCROLL HANDLING
        //get the href value
        var targetLink = section.substring(1); //remove hash
        console.log('INFO site.js :: scrollPage - target div is ' + targetLink);
        //-- if there is a div on this page where id = targetLink, then scroll to it
        //TODO:: window.location.hash changes while scrolling
        if (targetLink != '') {
            isScrolled = false; //hash changes to a weird location :index.html location
            $("#main_holder").scrollTo($("#" + targetLink), 400, { easing: 'easeInOutQuint',
                onAfter: function(obj) {
                    switch (targetLink) {
                        case "webmedia":
                            emptyContactMovie();
                            webmediaCanvasInit();
                            //stopTweetFlash();
                            break;
                        case "home":
                            emptyContactMovie();
                            break;
                        case "info":
                            embedContactMovie();
                            break;
                        default:
                            console.log('INFO site.js :: scrollPage - default targetLink is: ' + targetLink);
                    }
                    window.location.hash = "#" + targetLink;
                    isScrolled = true;
                }//onAfter
            });//scrollTo
        }
        return false;
    }//scrollPage

    var manifest = [
                    "img0_05_0_BMG_529x484.jpg",
                    "img1_05_1_FirstCom_529x484.jpg",
                    "img2_05_2_KillerTracks_529x484.jpg",
                    "img3_05_3_WellTV_529x484.jpg",
                    "img4_06_0_Premarin_529x484.jpg",
                    "img5_06_1_Malibu_529x484.jpg",
                    "img6_06_2_ATT_529x484.jpg",
                    "img7_06_3_Borders_529x484.jpg",
                    "img8_07_0_FBSnowball_529x484.jpg",
                    "img9_07_1_JCP_529x484.jpg",
                    "img10_07_2_Citi_529x484.jpg",
                    "img11_07_3_TAG_529x484.jpg",
                    "img12_08_0_MaxwellHouse_529x484.jpg",
                    "img13_08_0_Slimfast_529x484.jpg",
                    "img14_08_1_Dove_529x484.jpg",
                    "img15_08_2_Enfamil_529x484.jpg",
                    "img16_08_3_IBM_529x484.jpg",
                    "img17_08_4_SlimFast_529x484.jpg",
                    "img18_09_SXR_529x484.jpg",
                    "img19_09_0_HBO_529x484.jpg",
                    "img20_09_1_SAP_529x484.jpg",
                    "img21_09_3_FMG_529x484.jpg",
                    "img22_09_4_IBMTivoli_529x484.jpg",
                    "img23_09_5_HolidayCard_529x484.jpg",
                    "img24_09_2_MH_529x484.jpg",
                    "img25_10_0_SaraLee_529x484.jpg",
                    "img26_10_1_SAPCareer_529x484.jpg",
                    "img27_10_6_TWC_529x484.jpg",
                    "img28_10_2_OgilvyYoutube_529x484.jpg",
                    "img29_10_4_Nestle_529x484.jpg",
                    "img30_10_5_SAP_529x484.jpg",
                    "img31_10_3_Factoids_529x484.jpg",
                    "img32_11_0_JED_529x484.jpg",
                    "img33_11_1_GE_529x484.jpg",
                    "img34_11_2_IBM_529x484.jpg",
                    "img35_12_0_OSIAO_529x484.jpg",
                    "img36_12_1_Subtexter_529x484.jpg",
                    "img37_13_0_FMG_529x484.jpg",
                    "img38_14_Zoetis_529x484.jpg",
                    "img39_14_Xerox_529x484.jpg"
    ];
    var preload;
    var percent;
    var map = [];

    function init() {
        reload();   //reset
        loadAll();  //calling loadAnother till manitest is empty
    }

    // Reset everything
    function reload() {
        // If there is an open preload queue, close it.
        if (preload != null) {
           preload.close();
        }

        // Push each item into our manifest
        console.log("INFO site.js :: reload, manifest.length is " + manifest.length);
        // Create a preloader. There is no manfest added to it up-front, we will add items on-demand.
        //preload = new createjs.PreloadJS();
        preload = new createjs.LoadQueue(true, "assets/image/webmedia/");
        preload.on("fileload", handleFileLoad);
        preload.on("progress", handleOverallProgress);
        //preload.on("fileprogress", handleFileProgress);
        preload.on("error", handleFileError);
        preload.setMaxConnections(5);
    }

    function loadAll() {
        //console.log("INFO site.js :: loadAll");
        while (manifest.length > 0) {
            loadAnother();
        }      
    }

    function loadAnother() {
        // Get the next manifest item, and load it
        //console.log("INFO site.js :: loadAnother, manifest.length is " + manifest.length);
        var item = manifest.shift();
        preload.loadFile(item);
    }

    // File complete handler
    function handleFileLoad(event) {
        console.log("INFO siteOnline.js :: handleFileLoad EVER??, event.item.id is " + event.item.id);
        var img = event.result;
        var endIndex = event.item.id.indexOf("_");
        var id = event.item.id.substring(3, endIndex);
        map[map.length] = {"id":id, "data":img};
        console.log("INFO site.js :: handleFileLoad EVER??, event.item.id is " + event.item.id + ", id is " + id);
        //console.log("INFO site.js :: handleFileLoad EVER??, img is " + img);

        if (preload.progress == 1) {
            console.log("INFO site.js :: handleOverallProgress, preload.progress is " + preload.progress);
            console.log("INFO site.js :: handleOverallProgress, map.length is " + map.length);

            //-- stop
            if (preload != null) {
                preload.close();
            }

            /*
            //-- setting images to DOM
            var parent = $("#slides");
            parent.append('<div class="slidesjs-container" id="slideJSContainer"></div>');
            $("#slideJSContainer").append('<div class="slidesjs-control" id="slideJSControl"></div>');
            $("#slideJSContainer").attr('style', 'overflow: hidden; position: relative; width: 529px; height: 484px;');
            $("#slideJSControl").attr('style', 'position: relative; left: 0px; width: 529px; height: 484px;');

            map.sort(sortImages);
            for(var i= 0;i<map.length;i++){
                console.log("INFO site.js :: handleOverallProgress, inside for i:" + i);
                var item = $(map[i].data);
                item.addClass('slidesjs-slide');
                item.attr('id','img'+i);
                item.attr('slidesjs-index', i+""); 
                item.attr('style', 'position: absolute; top: 0px; left: 0px; width: 100%; z-index: 0; display: none;');   
                $("#slideJSControl").append(item);
            }
            */

            //-- hide preloader, then remove
            $("#preloading").css("display", "none");
            $("#preloading").remove();

            //-- show header and content
            $("#FOOTER copyright").css("visibility", "visible");
            $("#HEADER").css("visibility", "visible");
            $("#CONTENT").css("visibility", "visible");
        }
    }

    // File progress handler
    function handleFileProgress(event) {
        console.log("INFO site.js :: handleFileProgress, event.progress is " + event.progress);
        //here you go!!!
    }

    // Overall progress handler
    function handleOverallProgress(event) {
        percent = Math.round(preload.progress * 100);
        console.log("INFO site.js :: handleOverallProgress, percent is " + percent + ", preload.progress is " + preload.progress);
        $('#preloading .value').text(percent);
        $("#FOOTER").width(percent + "%");
        //TweenMax.to($("#loadingFill"),0.2,{css:{'width':perc+'%'}});

        /* for offline testing
        if (preload.progress == 1) {
            console.log("INFO site.js :: handleOverallProgress, percent is " + percent + ", preload.progress is " + preload.progress);

            //-- stop
            if (preload != null) {
                preload.close();
            }

            //-- arrange images
            var parent = $("#slides");

            //-- hide preloader, then remove
            $("#preloading").css("display", "none");
            $("#preloading").remove();

            //-- show header and content
            $("#FOOTER copyright").css("visibility", "visible");
            $("#HEADER").css("visibility", "visible");
            $("#CONTENT").css("visibility", "visible");
        }*/
    }

    // An error happened on a file
    function handleFileError(event) {
        //console.log("INFO site.js :: handleFileError, event.item.id is " + event.item.id);
    }

    function sortImages(a, b) {
         var nameA=Number(a.id);
         var nameB=Number(b.id);
         
         if (nameA < nameB) //sort string ascending
          return -1
         if (nameA > nameB)
          return 1
         return 0 //default return value (no sorting)
    }

    init();

};//Site.main