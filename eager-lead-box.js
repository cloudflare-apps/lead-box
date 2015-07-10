(function(){
  if (!document.body.addEventListener || !document.body.setAttribute || !document.body.querySelector || !document.body.classList || !document.body.classList.add) {
    return
  }

  var options, style, el, show, hide, checkScroll;

  options = INSTALL_OPTIONS;

  style = document.createElement('style');
  style.innerHTML = '' +
  ' .eager-lead-box .eager-lead-box-button {' +
  '   background: ' + options.color + ' !important' +
  ' }' +
  ' .eager-lead-box input.eager-lead-box-input:focus {' +
  '   border-color: ' + options.color + ' !important;' +
  '   box-shadow: 0 0 .0625em ' + options.color + ' !important' +
  ' }' +
  '';
  document.body.appendChild(style);

  el = document.createElement('eager-lead-box');
  el.className = 'eager-lead-box';
  el.innerHTML = '' +
  ' <div class="eager-lead-box-close-button"></div>' +
  ' <div class="eager-lead-box-content">' +
  '   <div class="eager-lead-box-header"></div>' +
  '   <div class="eager-lead-box-body"></div>' +
  '   <form class="eager-lead-box-form">' +
  '     <div class="eager-lead-box-field">' +
  '       <input name="email" class="eager-lead-box-input" type="email" placeholder="Email address" spellcheck="false" required>' +
  '     </div>' +
  '     <div class="eager-lead-box-actions">' +
  '       <button type="submit" class="eager-lead-box-button"></button>' +
  '     </div>' +
  '   </form>' +
  ' </div>' +
  ' <div class="eager-lead-box-branding">' +
  '   <a class="eager-lead-box-branding-link" href="https://eager.io?utm_source=eager_lead_box_powered_by_link" target="_blank">Powered by Eager</a>' +
  ' </div>' +
  '';
  el.querySelector('.eager-lead-box-header').appendChild(document.createTextNode(options.headerText));
  el.querySelector('.eager-lead-box-body').appendChild(document.createTextNode(options.bodyText));
  el.querySelector('.eager-lead-box-button').appendChild(document.createTextNode(options.buttonText || '&nbsp;'));
  document.body.appendChild(el);

  show = function() {
    el.classList.add('eager-lead-box-show');
    el.classList.remove('eager-lead-box-hide');
    el.querySelector('input.eager-lead-box-input').focus();
  };

  hide = function() {
    el.classList.add('eager-lead-box-hide');
    el.classList.remove('eager-lead-box-show');
  };

  checkScroll = function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      show();
      window.removeEventListener('scroll', checkScroll);
    }
  };

  window.addEventListener('scroll', checkScroll);
  el.querySelector('.eager-lead-box-close-button').addEventListener('click', hide);

  // iOS :hover CSS hack
  el.addEventListener('touchstart', function(){}, false);
})();
