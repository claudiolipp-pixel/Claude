/*
 * AIRBALL THEME BEHAVIOUR.
 *
 * Four custom elements and one form interception. No framework, no library:
 * everything here is a browser API, which is what the theme standards ask for
 * and what keeps the shop loading in one round trip.
 *
 * Progressive enhancement is the rule, not the aspiration. Every form on the
 * page posts to Shopify on its own and every page renders complete without
 * this file. What follows only stops the navigation and does it in place.
 */

const routes = window.Shopify?.routes?.root ?? '/';

/** Shopify returns money in cents, and Intl does the rest. */
function money(cents, currency) {
  return new Intl.NumberFormat(document.documentElement.lang || 'de', {
    style: 'currency',
    currency: currency || window.Shopify?.currency?.active || 'EUR',
  }).format(cents / 100);
}

/* -------------------------------------------------------------------------
 * The gallery
 * ---------------------------------------------------------------------- */

class ProductGallery extends HTMLElement {
  connectedCallback() {
    this.images = [...this.querySelectorAll('.gallery__image')];
    this.thumbs = [...this.querySelectorAll('[data-gallery-go]')];
    this.counter = this.querySelector('[data-gallery-current]');
    this.status = this.querySelector('[data-gallery-status]');
    this.index = 0;
    if (this.images.length < 2) return;

    this.querySelector('[data-gallery-prev]')?.addEventListener('click', () => this.go(this.index - 1));
    this.querySelector('[data-gallery-next]')?.addEventListener('click', () => this.go(this.index + 1));
    this.thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => this.go(Number(thumb.dataset.galleryGo)));
    });

    // Arrow keys, but only while the gallery has focus, so they still scroll
    // the page everywhere else.
    const frame = this.querySelector('.gallery__frame');
    frame?.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.go(this.index - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.go(this.index + 1);
      }
    });

    /*
     * Swipe. Tracked on the element rather than through a library: one
     * pointer, one threshold. The 40px floor keeps a tap from counting as a
     * swipe, and a mostly-vertical drag is left alone so the page can scroll.
     */
    let start = null;
    frame?.addEventListener('pointerdown', (event) => {
      start = { x: event.clientX, y: event.clientY };
    });
    frame?.addEventListener('pointerup', (event) => {
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      start = null;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      this.go(this.index + (dx < 0 ? 1 : -1));
    });
  }

  go(next) {
    const total = this.images.length;
    this.index = ((next % total) + total) % total;

    this.images.forEach((image, i) => {
      image.classList.toggle('is-current', i === this.index);
      image.toggleAttribute('aria-hidden', i !== this.index);
    });
    this.thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('is-current', i === this.index);
      if (i === this.index) thumb.setAttribute('aria-current', 'true');
      else thumb.removeAttribute('aria-current');
    });

    const shown = String(this.index + 1).padStart(2, '0');
    if (this.counter) this.counter.textContent = shown;
    if (this.status) this.status.textContent = this.thumbs[this.index]?.getAttribute('aria-label') ?? '';
  }
}

/* -------------------------------------------------------------------------
 * The quantity stepper
 * ---------------------------------------------------------------------- */

class QuantityStepper extends HTMLElement {
  connectedCallback() {
    this.input = this.querySelector('input');
    if (!this.input) return;

    this.querySelectorAll('[data-step]').forEach((button) => {
      button.addEventListener('click', () => {
        const step = Number(button.dataset.step);
        this.set(Number(this.input.value) + step);
      });
    });

    // Typing straight into the field has to obey the same bounds as the
    // buttons, otherwise the cart quietly clamps a number the page showed.
    this.input.addEventListener('change', () => this.set(Number(this.input.value)));
    this.sync();
  }

  set(value) {
    const min = Number(this.input.min) || 1;
    const max = Number(this.input.max) || 10;
    this.input.value = String(Math.min(Math.max(Math.round(value) || min, min), max));
    this.sync();
  }

  sync() {
    const value = Number(this.input.value);
    const min = Number(this.input.min) || 1;
    const max = Number(this.input.max) || 10;
    this.querySelector('[data-step="-1"]')?.toggleAttribute('disabled', value <= min);
    this.querySelector('[data-step="1"]')?.toggleAttribute('disabled', value >= max);
  }
}

/* -------------------------------------------------------------------------
 * The cart drawer
 * ---------------------------------------------------------------------- */

class CartDrawer extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', (event) => {
      if (event.target.closest('[data-cart-close]')) this.close();
      if (event.target.closest('[data-cart-scrim]')) this.close();

      const remove = event.target.closest('[data-cart-remove]');
      if (remove) this.update(remove.dataset.cartRemove, 0);

      const step = event.target.closest('[data-cart-step]');
      if (step) this.update(step.dataset.line, Number(step.dataset.cartStep));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.hasAttribute('open')) this.close();
    });

    document.querySelectorAll('[data-cart-open]').forEach((button) => {
      button.addEventListener('click', () => this.open());
    });

    /*
     * Back closes the drawer instead of leaving the shop. People treat a
     * full-height panel as a page and reach for Back first. One history entry
     * per opening, popped on close, so the entry never outlives the panel and
     * swallows the next Back press.
     */
    window.addEventListener('popstate', () => {
      this.pushed = false;
      if (this.hasAttribute('open')) this.hide();
    });
  }

  open() {
    this.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    if (!this.pushed) {
      history.pushState({ airballCart: true }, '');
      this.pushed = true;
    }
    this.querySelector('[data-cart-close]')?.focus();
  }

  close() {
    if (this.pushed) history.back();
    else this.hide();
  }

  hide() {
    this.removeAttribute('open');
    document.body.style.overflow = '';
  }

  /** Re-renders from the section rendering API so markup lives in Liquid. */
  async refresh() {
    const response = await fetch(`${routes}?sections=cart-drawer`);
    const data = await response.json();
    const parsed = new DOMParser().parseFromString(data['cart-drawer'], 'text/html');
    const fresh = parsed.querySelector('cart-drawer');
    if (fresh) this.innerHTML = fresh.innerHTML;
  }

  async update(line, quantity) {
    const response = await fetch(`${routes}cart/change.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ line: Number(line), quantity }),
    });
    const cart = await response.json();
    syncCount(cart.item_count);
    await this.refresh();
  }
}

/** The badge lives in the header, outside the drawer, so it is updated here. */
function syncCount(count) {
  document.querySelectorAll('[data-cart-count]').forEach((node) => {
    node.textContent = String(count);
    node.closest('[data-cart-open]')?.setAttribute('data-count', String(count));
  });
}

/*
 * Add to cart without leaving the page.
 *
 * Delegated from the document so it covers the cards on the index and the
 * product page with one listener, and so a form rendered later by the drawer
 * refresh is covered too.
 */
document.addEventListener('submit', async (event) => {
  const form = event.target.closest('form[data-cart-add]');
  if (!form) return;

  event.preventDefault();
  const button = form.querySelector('[type="submit"]');
  button?.setAttribute('disabled', '');

  try {
    const response = await fetch(`${routes}cart/add.js`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    });
    if (!response.ok) throw new Error(String(response.status));

    const drawer = document.querySelector('cart-drawer');
    await drawer?.refresh();
    const cart = await (await fetch(`${routes}cart.js`)).json();
    syncCount(cart.item_count);
    drawer?.open();
  } catch {
    // Anything unexpected falls back to the plain form post, which works
    // without JavaScript and takes the buyer to the cart page. A failed add
    // must never end as silence.
    form.submit();
  } finally {
    button?.removeAttribute('disabled');
  }
});

customElements.define('product-gallery', ProductGallery);
customElements.define('quantity-stepper', QuantityStepper);
customElements.define('cart-drawer', CartDrawer);

export { money };
