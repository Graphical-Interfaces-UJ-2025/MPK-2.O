import { defineStore } from 'pinia';
import Basic from '@/components/InfoPopUp/Basic.vue';

export const useInfoStore = defineStore('info', {
  state: () => ({
    title: '',
    icon: '',
    description: '',
    component: Basic,
    componentData: {},
    options: {},
    visible: false,
    resolve: null,
  }),
  actions: {
    showInfo({
      title,
      icon,
      description,
      component = Basic,
      componentData = {},
      options = {},
    }) {
      return new Promise((resolve) => {
        this.visible = true;
        this.title = title;
        this.icon = icon;
        this.description = description;
        this.component = component;
        this.componentData = componentData;
        this.options = options;
        this.resolve = resolve;
      });
    },
    reset() {
      if (this.resolve) {
        this.resolve();
      }
      this.visible = false;
      this.title = '';
      this.icon = '';
      this.description = '';
      this.component = Basic;
      this.componentData = {};
      this.options = {};
      this.resolve = null;
    },
  },
});
