import {submit} from 'email-utils/utils.js';

(function(){
  if (!window.addEventListener || !document.documentElement.setAttribute || !document.querySelector || !document.documentElement.classList || !document.documentElement.classList.add) {
    return
  }

  var options, isPreview, style, el, form, show, hide, checkScroll;

  options = INSTALL_OPTIONS;
  isPreview = INSTALL_ID == 'preview';

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

  el = document.createElement('eager-lead-box');
  el.addEventListener('touchstart', function(){}, false); // iOS :hover CSS hack
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


  form = el.querySelector('.eager-lead-box-form');
  form.addEventListener('submit', function(event){
    event.preventDefault();

    var header, body, button, email, callback;

    header = el.querySelector('.eager-lead-box-header');
    body = el.querySelector('.eager-lead-box-body');
    button = el.querySelector('button[type="submit"]');
    email = el.querySelector('input[type="email"]').value;

    if (isPreview) {
      form.parentNode.removeChild(form);
      header.innerHTML = options.successText;
      body.innerHTML = '(Form submissions are simulated during the Eager preview.)';
      return;
    }

    callback = function(ok) {
      button.removeAttribute('disabled');

      if (ok) {
        form.parentNode.removeChild(form);

        if (typeof ok == 'string') {
          body.innerHTML = ok;
        } else {
          body.parentNode.removeChild(body);
          header.innerHTML = options.successText;
        }

        setTimeout(hide, 3000);
      } else {
        body.innerHTML = 'Whoops, something didn’t work. Please try again.';
      }
    };

    submit(options, email, callback);

    button.setAttribute('disabled', 'disabled');
  });

  show = function() {
    el.classList.add('eager-lead-box-show');
    el.classList.remove('eager-lead-box-hide');
  };

  hide = function() {
    el.classList.add('eager-lead-box-hide');
    el.classList.remove('eager-lead-box-show');
  };
  el.querySelector('.eager-lead-box-close-button').addEventListener('click', hide);

  checkScroll = function() {
    if (!document.body) {
      return;
    }

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      show();

      if (!isPreview) {
        window.removeEventListener('scroll', checkScroll);
      }
    }
  };
  window.addEventListener('scroll', checkScroll);

  if (isPreview) {
    show();
  }

  document.addEventListener('DOMContentLoaded', function(){
    document.body.appendChild(style);
    document.body.appendChild(el);
  });
})();
