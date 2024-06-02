interface IIcon {
  name?: string;
  url?: string;
}
type IIconList = Array<IIcon>;

interface IIconListRes {
  icons: IIconList;
}