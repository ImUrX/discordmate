const Discord = require('discord.js');
const exec = require('util').promisify(require('child_process').exec);
const auth = require("./auth.json")
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready to do some tmate working!');
});

client.on('message', async msg => {
  if(msg.author.id === client.user.id) {
        const args = msg.content.toLowerCase().split(" ");
        if(args[0] === auth.prefix + "ssh") {
            if(args[1]) {
                console.log("Starting ssh command...");
                const sent = await msg.channel.send("Making a new socket...");
                await exec(`tmate -S /tmp/${args[1]}.sock new-session -d`);
                return sent.edit("Done!");
            }
        }
        if(args[0] === auth.prefix + "link") {
            if(args[1]) {
                console.log("Starting link command...");
                const sent = await msg.channel.send("Reading stdout...");
                const response = await exec(`tmate -S /tmp/${args[1]}.sock display -p '#{tmate_ssh}'`);
                if(response.stderr) {
                    console.log(stderr);
                    return sent.edit("An error happened, do you really have a session by the name of " + args[1] + "?");
                }
                console.log(response.stdout);
                return sent.edit(response.stdout);
            }
        }
        if(args[0] === auth.prefix + "kill") {
            if(args[1]) {
                console.log("Starting kill command...");
                const sent = await msg.channel.send("Killing a socket...");
                const response = await exec(`rm /tmp/${args[1]}.sock`)
                if(response.stderr) return sent.edit(response.stderr);
                return sent.edit("Success!");
            }
        }
    }
});

client.login(auth.token);