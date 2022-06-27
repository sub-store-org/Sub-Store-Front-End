import {
  Button,
  Icon,
  Navbar,
  Tabs,
  TabPane,
  Menu,
  MenuItem,
  Popup,
  OverLay,
  Cell,
  CellGroup,
  Tabbar,
  TabbarItem,
  FixedNav,
  Drag,
  ActionSheet,
  Avatar,
  Notify,
  Empty,
} from '@nutui/nutui';

export default (app) => {
  app
    .use(Button)
    .use(Icon)
    .use(Navbar)
    .use(Tabs)
    .use(TabPane)
    .use(Menu)
    .use(MenuItem)
    .use(Popup)
    .use(OverLay)
    .use(Cell)
    .use(CellGroup)
    .use(Tabbar)
    .use(TabbarItem)
    .use(FixedNav)
    .use(Drag)
    .use(ActionSheet)
    .use(Avatar)
    .use(Notify)
    .use(Empty);
};
