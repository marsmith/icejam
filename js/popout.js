// imported for the popout window



//////////////////////////////////////////////////
// definitions
//////////////////////////////////////////////////
const l9_image = document.querySelector('#lock9-image');
const l7_image = document.querySelector('#lock7-image')
const l8_image = document.querySelector('#lock8-image')
const rx_image = document.querySelector('#rx-image')
const fb_image = document.querySelector('#fb-image')
const ub_image = document.querySelector('#ub-image')


function img_link(string){
    let op = "https://usgs-nims-images.s3.amazonaws.com/overlay/"
    let end = "_newest.jpg"
    let result = op.concat(string,'/', string, end)
    return(result)
}

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
// define std json; nims url keys
//////////////////////////////////////////////////
const nimsImageLinkJson = {
    'rx' : {
        'across': newest("NY_Mohawk_River_at_Rexford"),
        'ds_vw' : newest("NY_Mohawk_River_at_Rexford_View_Downstream"),
        'us_vw' : newest("NY_Mohawk_River_at_Rexford_View_Upstream"),
        'ds_zm': newest("NY_Mohawk_River_at_Rexford_View_Downstream_Zoom"),
        'us_zm': newest("NY_Mohawk_River_at_Rexford_View_Upstream_Zoom"),
        'home' : newest("NY_Mohawk_River_at_Rexford"),
        'image_div' : rx_image,
        'xs_tl' : timelapse("NY_Mohawk_River_at_Rexford"),
        'us_tl' : timelapse("NY_Mohawk_River_at_Rexford_View_Upstream"),
        'hm_tl' : timelapse("NY_Mohawk_River_at_Rexford"),
        'ds_tl' : timelapse("NY_Mohawk_River_at_Rexford_View_Downstream_Zoom"),
        'ds_zm_tl' : timelapse("NY_Mohawk_River_at_Rexford_View_Downstream_Zoom"),
        'us_zm_tl' : timelapse("NY_Mohawk_River_at_Rexford_View_Upstream_Zoom")
    },
    'ub' : {
        'across': newest('NY_Mohawk_River_at_Stockade_at_Schenectady_View_Across'),
        'us_vw' : newest('NY_Mohawk_River_at_Stockade_at_Schenectady_View_Upstream'),
        'home' : newest("NY_Mohawk_River_at_Stockade_at_Schenectady"),
        'image_div' : ub_image,
        'xs_tl' : timelapse('NY_Mohawk_River_at_Stockade_at_Schenectady_View_Across'),
        'us_tl' : timelapse('NY_Mohawk_River_at_Stockade_at_Schenectady_View_Upstream'),
        'hm_tl' : timelapse('NY_Mohawk_River_at_Stockade_at_Schenectady')
    },
    'fb' : {
        'across': newest("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Across"),
        'ds_vw' : newest("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Downstream"),
        'us_vw' : newest("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Upstream"),
        'home' : newest("NY_Mohawk_River_at_Freemans_Bridge_in_Schenectady"),
        'zoom' : newest("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Downstream_Zoom"),
        'image_div' : fb_image,
        'xs_tl' : timelapse("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Across"),
        'ds_tl' : timelapse("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Downstream"),
        'us_tl' : timelapse("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Upstream"),
        'hm_tl' : timelapse("NY_Mohawk_River_at_Freemans_Bridge_in_Schenectady"),
        'zm_tl' : timelapse("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Downstream_Zoom")
    },
    'l8' : {
        // 'ds' : newest('NY_Mohawk_River_at_Lock_8_near_Schenectady'),
        'across': newest("NY_Mohawk_River_at_Lock_8_near_Schenectady_View_Across"),
        'us_vw' : newest("NY_Mohawk_River_at_Lock_8_near_Schenectady_Upstream_View"),
        'home' : newest("NY_Mohawk_River_at_Lock_8_near_Schenectady"),
        'image_div' : l8_image,
        'xs_tl' : timelapse("NY_Mohawk_River_at_Lock_8_near_Schenectady_View_Across"),
        'us_tl' : timelapse("NY_Mohawk_River_at_Lock_8_near_Schenectady_Upstream_View"),
        'hm_tl' : timelapse("NY_Mohawk_River_at_Lock_8_near_Schenectady")
    },
    'l7' : {
        'ds_vw' : newest('NY_Mohawk_River_at_Vischer_Ferry_Dam_Lock_Downstream'),
        'us_vw' : newest('NY_Mohawk_River_at_Vischer_Ferry_Dam_Upstream'),
        'extra': newest('NY_Mohawk_River_at_Vischer_Ferry_Dam_Pier'),
        'home' : newest("NY_Mohawk_River_at_Vischer_Ferry_Dam"),
        'zoom': newest('NY_Mohawk_River_at_Vischer_Ferry_Dam_Right_Bank_View'),
        'across': newest('NY_Mohawk_River_at_Vischer_Ferry_Dam_Left_Bank'),
        'image_div' : l7_image,
        'ds_tl' : timelapse("NY_Mohawk_River_at_Vischer_Ferry_Dam_Lock_Downstream"),
        'us_tl' : timelapse("NY_Mohawk_River_at_Vischer_Ferry_Dam_Upstream"),
        'xt_tl' : timelapse("NY_Mohawk_River_at_Vischer_Ferry_Dam_Pier"),
        'hm_tl' : timelapse("NY_Mohawk_River_at_Vischer_Ferry_Dam"),
        'zm_tl' : timelapse("NY_Mohawk_River_at_Vischer_Ferry_Dam_Right_Bank_View"),
        'xs_tl' : timelapse("NY_Mohawk_River_at_Vischer_Ferry_Dam_Left_Bank")
    },
    'l9' : {
        'ds_vw' : newest("NY_MOHAWK_RIVER_AT_LOCK_9_AT_ROTTERDAM_JUNCTION_NY"),
        'us_vw' : newest("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction_Upstream"),
        'home' : newest("NY_MOHAWK_RIVER_AT_LOCK_9_AT_ROTTERDAM_JUNCTION_HOME_VIEW"),
        'zoom': newest("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction_Downstream_Zoom"),
        'across' : newest("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction"),
        'image_div' : l9_image,
        'ds_tl' : timelapse("NY_MOHAWK_RIVER_AT_LOCK_9_AT_ROTTERDAM_JUNCTION_NY"),
        'us_tl' : timelapse("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction_Upstream"),
        'hm_tl' : timelapse("NY_MOHAWK_RIVER_AT_LOCK_9_AT_ROTTERDAM_JUNCTION_HOME_VIEW"),
        'zm_tl' : timelapse("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction_Downstream_Zoom"),
        'xs_tl' : timelapse("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction")
    },
};

//////////////////////////////////////////////////
// function that pastes aws links together
//////////////////////////////////////////////////

//////////////////////////////////////////////////
// assign each view to a button
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
    var pop_extra = ''

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

// call to assign on click event
var buttons = document.getElementsByClassName('buttons')
for (var i=0; i<buttons.length; i++) {
    id = buttons[i].parentNode.id.split('-')[0] // grab api-div id
    buttons[i].addEventListener('click', populate_api_images(id)) // pop by id
}


