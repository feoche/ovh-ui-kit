import { addBooleanParameter, addDefaultParameter } from '@ovh-ux/ui-kit.core/src/js/component-utils';

const defaultLimitTo = 10;
export default class {
  constructor($attrs, $element, $timeout, ouiNavbarConfiguration) {
    'ngInject';

    this.$attrs = $attrs;
    this.$element = $element;
    this.$timeout = $timeout;
    this.translations = ouiNavbarConfiguration.translations;
  }

  // Return value of "ui-sref"
  getFullSref() {
    return `${this.state}(${JSON.stringify(this.stateParams)})`;
  }

  $onInit() {
    addDefaultParameter(this, 'limitTo', defaultLimitTo);
    addBooleanParameter(this, 'fixed');
  }

  $postLink() {
    this.$timeout(() => {
      this.$element
        .addClass('oui-navbar-menu')
        .addClass('oui-navbar-menu_notifications');

      if (this.variant) {
        this.$element.addClass(`oui-navbar-menu_${this.variant}`);
      }

      if (this.fixed) {
        this.$element.addClass('oui-navbar-menu_fixed');
      }

      if (this.placement) {
        this.$element.addClass(`oui-navbar-menu_${this.placement}`);
      }
    });
  }
}
