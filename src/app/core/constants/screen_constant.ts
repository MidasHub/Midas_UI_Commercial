
export class screenPortrait {
    angle:number=0;
    type: string = "portrait-primary";
    /** sm mean the min size of small screen */

    sm_handset: number = 359;
    md_handset: number = 360;
    lg_handset: number = 400;
    lgx_handset: number = 480;
    sm_tablet: number = 600;
    md_tablet: number = 720;
    lg_tablet: number = 840;
};

export class screenLandscape {
    type: string = "landscape-primary";
    /** sm mean the min size of small screen */
    angle:number=90;
    sm_handset: number = 599;
    md_handset: number = 600;
    lg_handset: number = 720;
    lgx_handset: number = 840;
    sm_tablet: number = 960;
    md_tablet: number = 1024;
    lg_tablet: number = 1280;
}

export class screenWindow {
    angle:number=0;
    type: string = "landscape-primary";
    /** sm mean the min size of small screen */

    xs: number = 599;
    sm: number = 600
    md: number = 1024
    lg: number = 1440;
    lgx: number = 1920;
}

