const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config()



const token = process.env.TOKEN

const commands = [
	new SlashCommandBuilder().setName('start').setDescription('Replies with pong!')
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationCommands(917846614259941376), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);