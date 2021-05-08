const clearFileInput = (ctrl: HTMLInputElement) => {
  try {
    ctrl.value = null;
  } catch(ex) { }
  if (ctrl.value) {
    ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
  }
}

export default {
  clearFileInput
}