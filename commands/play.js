const { SlashCommandBuilder } = require('discord.js');
const { createAudioPlayer, joinVoiceChannel, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Provides information about the server.')
        .addStringOption(option =>
            option
                .setName('song')
                .setDescription('the name of the song')
        ),
    async execute(interaction, queue) {
        // interaction.guild is the object representing the Guild in which the command was run

        const playSong = (guild, song, queue) => {
            const serverQueue = queue.get(guild.id);
            if (!song) {
                serverQueue.voiceChannel.leave();
                queue.delete(guild.id);
                return;
            }
            const ytSong = ytdl(song.url)
            console.log(ytSong)
            const resource = createAudioResource(ytSong, { inlineVolume: true });
            console.log(resource)
            const player = createAudioPlayer();
            player.volume = 0.8;
            player.play(resource);

            player.on('finish', () => {
                serverQueue.songs.shift();
                playSong(guild, serverQueue.songs[0]);
            });
            serverQueue.connection.subscribe(player);
            serverQueue.playing = true;


            serverQueue.voiceChannel.send(`Now playing: **${song.title}**`);
        }

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply('You need to be in a voice channel to use this command.');
        }

        const serverQueue = queue.get(interaction.guild.id);

        const songName = interaction.options.getString('song')

        if (!songName) {
            return interaction.reply('You need provide a song name');
        }



        const { videos } = await ytSearch(songName);
        if (!videos || videos.length === 0) {
            return interaction.reply('No search results found.');
        }

        const song = {
            title: videos[0].title,
            url: videos[0].url,
        };

        if (!serverQueue) {
            const queueContruct = {
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                playing: false,
            };

            queue.set(interaction.guild.id, queueContruct);
            queueContruct.songs.push(song);
            try {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                });
                queueContruct.connection = connection;
                playSong(interaction.guild, queueContruct.songs[0], queue);
            } catch (err) {
                console.error('Error connecting to the voice channel:', err);
                queue.delete(interaction.guild.id);
                return interaction.channel.send('There was an error connecting to the voice channel.');
            }
        } else {
            serverQueue.songs.push(song);
            return interaction.channel.send(`${song.title} has been added to the queue!`);
        }

        return await interaction.channel.send(`${songName} has been added to the queue!`);
    },
};