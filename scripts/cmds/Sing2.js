const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: 's',
    aliases: ['sing2'], // <-- Added aliases here
    author: 'nyx x rasin',
    usePrefix: false,
    category: 'Youtube Song Downloader'
  },

  onStart: async ({ event, api, args, message }) => {
    try {
      const query = args.join(' ');
      if (!query) return message.reply('Please provide a search query!');
      
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const searchRes = await axios.get(`https://developer-rasin404.onrender.com/api/rasin/ytsearch?query=${encodeURIComponent(query)}`);
      const videos = searchRes.data.data;

      const parseDuration = (timestamp) => {
        const parts = timestamp.split(':').map(part => parseInt(part));
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return 0;
      };

      const filtered = videos.filter(video => parseDuration(video.duration) < 600);
      if (filtered.length === 0) return message.reply('No short videos found (under 10 minutes)!');

      const selected = filtered[0];
      const singApiRes = await axios.get(`https://developer-rasin420.onrender.com/api/rasin/sing?url=${selected.url}`);
      if (!singApiRes.data.link) throw new Error('Audio URL not found in API response.');

      const tempFilePath = path.join(__dirname, 'temp_audio.m4a');
      const writer = fs.createWriteStream(tempFilePath);
      const audioStream = await axios({ url: singApiRes.data.link, method: 'GET', responseType: 'stream' });
      audioStream.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await message.reply({
        body: `🎧 Now playing: ${selected.title}\nDuration: ${selected.duration}`,
        attachment: fs.createReadStream(tempFilePath)
      });

      fs.unlink(tempFilePath, err => {
        if (err) message.reply(`Error deleting temp file: ${err.message}`);
      });

    } catch (err) {
      message.reply(`❌ Error: ${err.message}`);
    }
  }
};
