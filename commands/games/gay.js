const { SlashCommandBuilder } = require('discord.js');
const logging = require('../../events/logging.js')
const commandName = "/gay"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gay')
        .setDescription('Rate a user based on how gay they are')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('user to rate')
                .setRequired(true)),

    async execute(interaction) {
        const gay = Math.trunc(Math.random() * 100)
        const user = ("<@" + interaction.options.getUser('user') + ">")
        try {
        if (gay == 0) {
            await interaction.reply({content: user + " is " + gay + "% Gay! Heterosexual spotted, proceeding to ban..."})
        }
        else if (gay == 100) {
            await interaction.reply({content: user + " is " + gay + "% Gay! You are extremely gay, You are literally a total gayass"})
        }
        else if (gay == 50) {
            await interaction.reply({content: user + " is " + gay + "% Gay! You aren't gay? You're bisexual!"})
        }
        else if (gay == 69) {
            await interaction.reply({content: user + " is " + gay + "% Gay! You want GAY SEX???"})
        }
        else {
            await interaction.reply({content: user + " is " + gay + "% Gay!"})
        }
    } catch {
        console.log(`[COMMAND_ERROR] There was an error running the ${commandName} command!`)
    }
        logging(commandName, interaction, gay)
    }
}
