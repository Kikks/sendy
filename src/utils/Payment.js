
export default class Pay {
    constructor({ key, email, currency, amount }){
        this.key = key || `${process.env.VUE_APP_PAYSTACK_TEST_KEY}`,
        this.email = email;
        this.currency = currency || "NGN";
        this.amount = amount;
    }

    initiatePayment (callback, onClose){
        let handler = PaystackPop.setup({
            key: this.key,
            email: this.email,
            currency: this.currency,
            amount: Number(this.amount) * 100,
            callback: callback, 
            onClose: onClose
        });
        handler.openIframe();
    };    
}
