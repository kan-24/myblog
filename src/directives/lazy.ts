import type { DirectiveBinding, ObjectDirective } from 'vue';

const lazy: ObjectDirective<HTMLImageElement, string> = {
  mounted(el, binding: DirectiveBinding<string>) {
    const loadImage = () => {
      if (binding.value) {
        el.src = binding.value;
      }
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          loadImage();
          observer.disconnect();
        }
      });
      observer.observe(el);
    } else {
      loadImage();
    }
  }
};

export default lazy;
