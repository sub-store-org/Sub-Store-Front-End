const moveEvent = (e) => {
  e.preventDefault();
};

const allowScroll = () => {
  document.body.style.overflow = ''; //出现滚动条
  document.removeEventListener('touchmove', moveEvent, false);
};

const banScroll = () => {
  document.body.style.overflow = 'hidden';
  document.addEventListener('touchmove', moveEvent, false); //禁止页面滑动
};

export { allowScroll, banScroll };
