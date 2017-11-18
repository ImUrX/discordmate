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
      if(args[0] === auth.prefix + "tmate") {
            if(args[1]) {
                console.log("Starting tmate command...");
                const sent = await msg.channel.send("Making a new socket...");
                await exec(`tmate -S /tmp/${args[1]}.sock new-session -d`);
                const { stdout, stderr } = await exec(`tmate -S /tmp/${args[1]}.sock display -p '#{tmate_ssh}'`);
                if(stderr) {
                    console.log(stderr);
                    return sent.edit("An error happened... Did you install tmate?");
                }
                console.log("tmate session at " + args[1] + "started!");
                return sent.edit(`${stdout}`);
            }
        }
    }
});

client.login(auth.token);