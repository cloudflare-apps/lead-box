import { submitConstantContact, submitFormspree, submitMailchimp } from '@cloudflare-apps/email-utils'
import * as renderers from './renderers'
import * as logos from './logos'

;(function () {
  'use strict'

  if (!window.addEventListener) return // Check for IE9+

  const isPreview = INSTALL_ID === 'preview'
  let options = INSTALL_OPTIONS
  let product = INSTALL_PRODUCT
  let element
  const style = document.createElement('style')

  function getMaxZIndex () {
    const elements = document.getElementsByTagName('*')
    let max = 0

    Array.prototype.slice.call(elements).forEach(function (element) {
      const zIndex = parseInt(document.defaultView.getComputedStyle(element).zIndex, 10)

      max = zIndex ? Math.max(max, zIndex) : max
    })

    return max
  }

  function delegateEmailSubmit (receiver, callback) {
    if (options.signupDestination === 'email' && options.email) {
      submitFormspree(options, receiver, callback)
    } else if (options.signupDestination === 'service') {
      if (options.account.service === 'mailchimp') {
        submitMailchimp(options, receiver, callback)
      } else if (options.account.service === 'constant-contact') {
        submitConstantContact(options, receiver, callback)
      }
    }
  }

  function hide (event) {
    if (event && event.target !== this) return

    element.setAttribute('data-visibility', 'hidden')

    window.localStorage.cfLeadBoxDimissed = JSON.stringify(options)
  }

  function show () {
    element.setAttribute('data-visibility', 'visible')
  }

  const submitHandlers = {
    signup (event) {
      event.preventDefault()

      element.setAttribute('data-form', 'submitting')

      const email = event.target.querySelector("input[name='_replyto']").value
      const submitButton = event.target.querySelector("input[type='submit']")
      submitButton.disabled = true

      delegateEmailSubmit(email, ok => {
        element.setAttribute('data-form', 'submitted')
        options.goal = 'signupSuccess'

        if (ok) {
          // setTimeout(hide, 3000)
        } else {
          options.signupSuccessTitle = 'Whoops'
          options.signupSuccessText = 'Something didn’t work. Please check your email address and try again.'
        }

        updateElement()
      })
    },
    cta (event) {
      event.preventDefault()

      if (isPreview) {
        window.location.reload()
      } else {
        window.location = options.ctaLinkAddress
      }
    },
    announcement (event) {
      event.preventDefault()

      hide()
    }
  }

  function updateStyle () {
    style.innerHTML = `
      cloudflare-app[app="lead-box"] input[type="submit"] {
        background: ${options.color};
      }

      cloudflare-app[app="lead-box"] input[type="email"]:focus {
        border-color: ${options.color};
      }
    `
  }

  function updateElement () {
    try {
      window.localStorage.cfLeadBoxShown = JSON.stringify(options)
    } catch (e) {}

    element = INSTALL.createElement({
      selector: 'body',
      method: 'append'
    }, element)

    element.setAttribute('app', 'lead-box')
    element.setAttribute('data-goal', options.goal)
    element.setAttribute('data-position', options.position)

    if (product) {
      element.setAttribute('data-product-id', product.id)
    }

    element.style.zIndex = getMaxZIndex() + 1

    const children = renderers[options.goal](options)

    function renderBranding () {
      if (!product || product.id === 'basic') {
        return `<a class="cf-branding" href="https://www.cloudflare.com/apps/" target="_blank">
          ${logos.text}
        </a>`
      }

      return ''
    }

    element.innerHTML = `
      <cf-dialog>
        <cf-dialog-content>
          <cf-dialog-close-button role="button"></cf-dialog-close-button>

          <cf-dialog-content-text>
            ${children}

            ${renderBranding()}
          </cf-dialog-content-text>
        </cf-dialog-content>
      </cf-dialog>
    `

    updateStyle()
    element.appendChild(style)

    element.querySelector('cf-dialog').addEventListener('click', hide)

    const formElement = element.querySelector('form')
    const closeButton = element.querySelector('cf-dialog-close-button')

    if (formElement) {
      formElement.addEventListener('submit', submitHandlers[options.goal])
    }

    closeButton.addEventListener('click', hide)
    element.addEventListener('click', hide)

    if (options.goal === 'signup' && options.signupDestination === 'email' && !options.email) {
      const emailInput = element.querySelector("form input[type='email']")
      const submitInput = element.querySelector("form input[type='submit']")

      element.classList.add('cf-invalid')
      emailInput.placeholder = 'Please set an email in the installer.'
      emailInput.disabled = true
      submitInput.disabled = true
    }

    setTimeout(show, parseInt(options.delay, 10))
  }

  function bootstrap () {
    const alreadyShown = window.localStorage.cfLeadBoxShown === JSON.stringify(options)
    const dimissed = window.localStorage.cfLeadBoxDimissed === JSON.stringify(options)

    if (!isPreview && options.showStrategy === 'once' && alreadyShown) return
    if (!isPreview && dimissed) return

    updateElement()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap)
  } else {
    bootstrap()
  }

  window.INSTALL_SCOPE = {
    setOptions (nextOptions) {
      options = nextOptions

      updateElement()
    },
    setColor (nextOptions) {
      options = nextOptions

      updateStyle()
    },
    setProduct (nextProduct) {
      product = nextProduct

      updateElement()
    }
  }
}())
