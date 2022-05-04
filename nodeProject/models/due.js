class Due {
    constructor(name, amount) {
        this.lender = name;
        this.amount = amount;
    }

    async getLender() {
        return this.lender;
    }

    async getAmount() {
        return this.amount;
    }

    async updateAmount(amount, action) {
        if(action == 'ADD') {
            this.amount = parseFloat(parseFloat(this.amount) + parseFloat(amount));
        } else if(action == 'MINUS') {
            this.amount= parseFloat(parseFloat(this.amount) - parseFloat(amount));
        }
    }
    
}

module.exports =  Due;