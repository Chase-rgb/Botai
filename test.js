const nhentai = require('nhentai-js')
const { API } = require('nhentai-api')
 
async function getDoujin(id){
    try{ // try/catch is the equivalent of Promise.catch() in async/await
        const val = await nhentai.getDoujin(id.toString())
        console.log(val)
        return val
    }catch(err){
        console.error(err);
    }
}
 
getDoujin(94317) // Object {...}

// const api = new API();
// api.search(`stockings+vtuber+"big+breasts"`).then(async result => {
//     // console.log(result)
//     console.log(`Num of books: ${result.perPage}`)
//     console.log(`Num of pages: ${result.pages}`)
//     console.log(result)
// })

// api.getRandomBook().then(async result => {
//     // console.log(result)
//     console.log(result.title)
// })