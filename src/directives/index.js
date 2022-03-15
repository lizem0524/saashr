// 全局自定义指令
export function imageerror(el, binding) {
  // 当src为空值时直接使用指令传入的默认图片
  el.src = el.src || binding.value
  // 当src路径失效时触发onerror事件
  el.onerror = function() {
    // 加载失败时读取用户传入的地址
    el.src = binding.value
  }
  // if (!el.src) {
  //   el.src = binding.value
}
