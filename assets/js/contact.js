// お問い合わせフォーム
// 送信先:Googleフォーム(回答は会社のDriveのスプレッドシートにたまる)。
// FORM_ACTION と ENTRY に、Googleフォームの送信先と各項目のIDを入れると有効になる。
// 未設定のあいだは、メールソフトで送る形に切り替わる。
(function () {
  // Googleフォーム「MOTIF お問い合わせ」(2026-11-18 接続)
  var FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSdY210yWPBB_ykE5tZ7nEvdRhe1k_ROQnegwNhOSI4JHa-20w/formResponse';
  var ENTRY = { name: 'entry.757005927', company: 'entry.289713051', email: 'entry.1933674985', message: 'entry.927342805' };
  var FALLBACK_MAIL = 'akito.mizutani@motif-tokyo.com';

  var form = document.getElementById('contact-form');
  var done = document.getElementById('form-done');
  var err = document.getElementById('form-error');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = {
      name: form.name.value.trim(),
      company: form.company.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim()
    };
    var ok = v.name && v.message && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email);
    err.hidden = !!ok;
    if (!ok) return;

    if (!FORM_ACTION) {
      var body = 'お名前:' + v.name + '\n会社名:' + v.company + '\nメール:' + v.email + '\n\n' + v.message;
      location.href = 'mailto:' + FALLBACK_MAIL + '?subject=' + encodeURIComponent('MOTIFへのお問い合わせ') + '&body=' + encodeURIComponent(body);
      return;
    }
    var data = new FormData();
    Object.keys(ENTRY).forEach(function (k) { data.append(ENTRY[k], v[k]); });
    form.querySelector('button').disabled = true;
    fetch(FORM_ACTION, { method: 'POST', mode: 'no-cors', body: data })
      .then(function () { form.hidden = true; done.hidden = false; window.scrollTo({ top: 0 }); })
      .catch(function () { form.querySelector('button').disabled = false; err.textContent = '送信できませんでした。時間をおいて、もう一度お試しください。'; err.hidden = false; });
  });
})();
