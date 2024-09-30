//////////////////////////////////////////////////
// definitions
//////////////////////////////////////////////////
const l9_image = document.querySelector('#lock9-image');
const l7_image = document.querySelector('#lock7-image')
const l8_image = document.querySelector('#lock8-image')
const rx_image = document.querySelector('#rx-image')
const fb_image = document.querySelector('#fb-image')
const ub_image = document.querySelector('#ub-image')

//////////////////////////////////////////////////
// function that pastes aws links together
//////////////////////////////////////////////////
function image_links(string){
    let newest = "https://usgs-nims-images.s3.amazonaws.com/overlay/"
                 .concat(string,'/', string, "_newest.jpg")
    let timelapse = "https://apps.usgs.gov/hivis/camera/".concat(string)
    return({newest, timelapse})
}
function newest(string){
    return(image_links(string).newest)
}
function timelapse(string){
    return image_links(string).timelapse
}

//////////////////////////////////////////////////
//               nims url key json              //
//////////////////////////////////////////////////
const nimsImageLinkJson = {
    'rx' : {
        'across': newest("NY_Mohawk_River_at_Rexford"),
        'ds_vw' : newest("NY_Mohawk_River_at_Rexford_View_Downstream"),
        'us_vw' : newest("NY_Mohawk_River_at_Rexford_View_Upstream"),
        'ds_zm': newest("NY_Mohawk_River_at_Rexford_View_Downstream_Zoom"),
        'zoom': newest("NY_Mohawk_River_at_Rexford_View_Upstream_Zoom"),
        'home' : newest("NY_Mohawk_River_at_Rexford"),
        'image_div' : rx_image,
        // 'xs_tl' : timelapse("NY_Mohawk_River_at_Rexford"),
        // 'us_tl' : timelapse("NY_Mohawk_River_at_Rexford_View_Upstream"),
        // 'hm_tl' : timelapse("NY_Mohawk_River_at_Rexford"),
        // 'ds_tl' : timelapse("NY_Mohawk_River_at_Rexford_View_Downstream_Zoom"),
        // 'ds_zm_tl' : timelapse("NY_Mohawk_River_at_Rexford_View_Downstream_Zoom"),
        // 'us_zm_tl' : timelapse("NY_Mohawk_River_at_Rexford_View_Upstream_Zoom")
    },
    'ub' : {
        'across': newest('NY_Mohawk_River_at_Stockade_at_Schenectady_View_Across'),
        'us_vw' : newest('NY_Mohawk_River_at_Stockade_at_Schenectady_View_Upstream'),
        'home' : newest("NY_Mohawk_River_at_Stockade_at_Schenectady"),
        'image_div' : ub_image,
        // 'xs_tl' : timelapse('NY_Mohawk_River_at_Stockade_at_Schenectady_View_Across'),
        // 'us_tl' : timelapse('NY_Mohawk_River_at_Stockade_at_Schenectady_View_Upstream'),
        // 'hm_tl' : timelapse('NY_Mohawk_River_at_Stockade_at_Schenectady')
    },
    'fb' : {
        // 'across': newest("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Across"),
        'ds_vw' : newest("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Downstream"),
        'us_vw' : newest("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Upstream"),
        'home' : newest("NY_Mohawk_River_at_Freemans_Bridge_in_Schenectady"),
        'zoom' : newest("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Downstream_Zoom"),
        'image_div' : fb_image,
        // 'xs_tl' : timelapse("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Across"),
        // 'ds_tl' : timelapse("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Downstream"),
        // 'us_tl' : timelapse("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Upstream"),
        // 'hm_tl' : timelapse("NY_Mohawk_River_at_Freemans_Bridge_in_Schenectady"),
        // 'zm_tl' : timelapse("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Downstream_Zoom")
    },
    'l8' : {
        // 'ds' : newest('NY_Mohawk_River_at_Lock_8_near_Schenectady'),
        'across': newest("NY_Mohawk_River_at_Lock_8_near_Schenectady_View_Across"),
        'us_vw' : newest("NY_Mohawk_River_at_Lock_8_near_Schenectady_Upstream_View"),
        'home' : newest("NY_Mohawk_River_at_Lock_8_near_Schenectady"),
        'image_div' : l8_image,
        // 'xs_tl' : timelapse("NY_Mohawk_River_at_Lock_8_near_Schenectady_View_Across"),
        // 'us_tl' : timelapse("NY_Mohawk_River_at_Lock_8_near_Schenectady_Upstream_View"),
        // 'hm_tl' : timelapse("NY_Mohawk_River_at_Lock_8_near_Schenectady")
    },
    'l7' : {
        'ds_vw' : newest('NY_Mohawk_River_at_Vischer_Ferry_Dam_Lock_Downstream'),
        'us_vw' : newest('NY_Mohawk_River_at_Vischer_Ferry_Dam_Upstream'),
        'pier': newest('NY_Mohawk_River_at_Vischer_Ferry_Dam_Pier'),
        'home' : newest("NY_Mohawk_River_at_Vischer_Ferry_Dam"),
        'zoom': newest('NY_Mohawk_River_at_Vischer_Ferry_Dam_Right_Bank_View'),
        'across': newest('NY_Mohawk_River_at_Vischer_Ferry_Dam_Left_Bank'),
        'image_div' : l7_image,
        // 'ds_tl' : timelapse("NY_Mohawk_River_at_Vischer_Ferry_Dam_Lock_Downstream"),
        // 'us_tl' : timelapse("NY_Mohawk_River_at_Vischer_Ferry_Dam_Upstream"),
        // 'xt_tl' : timelapse("NY_Mohawk_River_at_Vischer_Ferry_Dam_Pier"),
        // 'hm_tl' : timelapse("NY_Mohawk_River_at_Vischer_Ferry_Dam"),
        // 'zm_tl' : timelapse("NY_Mohawk_River_at_Vischer_Ferry_Dam_Right_Bank_View"),
        // 'xs_tl' : timelapse("NY_Mohawk_River_at_Vischer_Ferry_Dam_Left_Bank")
    },
    'l9' : {
        'ds_vw' : newest("NY_MOHAWK_RIVER_AT_LOCK_9_AT_ROTTERDAM_JUNCTION_NY"),
        'us_vw' : newest("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction_Upstream"),
        'home' : newest("NY_MOHAWK_RIVER_AT_LOCK_9_AT_ROTTERDAM_JUNCTION_HOME_VIEW"),
        'zoom': newest("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction_Downstream_Zoom"),
        'across' : newest("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction"),
        'image_div' : l9_image,
        // 'ds_tl' : timelapse("NY_MOHAWK_RIVER_AT_LOCK_9_AT_ROTTERDAM_JUNCTION_NY"),
        // 'us_tl' : timelapse("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction_Upstream"),
        // 'hm_tl' : timelapse("NY_MOHAWK_RIVER_AT_LOCK_9_AT_ROTTERDAM_JUNCTION_HOME_VIEW"),
        // 'zm_tl' : timelapse("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction_Downstream_Zoom"),
        // 'xs_tl' : timelapse("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction")
    },
};

//////////////////////////////////////////////////
// assign each home image
//////////////////////////////////////////////////
function pop_home_imgs(site){
    let image_div = nimsImageLinkJson[site].image_div
    let hm_img = nimsImageLinkJson[site].home
    var home_image = `<img  src=${hm_img} class="im">`
    image_div.innerHTML = home_image
}

//  populate home images
for (siteName in nimsImageLinkJson){
    pop_home_imgs(siteName)
}

//////////////////////////////////////////////////
// assign each cam view to relevant button
//////////////////////////////////////////////////
function populate_api_images(site){
    // populate home image
    let image_div = nimsImageLinkJson[site].image_div

    // instantiate button-populate variables
    var pop_home = ''
    var pop_ds = ''
    var pop_us = ''
    var pop_zoom = ''
    var pop_across = ''
    var pop_pier = ''
    var pop_dsz = ''

    // populate buttons with links
    let site_json = nimsImageLinkJson[site]
    for (var view in site_json){ 
        // ternary operators
        view.includes('across') ? pop_across = site_json[view] : 'null';
        view.includes('ds_vw') ? pop_ds = site_json[view] : 'null';
        view.includes('us_vw') ? pop_us = site_json[view] : 'null';
        view.includes('home') ? pop_home = site_json[view] : 'null';
        view.includes('zoom') ? pop_zoom = site_json[view] : 'null';
        view.includes('pier') ? pop_pier = site_json[view] : 'null';
        view.includes('ds_zm') ? pop_dsz = site_json[view] : 'null';
    };
    
    // console.log(pop_across, pop_ds, pop_us, pop_home, pop_zoom, pop_pier)

    if (site === 'l9'){
        document.querySelector("[l9-hm-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_home} class="im">`;
        });
        document.querySelector("[l9-ds-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_ds} class="im">`;
        });
        document.querySelector("[l9-us-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_us} class="im">`;
        });
        document.querySelector("[l9-xs-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_across} class="im">`;
        });
        document.querySelector("[l9-zm-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_zoom} class="im">`;
        });
    } else if (site === 'l7') {
        document.querySelector("[l7-hm-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_home} class="im">`;
        });
        document.querySelector("[l7-ds-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_ds} class="im">`;
        });
        document.querySelector("[l7-us-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_us} class="im">`;
        });
        document.querySelector("[l7-xs-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_across} class="im">`;
        });
        document.querySelector("[l7-zm-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_zoom} class="im">`;
        });
        document.querySelector("[l7-pier-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_pier} class="im">`;
        });
    } else if (site === 'l8') {
        document.querySelector("[l8-hm-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_home} class="im">`;
        });
        document.querySelector("[l8-us-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_us} class="im">`;
        });
        document.querySelector("[l8-xs-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_across} class="im">`;
        });
    } else if (site === 'rx') {
        document.querySelector("[rx-hm-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_home} class="im">`;
        });
        document.querySelector("[rx-ds-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_ds} class="im">`;
        });
        document.querySelector("[rx-us-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_us} class="im">`;
        });
        document.querySelector("[rx-dsz-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_dsz} class="im">`;
        });
        document.querySelector("[rx-zm-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_zoom} class="im">`;
        });
    } else if (site === 'ub') {
        document.querySelector("[ub-hm-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_home} class="im">`;
        });
        document.querySelector("[ub-us-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_us} class="im">`;
        });
        document.querySelector("[ub-xs-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_across} class="im">`;
        });
    } else if (site === 'fb') {
        document.querySelector("[fb-hm-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_home} class="im">`;
        });
        document.querySelector("[fb-ds-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_ds} class="im">`;
        });
        document.querySelector("[fb-us-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_us} class="im">`;
        });
        document.querySelector("[fb-zm-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_zoom} class="im">`;
        });
    }
};


///////////////////////////////////////
//   POPULATE IMAGE ON BUTTON PRESS  //
///////////////////////////////////////
function button_click_pop(){
    var buttons = document.getElementsByClassName('buttons')
    for (var i=0; i<buttons.length; i++) {
        id = buttons[i].parentNode.id.split('-')[0] // grab api-div id
        buttons[i].addEventListener('click', populate_api_images(id)) // pop by id
    }
}
button_click_pop()


//////////////////////////////////////////////////
// popup window function
//////////////////////////////////////////////////                
function openWin(site_div, input=insert_js) {
    var popup;
    // if (popup && !popup.closed) {
    if (popup) {
        popup.focus();
    } else {
        // grab site id
        id = site_div.split('-')[0]
        populate_api_images(id)

        // grab div, insert js script
        var div_inner = document.getElementById(site_div)
        div_inner.insertAdjacentHTML('beforeend', input )
        
        // define window settings, open, close
        popup = window.open('', '', 'max-width=100%, height=auto');
        // document.getElementById("div_top1").setAttribute("id", "div_top2")

        // refresh on popup close
        var timer = setInterval(function() { 
            if(popup.closed) {
                clearInterval(timer);
                window.location.reload()
            }}, 100);
        
        // handle open and close events 
        var doc = popup.document;
        var divText = div_inner.outerHTML
        doc.open();
        doc.write(divText);
        doc.close();
        }
    }

// format text to insert js and css script tags
var insert_js = `<script src=\"../js/popout.js\" type=\"text/javascript\"> </script>
<link rel=\" stylesheet \"  href=\"../styles/popout.css\" /> 
`  


// {/* <div> <a> </a> </div> */} 
