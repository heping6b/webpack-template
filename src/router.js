var routerFn;
var aa = {
  './a': () => import('./a')
}

//  监听hash变化
window.addEventListener('hashchange', callback, false);

function callback() {
  // 获取改变后的hsah值
  console.log(location.hash);
  // 设置当前hash对应的div层显示，其他层隐藏
  // isshow(location.hash);
  console.log('执行 routerFn 函数，这里其实指的是a.js返回的函数');
  routerFn();
}

function _router(hash, path) {
  console.log(aa[path]());
  aa[path]().then(module => {
    // 修改hash值
    location.hash = hash;
    console.log(module);
    routerFn = module.default;
  });
}

export default _router;