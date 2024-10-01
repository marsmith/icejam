
//////////////////////////////////////////////////
// define std json; nims url keys
//////////////////////////////////////////////////
export const nimsImageLinkJson = {
    'rx' : {
        'across': newest("NY_Mohawk_River_at_Rexford"),
        'ds_vw' : newest("NY_Mohawk_River_at_Rexford_View_Downstream"),
        'us_vw' : newest("NY_Mohawk_River_at_Rexford_View_Upstream"),
        'ds_zm': newest("NY_Mohawk_River_at_Rexford_View_Downstream_Zoom"),
        'zoom': newest("NY_Mohawk_River_at_Rexford_View_Upstream_Zoom"),
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
        // 'across': newest("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Across"),
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
        'pier': newest('NY_Mohawk_River_at_Vischer_Ferry_Dam_Pier'),
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

// if saving as .json, use the following
// [{
//     'rx' : {
//         'across': newest("NY_Mohawk_River_at_Rexford"),
//         'ds_vw' : newest("NY_Mohawk_River_at_Rexford_View_Downstream"),
//         'us_vw' : newest("NY_Mohawk_River_at_Rexford_View_Upstream"),
//         'ds_zm': newest("NY_Mohawk_River_at_Rexford_View_Downstream_Zoom"),
//         'zoom': newest("NY_Mohawk_River_at_Rexford_View_Upstream_Zoom"),
//         'home' : newest("NY_Mohawk_River_at_Rexford"),
//         'image_div' : rx_image,
//         'xs_tl' : timelapse("NY_Mohawk_River_at_Rexford"),
//         'us_tl' : timelapse("NY_Mohawk_River_at_Rexford_View_Upstream"),
//         'hm_tl' : timelapse("NY_Mohawk_River_at_Rexford"),
//         'ds_tl' : timelapse("NY_Mohawk_River_at_Rexford_View_Downstream_Zoom"),
//         'ds_zm_tl' : timelapse("NY_Mohawk_River_at_Rexford_View_Downstream_Zoom"),
//         'us_zm_tl' : timelapse("NY_Mohawk_River_at_Rexford_View_Upstream_Zoom")
//     },
//     'ub' : {
//         'across': newest('NY_Mohawk_River_at_Stockade_at_Schenectady_View_Across'),
//         'us_vw' : newest('NY_Mohawk_River_at_Stockade_at_Schenectady_View_Upstream'),
//         'home' : newest("NY_Mohawk_River_at_Stockade_at_Schenectady"),
//         'image_div' : ub_image,
//         'xs_tl' : timelapse('NY_Mohawk_River_at_Stockade_at_Schenectady_View_Across'),
//         'us_tl' : timelapse('NY_Mohawk_River_at_Stockade_at_Schenectady_View_Upstream'),
//         'hm_tl' : timelapse('NY_Mohawk_River_at_Stockade_at_Schenectady')
//     },
//     'fb' : {
//         // 'across': newest("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Across"),
//         'ds_vw' : newest("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Downstream"),
//         'us_vw' : newest("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Upstream"),
//         'home' : newest("NY_Mohawk_River_at_Freemans_Bridge_in_Schenectady"),
//         'zoom' : newest("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Downstream_Zoom"),
//         'image_div' : fb_image,
//         'xs_tl' : timelapse("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Across"),
//         'ds_tl' : timelapse("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Downstream"),
//         'us_tl' : timelapse("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Upstream"),
//         'hm_tl' : timelapse("NY_Mohawk_River_at_Freemans_Bridge_in_Schenectady"),
//         'zm_tl' : timelapse("NY_Mohawk_River_at_Freemans_Bridge_at_Schenectady_View_Downstream_Zoom")
//     },
//     'l8' : {
//         // 'ds' : newest('NY_Mohawk_River_at_Lock_8_near_Schenectady'),
//         'across': newest("NY_Mohawk_River_at_Lock_8_near_Schenectady_View_Across"),
//         'us_vw' : newest("NY_Mohawk_River_at_Lock_8_near_Schenectady_Upstream_View"),
//         'home' : newest("NY_Mohawk_River_at_Lock_8_near_Schenectady"),
//         'image_div' : l8_image,
//         'xs_tl' : timelapse("NY_Mohawk_River_at_Lock_8_near_Schenectady_View_Across"),
//         'us_tl' : timelapse("NY_Mohawk_River_at_Lock_8_near_Schenectady_Upstream_View"),
//         'hm_tl' : timelapse("NY_Mohawk_River_at_Lock_8_near_Schenectady")
//     },
//     'l7' : {
//         'ds_vw' : newest('NY_Mohawk_River_at_Vischer_Ferry_Dam_Lock_Downstream'),
//         'us_vw' : newest('NY_Mohawk_River_at_Vischer_Ferry_Dam_Upstream'),
//         'pier': newest('NY_Mohawk_River_at_Vischer_Ferry_Dam_Pier'),
//         'home' : newest("NY_Mohawk_River_at_Vischer_Ferry_Dam"),
//         'zoom': newest('NY_Mohawk_River_at_Vischer_Ferry_Dam_Right_Bank_View'),
//         'across': newest('NY_Mohawk_River_at_Vischer_Ferry_Dam_Left_Bank'),
//         'image_div' : l7_image,
//         'ds_tl' : timelapse("NY_Mohawk_River_at_Vischer_Ferry_Dam_Lock_Downstream"),
//         'us_tl' : timelapse("NY_Mohawk_River_at_Vischer_Ferry_Dam_Upstream"),
//         'xt_tl' : timelapse("NY_Mohawk_River_at_Vischer_Ferry_Dam_Pier"),
//         'hm_tl' : timelapse("NY_Mohawk_River_at_Vischer_Ferry_Dam"),
//         'zm_tl' : timelapse("NY_Mohawk_River_at_Vischer_Ferry_Dam_Right_Bank_View"),
//         'xs_tl' : timelapse("NY_Mohawk_River_at_Vischer_Ferry_Dam_Left_Bank")
//     },
//     'l9' : {
//         'ds_vw' : newest("NY_MOHAWK_RIVER_AT_LOCK_9_AT_ROTTERDAM_JUNCTION_NY"),
//         'us_vw' : newest("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction_Upstream"),
//         'home' : newest("NY_MOHAWK_RIVER_AT_LOCK_9_AT_ROTTERDAM_JUNCTION_HOME_VIEW"),
//         'zoom': newest("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction_Downstream_Zoom"),
//         'across' : newest("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction"),
//         'image_div' : l9_image,
//         'ds_tl' : timelapse("NY_MOHAWK_RIVER_AT_LOCK_9_AT_ROTTERDAM_JUNCTION_NY"),
//         'us_tl' : timelapse("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction_Upstream"),
//         'hm_tl' : timelapse("NY_MOHAWK_RIVER_AT_LOCK_9_AT_ROTTERDAM_JUNCTION_HOME_VIEW"),
//         'zm_tl' : timelapse("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction_Downstream_Zoom"),
//         'xs_tl' : timelapse("NY_Mohawk_River_at_Lock_9_at_Rotterdam_Junction")
//     },
// }]
