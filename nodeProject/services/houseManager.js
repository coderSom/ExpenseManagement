const House =  require('../models/house.js')
const HouseMate =  require('../models/houseMate.js')

class HouseManager {
    constructor(){
        this.house = new House(3);
    }

    async addHouseMate( name) {
        const current = await this.house.getNoOfHouseMates()
        const max = await this.house.getMaxHouseMates()
        if(current < max) {
            const houseMate = new HouseMate(name);
            await this.house.addHouseMate(houseMate);
            console.log('SUCCESS')
            return true
        } else {
            console.log('HOUSEFUL')
            return false
        }
    }

    async checkHouseMateExits(name) {
        const l = await this.house.getHouseMates();
        for(let i = 0; i< l.length; i+=1 ){
            if( await l[i].getName() === name) {  
                return true;
            }
        }
        return false;
    }

    async removeHouseMate( name) {

        const exists = await this.checkHouseMateExits(name)
        if(exists) {
            await this.house.romoveHousemate(name);
            return true
        }
        return false;
    }

    async getAllHouseMates(){
        return (await this.house.getHouseMates()).map(a=> a.name)
    }

}

module.exports = HouseManager;