


class HouseMate{
    constructor(name, house) {
        this.name = name;
       
    }


    async getName() {
        return this.name;
    }
    async setName(name) {
        this.name = name;
    }

}
module.exports = HouseMate;