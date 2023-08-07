const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Provides information about the server.'),
    async execute(interaction, queue) {
        // interaction.guild is the object representing the Guild in which the command was run

        const serverQueue = queue.get(interaction.guild.id);
        if (!serverQueue) return await interaction.reply(`no queue listed`);

        await interaction.reply(`${serverQueue.songs.map(song => song.title).join(', ')}`);
    },
};