const ExpenseManager = require("./services/houseExpenseManager.js")
const HouseManager = require("./services/houseManager.js")
const fs = require('fs')

const myHouseManager = new HouseManager();
const myExpenseManager = new ExpenseManager(myHouseManager);
requestParser();
async function createRequest(args) {
    if(args && args.length) {
        const requestType = args[0];
        switch(requestType) {
            case 'MOVE_IN' : 
                await myExpenseManager.moveIn(args[1]);
                break;
            case 'SPEND' :
                await myExpenseManager.spend( args[1], args[2], args[3], args[4]);
                break;
            case 'DUES' :
                await myExpenseManager.dues(args[1])
                break; 
            case 'CLEAR_DUE' :
                await myExpenseManager.clearDue(args[1], args[2], args[3])
                break; 
            case 'MOVE_OUT' :
                await myExpenseManager.moveOut(args[1])
                break; 
        }
    }
}
async function requestParser() { 
    const pr = await new Promise((resolve)=>{
        const filename = process.argv[2];
        fs.readFile(filename, 'utf8', async function(err, data){
        data = data.toString().split('\n');
        
        for(let i=0; i<data.length; i+=1) {
            let arr = await data[i].toString().split(' ');
            await createRequest(arr);
        }
    })
    resolve(null)
    });
    
}





