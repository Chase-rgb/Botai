const nhentai = require('nhentai-js')
 
async function getDoujin(id){
    try{ // try/catch is the equivalent of Promise.catch() in async/await
        const val = await nhentai.getDoujin(id)
        return val
    }catch(err){
        console.error(err);
    }
}
 
getDoujin('148936') // Object {...}