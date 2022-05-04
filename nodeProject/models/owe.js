class Owe {
    constructor(name, amount) {
        this.borrower = name;
        this.amount = amount;
    }


    async getBorrower() {
        return this.borrower;
    }

    async getAmount() {
        return this.amount;
    }

    async updateAmount(amount, action) {
        if(action == 'ADD') {
            this.amount = parseFloat(parseFloat(this.amount) + parseFloat(amount)).toFixed(0);
        } else if(action == 'MINUS') {
            this.amount= parseFloat(parseFloat(this.amount) - parseFloat(amount)).toFixed(0) ;
        }
    }
}