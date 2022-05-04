const houseMate = require('../models/houseMate.js')
const Due = require('../models/due.js')
const Owe = require('../models/owe.js')

class PersonalExpenseManager{

    constructor(name) {
        this.houseMate = new houseMate(name);
        this.dues = {}
        //this.owes = {}
        this.totalDue = 0
       // this.totalOwe = 0
    }

    async addDue(lender, amount) {
        if(!this.dues[lender]) {
            let due = new Due(lender, amount)
            this.dues[lender] = due;
        } else {
            await this.dues[lender].updateAmount(amount, 'ADD'); 
        }
        this.totalDue = parseFloat(parseFloat(this.totalDue) + parseFloat(amount));
    } 

    async getTotalDue() {
        return this.totalDue;
    }

    async getDueOfLender(lender) {
        if(!this.dues[lender]) {
            return 0;
        } else { 
            return await this.dues[lender].getAmount()};
    }
    
    async returnDue(amount, lender) {
        const dueAmount = await this.getDueOfLender(lender);
        if(dueAmount >= amount ) {
            await this.dues[lender].updateAmount(amount, 'MINUS')
            this.totalDue = parseFloat(parseFloat(this.totalDue) - parseFloat(amount));
            return true
        }
        return false;
    }

}

module.exports =  PersonalExpenseManager;