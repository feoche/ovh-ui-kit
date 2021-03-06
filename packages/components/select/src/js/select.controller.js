import { addBooleanParameter } from '@ovh-ux/ui-kit.core/src/js/component-utils';
import get from 'lodash/get';

export default class {
  constructor($attrs, $compile, $element, $rootScope, $scope, $timeout) {
    'ngInject';

    this.$attrs = $attrs;
    this.$compile = $compile;
    this.$element = $element;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$timeout = $timeout;
  }

  $onInit() {
    addBooleanParameter(this, 'disabled');
    addBooleanParameter(this, 'inline');
    addBooleanParameter(this, 'required');
    addBooleanParameter(this, 'multiple');
    addBooleanParameter(this, 'searchable');
  }

  $postLink() {
    const $htmlContent = angular.element(this.htmlContent);

    if (this.multiple) {
      $htmlContent.attr('multiple', true);
    }

    this.$compile($htmlContent)(this.$scope, (clone) => {
      this.$element.append(clone);
    });

    this.$timeout(() => {
      this.$element
        .addClass('oui-select')
        .removeAttr('name')
        .removeAttr('title');

      if (this.inline) {
        this.$element.addClass('oui-select_inline');
      }

      if (this.$select.focusInput) {
        this.$select.focusInput
          .on('blur', () => this.onUiSelectBlur())
          .on('focus', () => this.onUiSelectFocus());
      }
    });

    // For focus from oui-field label
    this.unregisterFocus = this.$scope.$on('oui:focus', () => this.$select.setFocus());

    this.$scope.$on('oui-select:closeAll', () => {
      this.$select.close();
    });
  }

  $onDestroy() {
    if (this.unregisterFocus) {
      this.unregisterFocus();
    }
  }

  removeChoice(e, index, callback) {
    e.preventDefault();
    e.stopPropagation();

    // Call $selectMultiple.removeChoice of ui-select
    callback(index, this);
  }

  onUiSelectClick() {
    // Close others instances of oui-select before opening it
    if (!this.$select.open) {
      this.$rootScope.$broadcast('oui-select:closeAll');
    }

    if (!this.$select.focus) {
      this.$select.setFocus();
    }

    // The plugin toggle open/close by itself
    this.$select.activate();
  }

  onUiSelectChange(modelValue) {
    this.onChange({ modelValue });

    // Fix focus input (unfocus on select in multiple mode)
    if (this.multiple) {
      this.$select.setFocus();
    }
  }

  onUiSelectBlur() {
    // Fix focus property (no focusser in multiple mode)
    this.$select.focus = false;

    // Need $timeout to get the refreshed value of $select.open from UI Select
    this.$timeout(() => {
      // Since UI Select toggle focus between focusInput and searchInput
      // We need to check if the blur event is the one we really need (only in single mode)
      if (this.multiple || !this.$select.open) {
        if (this.fieldCtrl) {
          this.fieldCtrl.checkControlErrors(this.$select.$element[0], this.name);
        }

        this.onBlur();
      } else {
        this.isOpen = true;
      }
    });
  }

  onUiSelectFocus() {
    // Fix focus property (no focusser in multiple mode)
    this.$select.focus = true;

    // Need $timeout to get the refreshed value of $select.open from UI Select
    this.$timeout(() => {
      // Since UI Select toggle focus between focusInput and searchInput
      // We need to check if the focus event is the one we really need (only in single mode)
      if (this.multiple || this.$select.open || (!this.$select.open && !this.isOpen)) {
        this.onFocus();
      } else {
        this.isOpen = false;
      }
    });
  }

  onUiSelectRemove() {
    if (this.multiple) {
      this.onChange({ modelValue: this.$select.selected });
    }
  }

  getPropertyValue(item) {
    return get(item, this.match, item);
  }
}
