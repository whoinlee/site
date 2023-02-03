/**
 * Created by IntelliJ IDEA.
 * User: WhoIN
 * Date: 5/21/13
 * Time: 9:26 PM
 * To change this template use File | Settings | File Templates.
 */
;(function($) {
    /*$(document).ready(function(){

        uiMenuInit();
        uiPaginationInit('newsitems-next', 'uiFetchItems');
        uiPaginationInit('newsitems-prev', 'uiFetchItems');
        uiPaginationInit('aboutitems-next', 'uiFetchItems');
        uiPaginationInit('aboutitems-prev', 'uiFetchItems');
        uiPaginationInit('lecturesitems-next', 'uiFetchItems');
        uiPaginationInit('lecturesitems-prev', 'uiFetchItems');
        uiPaginationInit('shopitems-next', 'uiFetchItems');
        uiPaginationInit('shopitems-prev', 'uiFetchItems');
        uiPaginationInit('mediaitems-next', 'uiFetchItems');
        uiPaginationInit('mediaitems-prev', 'uiFetchItems');
        uiPaginationInit('kibisiitems-next', 'uiFetchItems');
        uiPaginationInit('kibisiitems-prev', 'uiFetchItems');
        uiPaginationInit('jobsitems-next', 'uiFetchItems');
        uiPaginationInit('jobsitems-prev', 'uiFetchItems');
        uiPaginationInit('contactsitems-next', 'uiFetchItems');
        uiPaginationInit('contactsitems-prev', 'uiFetchItems');
        uiSearchInit();

        uiLazyLoadInit();
        uiLazyVideosInit();

        var hash = uiGetHash();
        var infoPgs = ['news', 'about', 'lectures', 'shop', 'media', 'kibisi', 'jobs', 'staff', 'contact', 'search'];
        var pgNameId = $.inArray(hash, infoPgs);
        var pgName = infoPgs[pgNameId];
        var $menuItem;
        if (pgNameId>-1) {
            $('#menu a').removeClass('active');
            $('#menu a.ui-'+pgName).addClass('active');
            $('#contentblock .uiContent').removeClass('uiContent').addClass('hide').hide();
            $('#canvasblock').hide();
            $('#mainblock').show();

            $('#page-'+pgName).addClass('uiContent').removeClass('hide').show();
            if (pgName=='search') $('#searchInput').blur();
        }
        if (hash=='') location.hash = '#projects';
    });*/
})(jQuery);

window.onhashchange = function(e) {
    console.log("INFO ui.js window.onhashchange");
    uiOnHashChange();
}

function uiHashChange(hash) {
    if (uiGetHash() == hash) {
        uiOnHashChange(hash);
        return;
    }
    location.hash = '#' + hash;
}

function uiOnHashChange(hash) {
    if (typeof(hash) == 'undefined') {
        hash = uiGetHash();
    }
    var menuItems = ['projects', 'news', 'about', 'lectures', 'shop', 'media', 'kibisi', 'jobs', 'staff', 'contact', 'search'];
    var ind = $.inArray(hash, menuItems);
    var $canvasblock = $('#canvasblock');
    var $canvas = $('#canvas');
    var $slideshowblock = $('#slideshowblock');

    if (ind>-1) {
        if (($canvasblock.css('display')!='none') && (ind>0)) {
            uiSwitch2Canvas(true);
        } else if ($slideshowblock.css('display')!='none') {
            if (ind>0) {
                uiSlidesFullScreen(false);
                uiSlides2Info();
            } else if (ind==0) {
                uiSlidesFullScreen(false);
                uiSlides2Canvas();
            }
        } else {
            uiMenuClick(hash);
        }
        return;
    } else {
        if ($slideshowblock.css('display')!='none') return;
        var hashParts = hash.split('-');
        if (hashParts[0]!=='projects') return;
        var code = hashParts[1];
        if (typeof(code)!='string' || !code.length) return;
        code = code.toLowerCase();
        var icon = canvasApp.getIconByCode(code);
        if (!icon) return;

        var fromGlobe = false;
        if ($canvas.css('display')=='none') {
            fromGlobe = true;
        }

        if ($canvasblock.css('display')!='none') {
            canvasApp.iconClickTrigger(icon);
        } else {
            //transition from info pages to slideshow
            uiSwitch2Canvas.onComplete = function() {
                if (fromGlobe) {
                    globeApp.setRotateCB(function() {
                        globeApp.iconFlyFromCenter(icon);
                    });
                    globeApp.disable();
                    globeApp.lookAt(icon.lat, icon.lng, true);

                } else {
                    canvasApp.enable();
                    canvasApp.iconClickTrigger(icon);
                }
            };
            uiSwitch2Canvas();
        }
    }
}

function uiCanvasReady() {
    var hash = uiGetHash();
    var hashParts = hash.split('-');
    if (hashParts[0]!=='projects') return;
    var code = hashParts[1];
    var icon;
    if (typeof(code)=='string' && code.length) {
        code = code.toLowerCase();
        icon = canvasApp.getIconByCode(code);
        if (icon) canvasApp.iconClickTrigger(icon);
    }
}

function uiGetHash() {
    return location.hash.replace(/^#/, '');
}

function uiLazyVideosInit() {
    $('a.lazyvideo').live('click', function(){
        uiLazyVideosReset();
        var $this = $(this).hide();
        $this.next().html($this.attr('data-code')).show();
        return false;
    });
}

function uiLazyVideosReset() {
    $('.uiContent a.lazyvideo').each(function(){
        var $this = $(this);
        $this.next().hide().html('');
        $this.show();
    });
}

function uiLazyLoadInit() {
    //skip_invisible: false
    $("img.lazy").lazyload({
        container: $("#contentblock"),
        effect : "fadeIn",
        load: function(el) {
            $(this).removeClass('lazy').addClass('original');
        }
    });
}

function uiLoading(stop) {
    if (stop) {
        document.body.style.cursor = 'auto';
        $('#loading').hide();
        uiIdling(stop);
    } else {
//        document.body.style.cursor = 'wait';
        uiIdling();
        $('#loading').css('opacity', '0.5');
        $('#loading').show();
    }

}

function uiIdling(stop) {
    if (stop) {
        $(document.body).removeClass('idling');
    } else {
        $(document.body).addClass('idling');
    }
}

function uiCheckIfIdling() {
    if (!$(document.body).hasClass('idling')) {
        return false;
    }
    return true;
}

function uiMainPreloadingStop() {
    canvasApp.stopPreloading();
    clearTimeout(uiMainPreloading.timeout1);
}

function uiMainPreloading(all) {
    if (canvasApp.toPreload != false) {
        canvasApp.loadSlideIconsAndThumbs();
        return;
    }

    clearTimeout(uiMainPreloading.timeout1);
    var preDiv;
    var exist = false;
    var preEntry;
    for (var i in uiMainPreloading.preloads1) {
        preEntry = uiMainPreloading.preloads1[i];
        if (!all) if (preEntry.loaded>=preEntry.toLoad) continue;
        preDiv = $('#page-'+i);
        preDiv.find('.picture img.lazy').each(function() {
            exist = true;
            $this = $(this);
            $this.unbind('load error').removeClass('lazy').addClass('original');
            $this.bind('load error', function() {
                preEntry.loaded++;
                uiMainPreloading.timeout1 = setTimeout('uiMainPreloading(false)', 5000);
            }).attr('src', $this.attr('data-original'));

            return false;
        });
        if (exist) break;
    }
    if (!exist) {
        //preloading first entries is completed
        clearTimeout(uiMainPreloading.timeout1);
        //we can start to preload another images
        uiMainPreloading.timeout1 = setTimeout("uiMainPreloading(true)", 5000); //3000
    }
}

uiMainPreloading.preloads1 = {//first preloads
    'news': {loaded: 0, toLoad: 2},
    'lectures': {loaded: 0, toLoad: 5},
    'about': {loaded: 0, toLoad: 2},
    'shop': {loaded: 0, toLoad: 5},
    'media': {loaded: 0, toLoad: 2},
    'kibisi': {loaded: 0, toLoad: 2},
    'contact': {loaded: 0, toLoad: 5}
};

function uiSwitch2Canvas(reverse) {
    var ifIdling = uiCheckIfIdling();
    if (ifIdling) return false;
    var $canvasblock = $('#canvasblock');

    if (reverse) {

    } else {
        if ($canvasblock.css('display')!='none') {

            return;
        }
    }
    $('#canvasGlobe').css('position', 'absolute').css('top', '16px');
    uiIdling();
    canvasApp.disable();
    globeApp.disable();
    var wH = $(window).height();
    var $mainblock = $('#mainblock');
    var $leftblock = $('#leftblock');
    var $contentblock = $('#contentblock');


    $leftblock.css('position', 'static');
    $mainblock.css('position', 'absolute').css('width', '100%').css('height', '100%');

    if (reverse) {
//        uiMainPreloading(false);
        $mainblock.css('top', wH+'px').show();
        $canvasblock.animate(
        {
            bottom: 16+wH
        },
        {
            duration: 500, //500
            complete: function() {
                setTimeout(uiCanvas2InfoCompleted, 50);
                return;
            },
            step: function(now, fx) {
                var d = now - fx.start;
                $mainblock.css('top', (wH-d)+'px');
            }
        });
    } else {
        $mainblock.css({top: '0px'}).show();
        $canvasblock.css('bottom', 16+wH+'px').show();

        $canvasblock.animate(
        {
            bottom: 16
        },
        {
            duration: 500, //500
            complete: function() {
                $mainblock.hide();
                $leftblock.css('position', 'fixed');
                $mainblock.css({position: 'static', width: 'auto', height: 'auto', top: 'auto'});
                $('#canvasGlobe').css('position', 'fixed').css('top', '0px');
                if (uiSwitch2Canvas.onComplete) {
                    var onComplete = uiSwitch2Canvas.onComplete;
                    delete uiSwitch2Canvas.onComplete;
                    onComplete();
                    return;
                }
                canvasApp.enable();
                globeApp.enable();
                canvasApp.onResizeDo();
                uiIdling(true);
            },
            step: function(now, fx) {
                var d = fx.start - now;
                $mainblock.css('top', d+'px');
            }
        });

    }
}

function uiCanvas2InfoCompleted() {
    var $mainblock = $('#mainblock');
    var $leftblock = $('#leftblock');
    var $contentblock = $('#contentblock');
    var $canvasblock = $('#canvasblock');
    $canvasblock.hide();
    $leftblock.css('position', 'fixed');
    $mainblock.css({position: 'static', width: 'auto', height: 'auto'});
    $contentblock.trigger("scroll");
    uiIdling(true);
    if ($('#page-search').css('display')!='none') {
        $('#searchInput').blur();
    }
}

function uiMenuClickDelay() {
    uiMenuClick(uiMenuClickDelay.itemName, true);
}

function uiMenuClick(itemName, notdelay) {
    if (uiCheckIfIdling()) return false;
    if (!notdelay) {
        uiLazyVideosReset();
        uiMenuClickDelay.itemName = itemName;
        setTimeout(uiMenuClickDelay, 50);
        return true;
    }

    var $item = $('#menu a.ui-'+itemName);
    var itemIndex = $item.parent().index();
    var prevItem = $('#menu a.active').get(0);
    var prevItemIndex = prevItem?($(prevItem.parentNode).index()):-1;

    if (itemIndex==0) {
        uiSwitch2Canvas();
        return true;
    }
    uiIdling();
    var thisNode = $("#contentblock .uiContent").get(0);
    var chgPagesEffect = 0;
    var nextNodeId = 'page-'+itemName;
    var nextNode = thisNode;

    if ((prevItemIndex>0) && (prevItemIndex!=itemIndex)) {
        nextNode = $('#'+nextNodeId).get(0);
        chgPagesEffect = itemIndex - prevItemIndex;
    }

    $('#menu a').removeClass('active');
    $item.addClass('active');
    $('#contentblock').scrollTop(0);
    if (chgPagesEffect!=0) {
        var dH = $(document).height();
        var corr = 30;
        var nodesBetween = uiGetNextSiblings((chgPagesEffect>0)?thisNode:nextNode, Math.abs(chgPagesEffect)-1);
        var nodesBetweenCount = nodesBetween.length;
        if (chgPagesEffect>0) {
            for (var i=0; i<nodesBetweenCount; i++) {
                nodesBetween[i].css('height', dH).css('overflow', 'hidden').show();
            }
            $(nextNode).show();
            $(thisNode).css('height', dH).css('overflow', 'hidden');
            $(thisNode).animate({
                marginTop: (-dH-corr)*(nodesBetweenCount+1)
            }, 500, function() {//500
                for (var i=0; i<nodesBetweenCount; i++) {
                    nodesBetween[i].hide();
                    nodesBetween[i].css('overflow', 'visible').css('height', 'auto');
                }
                $(thisNode).hide();
                $(thisNode).css('overflow', 'visible').css('height', 'auto').css('margin-top', '0');
                $(thisNode).removeClass('uiContent');
                $(nextNode).addClass('uiContent');
                $("#contentblock").trigger("scroll"); // lazy load trigger
                uiIdling(true);
                if (itemName=='search') {
                    $('#searchInput').blur();
                }
            });
        } else {
            $(nextNode).css('marginTop', (-dH-corr)*(nodesBetweenCount+1)+'px').css('height', dH).css('overflow', 'hidden').show();
            for (var i=0; i<nodesBetweenCount; i++) {
                nodesBetween[i].css('height', dH).css('overflow', 'hidden').show();
            }
            $(nextNode).animate({
                marginTop: 0
            }, 500, function() { //500
                $(thisNode).removeClass('uiContent');
                $(thisNode).hide();
                for (var i=0; i<nodesBetweenCount; i++) {
                    nodesBetween[i].hide();
                    nodesBetween[i].css('overflow', 'visible').css('height', 'auto');
                }
                $(nextNode).css('height', 'auto').css('overflow', 'visible');
                $(nextNode).addClass('uiContent');
                $("#contentblock").trigger("scroll");
                uiIdling(true);
                if (itemName=='search') {
                    $('#searchInput').blur();
                }
            });
        }
    } else {
        uiIdling(true);
    }

    return true;
}

function uiGetNextSiblings(node, count) {
    var i = 0;
    var nodesBetween = [];
    if (count<=0) return nodesBetween;
    $(node).find('~div').each(function(){
        i++;
        if (i>count) return false;
        var $this = $(this);
        nodesBetween.push($this);
    });
    return nodesBetween;
}

uiMenuClick.nodesBetween = function(nodeStart, stopNum, dH) {
    var nodesBetweenCount = 0;
    var nodesBetween = [];
    $(nodeStart).find('~div').each(function(){
        nodesBetweenCount++;
        if (nodesBetweenCount==stopNum) return false;
        var $this = $(this);
        nodesBetween.push($this);
        $this.css('height', dH).css('overflow', 'hidden').show();
    });
    nodesBetweenCount--;
    return nodesBetweenCount;
}

function uiMenuInit() {
    $('#menu a').click(function() {
        if (uiCheckIfIdling()) return false;
        var pathname = this.pathname.replace(/^\//, '' );
        var hash = uiGetHash();
        var activeItem;
        if ((hash==pathname) && !$(this).hasClass('active')) {
            activeItem = $('#menu a.active').get(0);
            if (activeItem) {
                location.hash = '#' + activeItem.pathname.replace(/^\//, '' );
            } else {
                location.hash = '';
            }
        }
        location.hash = '#'+pathname;
//        uiMenuClick(this);
        return false;
    });
    $('#canvasHide').click(function() {
        var activeMenuItem = $('#menu a.active').get(0);
        var hash = uiGetHash();
        if (hash!='projects') location.hash = '#projects';
        if (activeMenuItem) location.hash = '#' + activeMenuItem.pathname.replace(/^\//, '' );
        else location.hash = '#news';

        return false;
    });

    $('#canvasmenu a').click(function() {
        var indName = this.href.split('?');
        if (indName.length > 1) {
            indName = indName[indName.length-1];
        } else indName = null;
        var r = false;
        var fromGlobe = ($('#canvasGlobe').css('display')!='none');
        if (fromGlobe && (indName=='location')) return false;
        if (indName!='location') {
            if (fromGlobe) {
                uiFromGlobe(this, indName);
                return false;
            } else {
                $('#canvasGlobe').hide();
                $('#canvas').show();
                r = canvasApp.run(indName);
            }
            if (!r) return false;
        } else {
            //show the globe on 3D canvas
            globeApp.unsetIcons2StartPositionCB();
            globeApp.initIconsStartPosition(0, 0, canvasApp.icons);

            $('#canvas').hide();
            $('#canvasGlobe').show();
            r = globeApp.run();
        }
        if (!r) return false;
        $('#canvasmenu a').removeClass('active');
        $(this).addClass('active');

        return false;
    });
}

function uiFromGlobe(a, indName) {
    var ths = a;
    var mvD = canvasApp.moveDuration;
    canvasApp.moveDuration = 0;
    var r = canvasApp.run(indName);
    if (!r) {
        canvasApp.moveDuration = mvD;
        return false;
    }
    canvasApp.clearDisableText();
    globeApp.initIconsStartPosition(0, 0, canvasApp.icons);

    globeApp.setIcons2StartPositionCB(function() {
        globeApp.stop();
        $('#canvasGlobe').hide();
        $('#canvas').show();
        $('#canvasmenu a').removeClass('active');
        $(ths).addClass('active');
        canvasApp.runTextFadeIn();
        canvasApp.moveDuration = mvD;
    });
    globeApp.icons2StartPosition(0, 0, true);

    return false;
}

function uiPaginationInit(contName, funcName) {
    var pgntName = 'pgnt-'+contName;
    $('#'+pgntName+' a').live('click', function(){
        var pgNum = parseInt(this.title);
        if (isNaN(pgNum) || (pgNum<=0)) return false;
        var data = {};
        $('#'+pgntName+'-filter input').each(function(){
            if ($.trim(this.name)) {
                data[this.name] = this.value;
            }
        });
        window[funcName](contName, this.href, pgNum, data);
        return false;
    });
}

function uiFetchItems(containerId, href, page, data) {
    containerId = containerId.split('-')[0];

    var ifIdling = uiCheckIfIdling();
    if (ifIdling) return false;
    uiLoading();
    uiLazyVideosReset();
    $('#'+containerId).hide();
    $('#contentblock').scrollTop(0);
    $('#'+containerId).load(href, null, function(){
        uiLoading(true);
        $('#'+containerId).show();

        uiLazyLoadInit();

    });
}

//TODO:: check CSS and update
function uiUpdatePreloadingProccess(progress, stop) {
    /*
    if (stop) {
        $('#preloading').hide();
    }
    var pad = 3-progress.toString().length;
    while (pad>0) {
        progress = '' + '&nbsp;' + progress;
        pad--;
    }
    $('#preloading .value').html(progress + '%');
    */
}

function uiSearchInit() {
    $('#frmSearch').live('submit', function(e){
        e.preventDefault();
        $this = $(this);
        var ifIdling = uiCheckIfIdling();
        if (ifIdling) return false;
        uiLoading();
        uiLazyVideosReset();
        var whatVal = $('#searchInput').val();

        $('#contentblock').scrollTop(0);
        $('#searchViewItem').hide();
        $('#searchViewItem').html('');
        $('#searchitems').hide();
        $('#searchitems').html('');
        $.ajax({
            url: this.action,
            type: this.method,
            context: this,
            dataType: 'html',
            data: {what: whatVal},
            beforeSend: function() {
            },
            success: function(data) {
                $('#searchitems').html(data);
            },
            complete: function() {
                uiLoading(true);
                $('#searchitems').show();
                $("#searchInput").autocomplete('close');
            },
            error: function() {
            }
        });
        return false;
    });
    $('#frmSearch .searchIcon').live('click', function() {
       $('#frmSearch').submit();
    });

    var availableTags = [];
    $.ajax({
        url: '/search/index/popularkeywords',
        type: 'post',
        dataType: 'json',
        success: function(data) {
            availableTags = data;
            $("#searchInput").autocomplete({
                source: availableTags,
                minLength: 3,
                select: function(e, ui) {
                    this.value = ui.item.value;
                    e.preventDefault();
                    $('#frmSearch').submit();
                    return false;
                }
            });
            $('#contentblock').scroll(function() {
                $("#searchInput").autocomplete('close');
            });
        },
        complete: function() {
        }
    });

    $('#searchInput').focus(function(e){
        $this = $(this);
        if (($this.val() == $this.attr('data-default')) && ($this.hasClass('placeholder'))) {
            $this.val('');
        }
        $this.removeClass('placeholder');
    }).blur(function(e){
        $this = $(this);
        if ($this.val()=='') {
            $this.val($this.attr('data-default'));
            $this.addClass('placeholder');
        }
    });
}

function uiSearchViewItem(el) {
    var ifIdling = uiCheckIfIdling();
    if (ifIdling) return false;
    uiLoading();
    uiLazyVideosReset();

    var $el = $(el);
    var $div = $el.parent().parent();
    var id = $el.attr('data-id');
    var page = $el.attr('data-page');

    var url = $el.attr('data-url');
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'html',
        data: {item: id},
        beforeSend: function() {
        },
        success: function(data) {
            $div.hide();
            $div.before('<div class="'+page+'">'+data+'</div>');
        },
        complete: function() {
            uiLoading(true);
            $("#searchInput").autocomplete('close');
        },
        error: function() {
        }
    });

    return false;
}