/*
const nhentai = require('nhentai-js');
const mongoose = require('./../database/mongoose');

async function getDojinInfo(sauce) {
    // console.log(sauce)
    if(await nhentai.exists(sauce)) { // checks if doujin exists
        const dojin = await nhentai.getDoujin(sauce)
        // console.log(dojin);
        return dojin;
    } else {
        return null;
    }
}

function formResponse(dojin, subscribers) {
    let response = "";
    response += dojin.link + '\n';
    response += dojin.title + '\n';
    subscribers.forEach(sub => response += `<@${sub}> `);
    return response;
}

async function getSubscribers(tags) {
    // const subscriberSet = new Set();
    const subs = (await mongoose.findSubscribers(tags)).map(entry => entry._id);
    // console.log(subs);
    // console.log(`Subscribed subs: ${subs}`);

    return subs;
}

function tagsCleanup(tags) {
    return tags.map(tag => tag.match(/^.*?(?= \()/)[0])
}

const sixNumsRegex = /\b\d{6}\b/g;

module.exports = {
    name: 'messageCreate',
    async execute(interaction) {
        console.log(interaction);
        if (interaction.author.bot) {
            
            if ( interaction.type != 'REPLY' || interaction.author.id != process.env.CLIENT_ID || interaction.embeds.length === 0) {return;}
            else {
                var response = ""
                // console.log(interaction.embeds[0].description);
                const tags = interaction.embeds[0].description.split(/, |,/).map(x => x.toLowerCase());
                const subscribers = await getSubscribers(tags);
                console.log(`Subscribers: ${subscribers}`);
                if (subscribers.length === 0) return;
                subscribers.forEach(sub => response += `<@${sub}> `);
                interaction.reply({
                    content: response
                });
            }
        };
        let digits = interaction.content.match(sixNumsRegex)
        if (digits && interaction.type == 'DEFAULT') {
            for (const sauce in digits) {
                interaction.reply({
                    content: `https://nhentai.net/g/${digits[sauce]}`
                })
                
                // try {
                //     console.log(`Sauce: ${digits[sauce]}`);
                //     let nhentaiResponse = await getDojinInfo(digits[sauce]);
                //     console.log(nhentaiResponse);
                //     if (nhentaiResponse) {
                //         const subscribers = await getSubscribers(tagsCleanup(nhentaiResponse.details.tags));
                //         interaction.reply({
                //             content: formResponse(nhentaiResponse, subscribers)
                //         })
                //     } else {
                //         interaction.reply({
                //             content: `Doujin ${digits[sauce]} doesn't exist`
                //         })
                //     }
                // } catch (e) {
                //     console.log(e)
                // }
            }
        }
    }
}
*/


const nhentai = require('nhentai-js');
const mongoose = require('./../database/mongoose');

var cloudflareDown = true;

// const sixNumsRegex = /\b\d{6}\b/g;
// client.on('messageCreate', async (message) => {
//     if (message.author.bot) return;
//     let digits = message.content.match(sixNumsRegex)
//     if (digits) {
//         for (const sauce in digits) {
//             try {
//                 // console.log(`Sauce: ${digits[sauce]}`);
//                 let nhentaiResponse = await getDojinInfo(digits[sauce]);
//                 if (nhentaiResponse) {
//                     message.reply({
//                         content: formResponse(nhentaiResponse)
//                     })
//                 } else {
//                     message.reply({
//                         content: `Doujin ${digits[sauce]} doesn't exist`
//                     })
//                 }
//             } catch (e) {
//                 console.log(e)
//             }
//         }
//     }
// })

async function getDojinInfo(sauce) {
    // console.log(sauce)
    if(await nhentai.exists(sauce.toString())) { // checks if doujin exists
        const dojin = await nhentai.getDoujin(sauce.toString())
        // console.log(dojin);
        return dojin;
    } else {
        return null;
    }
}

function formResponse(dojin, subscribers) {
    let response = "";
    response += dojin.link + '\n';
    response += dojin.title + '\n';
    subscribers.forEach(sub => response += `<@${sub}> `);
    return response;
}

async function getSubscribers(tags) {
    tags = tagsCleanup(tags);
    // const subscriberSet = new Set();
    const subs = (await mongoose.findSubscribers(tags)).map(entry => entry._id);
    console.log(subs);
    // console.log(`Subscribed subs: ${subs}`);

    return subs;
}

function tagsCleanup(tags) {
    if (!tags) return []
    return tags.map(tag => tag.match(/^.*?(?= \()/)[0])
}

async function cloudflareDownInteraction(interaction, sauce) {
    console.log('Normal ran')
    //When cloudflare goes down, this will always result in false
    //We need to set the cloudflareDown variable to false
    //This functionality needs to be tested
    if (!(await nhentai.exists(sauce.toString()))) return false;
    let nhentaiResponse = await getDojinInfo(sauce);
    if (!nhentaiResponse) return false;
    const subscribers = await getSubscribers(nhentaiResponse.details.tags);
    interaction.reply({
        content: formResponse(nhentaiResponse, subscribers)
    })
}

async function cloudflareUpBackupInteraction(interaction) {
    console.log('Backup ran')
    if (interaction.author.bot && !cloudflareDown) {
        if ( interaction.type != 'REPLY' || interaction.author.id != process.env.CLIENT_ID || interaction.embeds.length === 0) {return;}
        else {
            var response = ""
            // console.log(interaction.embeds[0].description);
            const tags = interaction.embeds[0].description.split(/, |,/).map(x => x.toLowerCase());
            const subscribers = await getSubscribers(tags);
            console.log(`Subscribers: ${subscribers}`);
            if (subscribers.length === 0) return;
            subscribers.forEach(sub => response += `<@${sub}> `);
            interaction.reply({
                content: response
            });
        }
    }
}

/*
if (interaction.author.bot) {
        if ( interaction.type != 'REPLY' || interaction.author.id != process.env.CLIENT_ID || interaction.embeds.length === 0) {return;}
        else {
            var response = ""
            // console.log(interaction.embeds[0].description);
            const tags = interaction.embeds[0].description.split(/, |,/).map(x => x.toLowerCase());
            const subscribers = await getSubscribers(tags);
            console.log(`Subscribers: ${subscribers}`);
            if (subscribers.length === 0) return;
            subscribers.forEach(sub => response += `<@${sub}> `);
            interaction.reply({
                content: response
            });
        }
    };
    let digits = interaction.content.match(sixNumsRegex)
    if (digits && interaction.type == 'DEFAULT') {
        for (const sauce in digits) {
            interaction.reply({
                content: `https://nhentai.net/g/${digits[sauce]}`
            })
        }
    }
    */

const sixNumsRegex = /\b\d{6}\b/g;

module.exports = {
    name: 'messageCreate',
    async execute(interaction) {
        // console.log(interaction.author);
        cloudflareUpBackupInteraction(interaction);
        if (interaction.author.bot) return;
        let digits = interaction.content.match(sixNumsRegex)
        if (digits) {
            for (const index in digits) {
                let sauce = "" + +digits[index]
                try {
                   if (!cloudflareDownInteraction(interaction, sauce)) {
                        interaction.reply({
                            content: `https://nhentai.net/g/${digits[sauce]}`
                        })
                   };
                } catch (e) {
                    console.log(e)
                }
            }
        }
    },
    cloudflareDownInteraction
}