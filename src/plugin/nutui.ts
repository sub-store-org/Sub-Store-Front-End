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
    .use(CellGroup);
};
