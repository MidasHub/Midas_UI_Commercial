 interface BannerData {
    office: number
    title: string
};

//** Banner data */
export const bannerData: BannerData[] = [
    { office: 5, title: "200" }, 
    { office: 6, title: "80" }
]

/** Class for Banner Data */
export class ChildBannerData {
    userName: string
    title: string
};