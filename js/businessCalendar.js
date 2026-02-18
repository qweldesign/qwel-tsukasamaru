/**
 * Business Calendar
 * © 2026 QWEL.DESIGN (https://qwel.design)
 * Released under the MIT License.
 * See LICENSE file for details.
 */

import Calendar from './calendar.js';

export default class BusinessCalendar extends Calendar {
  async makeCalendar(year, month) {
    super.makeCalendar(year, month);

    this.options.url ||= `${location.protocol}//${location.hostname}/`;
    this.options.delay ||= 0;
    const url = this.options.url;

    // 過去のデータをクリーン
    const today = new Date();
    let date = today.setDate(today.getDate() + this.options.delay);
    date = new Date(date).toISOString().split('T')[0];
    const postData = new FormData;
    postData.set('date', date);
    fetch(`${url}api/calendar.php?method=delete`, {
      method: 'POST',
      body: postData
    });

    // データを取得して、状態値を反映
    const res = await fetch(`${url}api/calendar.php?method=fetch&year=${year}&month=${month + 1}`);
    const data = await res.json();
    setTimeout(() => {
      this.setStatus(data);
    }, 1000); // 初回読み込み時エラー回避
  }

  handleEvents() {
    super.handleEvents();

    // モードの選択受付
    const mode = document.querySelector('.calendar__mode');
    if (!mode) return;
    mode.addEventListener('change', () => {
      if (mode.querySelector('input').value === 'momiwakame') {
        this.elem.classList.add('is-editMode');
      } else {
        this.elem.classList.remove('is-editMode');
      }
    });

    // セルのデータ操作受付
    this.body.addEventListener('click', (event) => this.cellClickHandler(event));
  }

  setStatus(data) {
    const elems = this.body.querySelectorAll('[data-date]');
    elems.forEach((td) => {
      const date = td.dataset.date;

      // 予約開始日
      const today = new Date();
      const startDate = today.setDate(today.getDate() + this.options.delay);

      // 週のデフォルト値 (予約開始日以前は)
      let state = (new Date(date) < startDate) ? 0 : 1;

      // データがあれば、状態値を上書き
      if (new Date(date) > startDate) {
        data.forEach((dt) => {
          if (dt.date == date) state = dt.state;
        });
      }

      td.dataset.state = state;
    });
  }

  cellClickHandler(event) {
    // 編集モード時のみ受付
    if (!(this.elem.classList.contains('is-editMode'))) return;

    const target = event.target;
    const date = target.dataset.date;

    // 予約開始日以前は受付しない
    const today = new Date();
    const startDate = today.setDate(today.getDate() + this.options.delay);
    if (new Date(date) < startDate) return;
    
    // 状態値を更新
    let state = target.dataset.state;
    state = (state + 1) % 3;
    target.dataset.state = state;

    // データの更新をPUT
    const url = this.options.url;

    if (date) {
      const postData = new FormData;
      postData.set('date', date);
      postData.set('state', state);

      fetch(`${url}api/calendar.php?method=insert`, {
        method: 'POST',
        body: postData
      });
    }
  }
}
