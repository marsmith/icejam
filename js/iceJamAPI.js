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
function img_link(string){
    let op = "https://usgs-nims-images.s3.amazonaws.com/overlay/"
    let end = "_newest.jpg"
    let result = op.concat(string,'/', string, end)
    return(result)
}


//////////////////////////////////////////////////
//               nims url key json              //
//////////////////////////////////////////////////
const nimsImageLinkJson = {
    'rx' : {
        'across': img_link(),
        'ds' : img_link(),
        'us' : img_link(),
        'home' : img_link("NY_Mohawk_River_at_Rexford"),
        'image_div' : rx_image,
    },
    'ub' : {
        'across': img_link(),
        'ds' : img_link(),
        'us' : img_link(),
        'home' : img_link("NY_Mohawk_River_at_Stockade_at_Schenectady"),
        'image_div' : ub_image,
    },
    'fb' : {
        'across': '',
        'ds' : '',
        'us' : '',
        'home' : img_link("NY_Mohawk_River_at_Freemans_Bridge_in_Schenectady"),
        'zoom' : '',
        'image_div' : fb_image,
    },
    'l8' : {
        'ds' : img_link(),
        'across': img_link("NY_Mohawk_River_at_Lock_8_near_Schenectady_View_Across"),
        'us' : img_link("NY_Mohawk_River_at_Lock_8_near_Schenectady_Upstream_View"),
        'home' : img_link("NY_Mohawk_River_at_Lock_8_near_Schenectady"),
        'image_div' : l8_image,
    },
    'l7' : {
        'ds' : img_link('NY_Mohawk_River_at_Vischer_Ferry_Dam_Lock_Downstream'),
        'us' : img_link('NY_Mohawk_River_at_Vischer_Ferry_Dam_Upstream'),
        'extra': img_link('NY_Mohawk_River_at_Vischer_Ferry_Dam_Pier'),
        'home' : img_link("NY_Mohawk_River_at_Vischer_Ferry_Dam"),
        'zoom': img_link('NY_Mohawk_River_at_Vischer_Ferry_Dam_Right_Bank_View'),
        'across': img_link('NY_Mohawk_River_at_Vischer_Ferry_Dam_Left_Bank'),
        'image_div' : l7_image,
    },
    'l9' : {
        'ds' : img_link("NY_MOHAWK_RIVER_AT_LOCK_9_AT_ROTTERDAM_JUNCTION_NY"),
        'us' : img_link("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction_Upstream"),
        'home' : img_link("NY_MOHAWK_RIVER_AT_LOCK_9_AT_ROTTERDAM_JUNCTION_HOME_VIEW"),
        'zoom': img_link("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction_Downstream_Zoom"),
        'across' : img_link("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction"),
        'image_div' : l9_image,
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
    var pop_extra = ''

    // populate buttons with links
    let site_json = nimsImageLinkJson[site]
    for (var view in site_json){ 
        // ternary operators
        view.includes('across') ? pop_across = site_json[view] : 'null';
        view.includes('ds') ? pop_ds = site_json[view] : 'null';
        view.includes('us') ? pop_us = site_json[view] : 'null';
        view.includes('home') ? pop_home = site_json[view] : 'null';
        view.includes('zoom') ? pop_zoom = site_json[view] : 'null';
        view.includes('extra') ? pop_extra = site_json[view] : 'null';
    };
    
    // console.log(pop_across, pop_ds, pop_us, pop_home, pop_zoom, pop_extra)

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
        document.querySelector("[l7-xtra-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_extra} class="im">`;
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
        document.querySelector("[rx-xs-btn]").addEventListener('click', ()=>{
            image_div.innerHTML = `<img  src=${pop_across} class="im">`;
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
