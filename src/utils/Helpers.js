import currencyCode from '../currency.json';

export default class Helpers {
  static isValidEmail(value) {
    const regx =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regx.test(value);
  }
  static errorResponse(error, action) {
    if (error && error.response && error.response.data) {
      action(error.response.data.message);
      return;
    }
    return action(error.message);
  }
  static assignCurrencyCode(code) {
    return currencyCode[code];
  }

  static getOriginUrl() {
    return location.origin;
  }

  static multiples(values) {
    return values.join(', ');
  }

  static isEmpty(value) {
    return (value || '').trim() === '';
  }
}
