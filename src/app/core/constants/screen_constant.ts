
export class ScreenPortrait {
    angle = 0;
    type = 'portrait-primary';
    /** sm mean the min size of small screen */

    sm_handset = 359;
    md_handset = 360;
    lg_handset = 400;
    lgx_handset = 480;
    sm_tablet = 600;
    md_tablet = 720;
    lg_tablet = 840;
}

export class ScreenLandscape {
    type = 'landscape-primary';
    /** sm mean the min size of small screen */
    angle = 90;
    sm_handset = 599;
    md_handset = 600;
    lg_handset = 720;
    lgx_handset = 840;
    sm_tablet = 960;
    md_tablet = 1024;
    lg_tablet = 1280;
}

export class ScreenWindow {
    angle = 0;
    type = 'landscape-primary';
    /** sm mean the min size of small screen */

    xs = 599;
    sm = 600;
    md = 1024;
    lg = 1440;
    lgx = 1920;
}

