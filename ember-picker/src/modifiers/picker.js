import Picker from 'vanilla-picker';
import { tracked } from '@glimmer/tracking';
import { cached } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';
import { getOwner } from '@ember/application';
import Modifier from 'ember-modifier';

export default class PickerModifier extends Modifier {
  /**
   * The picker instance
   */
  @tracked picker;

  @cached
  get _config() {
    const config =
      getOwner(this).resolveRegistration('config:environment') || {};

    return config['ember-picker'] || {};
  }

  constructor() {
    super(...arguments);

    registerDestructor(this, () => this.picker.destroy());
  }

  /**
   * @argument parent
   * @type {HtmlElement} HTML Element
   */
  _defaultOptions(element) {
    return {
      parent: element,
    };
  }

  _getArgs(positional, named) {
    return Object.keys(named).length ? named : positional[0] || {};
  }

  _options(element, positional, named) {
    const options = this._defaultOptions(element);

    Object.assign(options, this._config, this._getArgs(positional, named));

    return options;
  }

  modify(element, positional, named) {
    if(this.picker) return;
    const options = this._options(element, positional, named);

    this.picker = new Picker(options);

    if (options.registerAPI && typeof options.registerAPI === 'function') {
      options.registerAPI(this.picker);
    }
  }
}
