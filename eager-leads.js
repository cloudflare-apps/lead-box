(function(){
  if (!document.body.addEventListener || !document.body.setAttribute || !document.body.querySelector || !document.body.classList || !document.body.classList.add) {
    return
  }

  var options, style, el, show, hide, checkScroll;

  options = INSTALL_OPTIONS;

  style = document.createElement('style');
  style.innerHTML = '' +
  '  .eager-leads .eager-leads-button {' +
  '    background: ' + options.color + ' !important' +
  '  }' +
  '  .eager-leads input.eager-leads-input:focus {' +
  '    border-color: ' + options.color + ' !important;' +
  '    box-shadow: 0 0 .0625em ' + options.color + ' !important' +
  '  }' +
  '';
  document.body.appendChild(style);

  el = document.createElement('eager-leads');
  el.className = 'eager-leads';
  el.innerHTML = '' +
  '  <div class="eager-leads-close-button"></div>' +
  '  <div class="eager-leads-content">' +
  '    <div class="eager-leads-header">' + options.headerText + '</div>' +
  '    <div class="eager-leads-body">' + options.bodyText + '</div>' +
  '    <form class="eager-leads-form">' +
  '      <div class="eager-leads-field">' +
  '        <input name="email" class="eager-leads-input" type="email" placeholder="Email address" spellcheck="false" required>' +
  '      </div>' +
  '      <div class="eager-leads-actions">' +
  '        <button type="submit" class="eager-leads-button">' + (options.buttonText || '&nbsp;') + '</button>' +
  '      </div>' +
  '    </form>' +
  '  </div>' +
  '  <div class="eager-leads-branding">' +
  '    <a class="eager-leads-branding-link" href="https://eager.io?utm_source=eager_leads_powered_by_link" target="_blank">Powered by Eager</a>' +
  '  </div>' +
  '';
  document.body.appendChild(el);

  show = function() {
    el.classList.add('eager-leads-show');
    el.classList.remove('eager-leads-hide');
    el.querySelector('input.eager-leads-input').focus();
  };

  hide = function() {
    el.classList.add('eager-leads-hide');
    el.classList.remove('eager-leads-show');
  };

  checkScroll = function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      show();
      window.removeEventListener('scroll', checkScroll);
    }
  };

  window.addEventListener('scroll', checkScroll);
  el.querySelector('.eager-leads-close-button').addEventListener('click', hide);

  // iOS :hover CSS hack
  el.addEventListener('touchstart', function(){}, false);
})();
