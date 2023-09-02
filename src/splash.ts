export{};
setTimeout(() => {
  import('./main').then(({ initializeApp }) => {
    initializeApp();
  });
}, 10);
