 interface BannerData {
    office: number
    title: string
};

//** Banner data */
export const bannerData: BannerData[] = [
    { office: 1, title: "Sở hữu đặc quyền +++ Giải pháp toàn diện" }, 
    { office: 2, title: "Sở hữu đặc quyền +++ Giải pháp toàn diện" }, 
    { office: 5, title: "Sở hữu đặc quyền +++ Giải pháp toàn diện" }, 
    // { office: 6, title: "80" }
]

/** Class for Banner Data */
export class ChildBannerData {
    userName: string
    title: string
};