const PersonalExpenseManager = require('./personalExpenseManager')

class HouseExpenseManager{
    constructor(houseManager){
        this.HouseManager = houseManager;
        this.personalExpenses ={};
    }

    async moveIn(name) {
        const success = await this.HouseManager.addHouseMate(name)
        if(success) {
            this.personalExpenses[name] = new PersonalExpenseManager()
        }
    }
    async moveOut(name) {
        let found = await this.checkIfLivesInHouse(name);
        //check if exists
        if(!found){
            console.log('MEMBER_NOT_FOUND')
            return
        }
        //check if has any due
        if(await this.personalExpenses[name].getTotalDue()) {
            console.log('FAILURE')
            return
        }
        //check if owes anything from the other 2 housemates
        const allHouseMates = await this.HouseManager.getAllHouseMates()

        for(let i = 0; i<allHouseMates.length; i+=1) {
            
            if(await this.personalExpenses[allHouseMates[i]].getDueOfLender(name) >0) {
                console.log('FAILURE');
                return;
            }
        }
        //success        
        delete this.personalExpenses[name];
        await this.HouseManager.removeHouseMate(name)
        console.log('SUCCESS')
    }

    async dues(name){

        let found = await this.checkIfLivesInHouse(name)
        if(!found){
            console.log('MEMBER_NOT_FOUND')
            return
        }
        //store dues from all the housemates in an array
        let dues = [];
        const allHouseMates = await this.HouseManager.getAllHouseMates()
        for(let i = 0; i<allHouseMates.length; i+=1) {
            if(allHouseMates[i] != name)
                dues.push({amount: await this.personalExpenses[name].getDueOfLender(allHouseMates[i]), name : allHouseMates[i]})
        }
        
        dues.sort((a,b)=>{
            if(  a.amount ==  b.amount) {
                return  a.name>b.name?1:-1;
            }else return  b.amount- a.amount;
        })
            
        for(let i =0; i< dues.length; i+=1) {
            console.log(`${await dues[i].name} ${await dues[i].amount}`)
        }
    }

    async clearDue(owes, lent, amount) {
        if(!await this.checkIfLivesInHouse(owes, lent)) {
            console.log('MEMBER_NOT_FOUND')
            return
        }
        const success = await this.personalExpenses[owes].returnDue(amount, lent); 
        if(success) {
            console.log(await this.personalExpenses[owes].getDueOfLender(lent))
        } else 
            console.log('INCORRECT_PAYMENT')
    }

    async checkIfLivesInHouse(p1, p2, p3) {
        let exists1 = true, exists2 = true, exists3 = true
        exists1 = await this.HouseManager.checkHouseMateExits(p1);
        if(p2)
            exists2 = await this.HouseManager.checkHouseMateExits(p2);
        if(p3)
            exists3 = await this.HouseManager.checkHouseMateExits(p3);
            
        return (exists1&&exists2&&exists3);
    }

    async hasAnyDue(houseMate) {
        if(await this.personalExpenses[houseMate].getTotalDue() === 0) {
            return false
        }
        //check due of all housemates
        const allHouseMates = await this.HouseManager.getAllHouseMates()

        for(let i = 0; i<allHouseMates.length; i+=1) {
            const due = await this.personalExpenses[houseMate].getDueOfLender(allHouseMates[i])
            if(due >0) {
                return {lender : allHouseMates[i], lentAmout :due };
            }
        }
    }

    async addAndUpdateDues(spentBy, spentFor, share) {
         //check if the lender has any due
         let dueOfLender = await this.hasAnyDue(spentBy)

         if(!dueOfLender) {
             // lender has no due
             await this.personalExpenses[spentFor].addDue(spentBy, share);
             
         } else {
             //lender has due 
             if( dueOfLender.lentAmout> share) {
                 // lender's due is more
                 //add new due to lender's lender
                 await this.personalExpenses[spentFor].addDue(dueOfLender.lender, share);
                 //decrese due of lender
                 await this.personalExpenses[spentBy].returnDue(share, dueOfLender.lender);
 
             } else {
                 //lender's due is less or equal     
                 //return all due of lender           
                 await this.personalExpenses[spentBy].returnDue(dueOfLender.lentAmout, dueOfLender.lender);
                 //add new due to lender's lender
                 await this.personalExpenses[spentFor].addDue(dueOfLender.lender, dueOfLender.lentAmout);
                 //add excess due to the lender
                 await this.personalExpenses[spentFor].addDue(spentBy, share - dueOfLender.lentAmout);
             }
     
         }

    }

    async spend(amount, spentBy, spentFor1, spentFor2){
        
        if(!await this.checkIfLivesInHouse(spentBy, spentFor1, spentFor2)) {
            console.log('MEMBER_NOT_FOUND')
            return
        }
        const share = await spentFor2?parseFloat(amount/3):parseFloat(amount/2);

        await this.addAndUpdateDues(spentBy, spentFor1, share)
        
        if(spentFor2) {
            await this.addAndUpdateDues(spentBy, spentFor2, share)  
            //const lndr2 = await this.hasAnyDue(spentFor2);
            const dueAmount = await this.personalExpenses[spentFor2].getDueOfLender(spentFor1)
            

            if(dueAmount>0) {
                await this.personalExpenses[spentFor2].returnDue(dueAmount, spentFor1);
                await this.personalExpenses[spentFor2].addDue( spentBy , dueAmount)
                await this.personalExpenses[spentFor1].returnDue(dueAmount, spentBy)
            }
            
        }  
        
        console.log('SUCCESS')
    }

}

module.exports = HouseExpenseManager;