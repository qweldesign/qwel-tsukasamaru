// Action Core
import ActionCore from './js/action-core.js';
new ActionCore.Preset();

// Fader
import Fader from './js/fader.js';
new Fader();

// Modal
import Modal from './js/modal.js';
new Modal();

// Slider
import Slider from './js/slider.js';
new Slider();

// Business Calender
import BusinessCalendar from './js/businessCalendar.js';
new BusinessCalendar({ delay: 9 });

/**
 * Auto Copyright
 * © 2026 QWEL.DESIGN (https://qwel.design)
 * Released under the MIT License.
 * See LICENSE file for details.
 */
class AutoCopyright {
  constructor(startYear, companyName, elem) {
    elem ||= document.querySelector('.footer__copyright');
    if (elem) elem.innerHTML = this.generate(startYear, companyName);
  }

  generate(startYear, companyName) {
    const currentYear = new Date().getFullYear();
    return `&copy; ${startYear} - ${currentYear} ${companyName}`;
  }
}

new AutoCopyright(2020, '海辺の農園宿 つかさ丸');
