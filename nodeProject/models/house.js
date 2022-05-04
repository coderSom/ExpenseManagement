class House{

    constructor(n = 3){
        this.houseMates = [];
        this.maxHouseMates = n;
    }

    async getMaxHouseMates() {
        return this.maxHouseMates;
    }

    async setMaxHouseMates(n) {
        this.maxHouseMates = n;
    }

    async getNoOfHouseMates() {
        return this.houseMates.length;
    }

    async getHouseMates() {
        return this.houseMates;
    }
    async romoveHousemate(name) {
        const l = this.houseMates;
        for(let i = 0; i< l.length; i+=1 ){
            if( await l[i].getName() === name) {  
                this.houseMates.splice(i,1);
            }
        }
    }

    async addHouseMate(houseMate) {
        this.houseMates.push(houseMate);
    }

}


module.exports = House;