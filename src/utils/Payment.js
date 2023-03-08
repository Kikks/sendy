import { evaluate } from 'mathjs';

export const charge = (amount) => {
  let total;

  if (amount >= 2500) {
    total = evaluate(`(${amount} + 100) / (1 - 0.015)`);
  } else {
    total = evaluate(`${amount} / (1 - 0.015)`);
  }
  return Math.ceil(total);
};

export default class Pay {
  constructor({ key, email, currency, amount, user }) {
    this.key = key || `${process.env.VUE_APP_PAYSTACK_TEST_KEY}`;
    this.email = email;
    this.currency = currency || 'NGN';
    this.amount = charge(amount);
    this.metadata = { user };
  }

  initiatePayment(callback, onClose) {
    // eslint-disable-next-line no-console
    console.log(this.metadata, this.key, this.email);
    // eslint-disable-next-line no-undef
    const handler = PaystackPop.setup({
      key: this.key,
      email: this.email,
      currency: this.currency,
      amount: Number(this.amount) * 100,
      metadata: this.metadata,
      callback,
      onClose,
    });
    handler.openIframe();
  }
}
