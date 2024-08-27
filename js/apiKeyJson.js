
//////////////////////////////////////////////////
// define std json; nims url keys
//////////////////////////////////////////////////
export const nimsImageLinkJson = {
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
        'across': img_link(),
        'ds' : img_link(),
        'us' : img_link(),
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


