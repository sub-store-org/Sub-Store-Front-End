// @ts-nocheck
import { onMounted } from 'vue';

const useMousePicker = () => {
  onMounted(() => {
    let Le;
    let bt;
    const Sn = function (t, n, o, l, s) {
      (l = l || 0),
        (s = s || 0),
        (this.identifier = n),
        (this.target = t),
        (this.clientX = o.clientX + l),
        (this.clientY = o.clientY + s),
        (this.screenX = o.screenX + l),
        (this.screenY = o.screenY + s),
        (this.pageX = o.pageX + l),
        (this.pageY = o.pageY + s);
    };

    function At() {
      const e = [];
      return (
        (e.item = function (t) {
          return this[t] || null;
        }),
        (e.identifiedTouch = function (t) {
          return this[t + 1] || null;
        }),
        e
      );
    }

    function ln(e) {
      return e.type === 'mouseup' ? At() : Cn(e);
    }

    function Cn(e) {
      const t = At();
      return t.push(new Sn(Le, 1, e, 0, 0)), t;
    }

    function gg(e, t) {
      const n = document.createEvent('Event');
      n.initEvent(e, !0, !0),
        (n.altKey = t.altKey),
        (n.ctrlKey = t.ctrlKey),
        (n.metaKey = t.metaKey),
        (n.shiftKey = t.shiftKey),
        (n.touches = ln(t)),
        (n.targetTouches = ln(t)),
        (n.changedTouches = Cn(t)),
        Le.dispatchEvent(n);
    }

    function $t(e) {
      return function (t) {
        t.type === 'mousedown' && (bt = !0),
          t.type === 'mouseup' && (bt = !1),
          !(t.type === 'mousemove' && !bt) &&
            ((t.type === 'mousedown' || !Le || (Le && !Le.dispatchEvent)) &&
              (Le = t.target),
            gg(e, t),
            t.type === 'mouseup' && (Le = null));
      };
    }

    function enableTouch() {
      window.addEventListener('mousedown', $t('touchstart'), !0),
        window.addEventListener('mousemove', $t('touchmove'), !0),
        window.addEventListener('mouseup', $t('touchend'), !0);
    }
    enableTouch();
    // export { enableTouch };
  });
};

export { useMousePicker };
