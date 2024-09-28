const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const config = require('../config.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tweet')
    .setDescription('Send an anonymous message to the tweet channel')
    .addStringOption(option => option.setName('message').setDescription('The message to send').setRequired(true)),
  async execute(interaction) {
    const message = interaction.options.getString('message');
    const channel = interaction.client.channels.cache.get(config.tweetChannelId);

    if (!channel) {
      console.error('Tweet channel not found!');
      return;
    }

    let count = await getCount();

    const darkColors = [
      0x1A1D23, // Dark gray
      0x2C2F33, // Dark gray-blue
      0x3B3F4E, // Dark blue-gray
      0x434A54, // Dark gray-purple
      0x4C5154, // Dark gray-brown
      0x5C5F66, // Dark gray-green
    ];

    const randomColor = darkColors[Math.floor(Math.random() * darkColors.length)];
    const embed = new EmbedBuilder()
      .setTitle(` Anonymous Message ( #${count} )`)
      .setDescription(message)
      .setColor(randomColor)
      .setFooter({ text: '❗ If this Anonymous Message is ToS-breaking or overtly hateful, you can report it to the admins'});

    const sentMessage = await channel.send({ embeds: [embed] });
    await interaction.deferReply({ ephemeral: true });

    count++;
    await saveCount(count);
  }
};

async function getCount() {
  try {
    const data = await fs.promises.readFile('count.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return 0;
    } else {
      throw err;
    }
  }
}

async function saveCount(count) {
  await fs.promises.writeFile('count.json', JSON.stringify(count));
}