export default class {
  constructor($element) {
    'ngInject';

    this.$element = $element;
  }

  $postLink() {
    this.rowDetailScope = this.datagridCtrl.getParentScope().$new(false);
    this.compileElement();
  }

  compileElement() {
    this.rowDetailScope.$row = this.row;

    this.datagridCtrl.rowDetailCompiledTemplate(this.rowDetailScope, (clone) => {
      this.$element.empty();
      this.$element.append(clone);
    });
  }
}
