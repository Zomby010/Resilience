/**
 * contactFormBridge.js
 * -----------------------------------------------------------------------
 * Footer's service-inquiry modal and the standalone <ContactForm /> live
 * as sibling components with no shared parent state. This tiny pub/sub
 * lets the modal hand its collected Full Name + Email, plus a pre-filled
 * inquiry message, over to ContactForm — no Context provider or prop
 * drilling required, and no changes needed to whatever page component
 * renders <Footer /> and <ContactForm />.
 *
 * Footer:      publishServiceInquiry({ message, name, email })
 * ContactForm: subscribeServiceInquiry((inquiry) => { ...use it... })
 *
 * `name` and `email` are optional — pass "" or omit them and ContactForm
 * will leave those fields as the visitor already had them.
 * -----------------------------------------------------------------------
 */

const listeners = new Set();

/** Called by Footer's ServiceInquiryModal when "Continue by Email" is pressed. */
export function publishServiceInquiry({ message = "", name = "", email = "" } = {}) {
  listeners.forEach((listener) => listener({ message, name, email }));
}

/**
 * Called by ContactForm to receive inquiry messages. Returns an
 * unsubscribe function for cleanup in a useEffect.
 */
export function subscribeServiceInquiry(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}