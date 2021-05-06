interface BannerData {
  office: number;
  title: string;
}

//** Banner data */
export const bannerData: BannerData[] = [
  { office: 1, title: "..." },
  { office: 2, title: "..." },
  { office: 5, title: "..." },
  // { office: 6, title: "80" }
];

/** Class for Banner Data */
export class ChildBannerData {
  userName: string;
  title: string;
}
