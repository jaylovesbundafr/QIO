require('./settings');
const {
  default: qioConnect,
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  downloadContentFromMessage,
  makeInMemoryStore,
  jidDecode,
  proto,
  getAggregateVotesInPollMessage
} = global.baileys1;
const pino = require("pino");
const fs = require('fs');
const FileType = require('file-type');
const readline = require("readline");
const path = require("path");
const NodeCache = require('node-cache');
const {
  smsg,
  isUrl,
  generateMessageTag,
  getBuffer,
  getSizeMedia,
  fetchJson,
  await,
  sleep
} = require("./lib/storage");
const {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid
} = require('./lib/exif');
const store = makeInMemoryStore({
  'logger': pino().child({
    'level': 'silent',
    'stream': 'store'
  })
});
const question = _0x2bd5d1 => {
  const _0x5c68d8 = readline.createInterface({
    'input': process.stdin,
    'output': process.stdout
  });
  return new Promise(_0xe89ef0 => {
    _0x5c68d8.question(_0x2bd5d1, _0xe89ef0);
  });
};
async function connectToWhatsApp() {
  const {
    state: _0xa74588,
    saveCreds: _0x1f720d
  } = await useMultiFileAuthState("./session");
  const {
    version: _0x33d93e,
    isLatest: _0x122e4d
  } = await fetchLatestBaileysVersion();
  const _0x897010 = new NodeCache();
  const _0x569b4b = makeWASocket({
    'isLatest': _0x122e4d,
    'keepAliveIntervalMs': 0xc350,
    'printQRInTerminal': false,
    'logger': pino({
      'level': "silent"
    }),
    'auth': _0xa74588,
    'browser': ["Mac Os", "chrome", "121.0.6167.159"],
    'version': [0x2, 0x96d, 0x1],
    'generateHighQualityLinkPreview': true,
    'resolveMsgBuffer': _0x897010
  });
  if (true && !_0x569b4b.authState.creds.registered) {
    const _0x9be70a = await question("\n\t\t───────────────────────────────────────────\n─██████████████───██████████─██████████████\n─██▒▒▒▒▒▒▒▒▒▒██───██▒▒▒▒▒▒██─██▒▒▒▒▒▒▒▒▒▒██\n─██▒▒██████▒▒██───████▒▒████─██▒▒██████▒▒██\n─██▒▒██──██▒▒██─────██▒▒██───██▒▒██──██▒▒██\n─██▒▒██──██▒▒██─────██▒▒██───██▒▒██──██▒▒██\n─██▒▒██──██▒▒██─────██▒▒██───██▒▒██──██▒▒██\n─██▒▒██──██▒▒██─────██▒▒██───██▒▒██──██▒▒██\n─██▒▒██──██▒▒██─────██▒▒██───██▒▒██──██▒▒██\n─██▒▒██████▒▒████─████▒▒████─██▒▒██████▒▒██\n─██▒▒▒▒▒▒▒▒▒▒▒▒██─██▒▒▒▒▒▒██─██▒▒▒▒▒▒▒▒▒▒██\n─████████████████─██████████─██████████████\n───────────────────────────────────────────\n                                 [By Alwaysaqioo]\nmohon di masukin gan nomor bot lu supaya terhubung dengan qio Bot di awali dengan Kode Negara:\n");
    const _0x9b131f = await _0x569b4b.requestPairingCode(_0x9be70a.trim());
    console.log("Pairing code: " + _0x9b131f);
  }
  store.bind(_0x569b4b.ev);
  _0x569b4b.ev.on("call", async _0x4f4ece => {
    console.log("ada anak anjing nelpon lu");
  });
  _0x569b4b.decodeJid = _0x11eb69 => {
    if (!_0x11eb69) {
      return _0x11eb69;
    }
    if (/:\d+@/gi.test(_0x11eb69)) {
      let _0x2830f7 = jidDecode(_0x11eb69) || {};
      return _0x2830f7.user && _0x2830f7.server && _0x2830f7.user + '@' + _0x2830f7.server || _0x11eb69;
    } else {
      return _0x11eb69;
    }
  };
  _0x569b4b.getFile = async (_0xd3add, _0x149d0e) => {
    let _0x547472;
    let _0x261049 = Buffer.isBuffer(_0xd3add) ? _0xd3add : /^data:.*?\/.*?;base64,/i.test(_0xd3add) ? Buffer.from(_0xd3add.split`,`[0x1], "base64") : /^https?:\/\//.test(_0xd3add) ? await (_0x547472 = await getBuffer(_0xd3add)) : fs.existsSync(_0xd3add) ? (filename = _0xd3add, fs.readFileSync(_0xd3add)) : typeof _0xd3add === "string" ? _0xd3add : Buffer.alloc(0x0);
    let _0x163516 = (await FileType.fromBuffer(_0x261049)) || {
      'mime': 'application/octet-stream',
      'ext': ".bin"
    };
    filename = path.join(__filename, "../" + new Date() * 0x1 + '.' + _0x163516.ext);
    if (_0x261049 && _0x149d0e) {
      fs.promises.writeFile(filename, _0x261049);
    }
    return {
      'res': _0x547472,
      'filename': filename,
      'size': await getSizeMedia(_0x261049),
      ..._0x163516,
      'data': _0x261049
    };
  };
  _0x569b4b.downloadMediaMessage = async _0x148c70 => {
    let _0x4b546a = (_0x148c70.msg || _0x148c70).mimetype || '';
    let _0x17f948 = _0x148c70.mtype ? _0x148c70.mtype.replace(/Message/gi, '') : _0x4b546a.split('/')[0x0];
    const _0x7e131c = await downloadContentFromMessage(_0x148c70, _0x17f948);
    let _0x194c78 = Buffer.from([]);
    for await (const _0x549672 of _0x7e131c) {
      _0x194c78 = Buffer.concat([_0x194c78, _0x549672]);
    }
    return _0x194c78;
  };
  _0x569b4b.sendText = (_0x3090e3, _0x5bfaaf, _0x445c4a = '', _0x5ac0f3) => _0x569b4b.sendMessage(_0x3090e3, {
    'text': _0x5bfaaf,
    ..._0x5ac0f3
  }, {
    'quoted': _0x445c4a
  });
  _0x569b4b.sendImageAsSticker = async (_0x1d84ed, _0x545218, _0x42525a, _0x4aa8ec = {}) => {
    let _0x3631a1 = Buffer.isBuffer(_0x545218) ? _0x545218 : /^data:.*?\/.*?;base64,/i.test(_0x545218) ? Buffer.from(_0x545218.split`,`[0x1], "base64") : /^https?:\/\//.test(_0x545218) ? await await getBuffer(_0x545218) : fs.existsSync(_0x545218) ? fs.readFileSync(_0x545218) : Buffer.alloc(0x0);
    let _0x1fdc75;
    if (_0x4aa8ec && (_0x4aa8ec.packname || _0x4aa8ec.author)) {
      _0x1fdc75 = await writeExifImg(_0x3631a1, _0x4aa8ec);
    } else {
      _0x1fdc75 = await imageToWebp(_0x3631a1);
    }
    await _0x569b4b.sendMessage(_0x1d84ed, {
      'sticker': {
        'url': _0x1fdc75
      },
      ..._0x4aa8ec
    }, {
      'quoted': _0x42525a
    });
    return _0x1fdc75;
  };
  _0x569b4b.sendVideoAsSticker = async (_0x1d0f66, _0xb4a335, _0x4b4b28, _0x4650da = {}) => {
    let _0x22d801 = Buffer.isBuffer(_0xb4a335) ? _0xb4a335 : /^data:.*?\/.*?;base64,/i.test(_0xb4a335) ? Buffer.from(_0xb4a335.split`,`[0x1], "base64") : /^https?:\/\//.test(_0xb4a335) ? await await getBuffer(_0xb4a335) : fs.existsSync(_0xb4a335) ? fs.readFileSync(_0xb4a335) : Buffer.alloc(0x0);
    let _0x15d4a9;
    if (_0x4650da && (_0x4650da.packname || _0x4650da.author)) {
      _0x15d4a9 = await writeExifVid(_0x22d801, _0x4650da);
    } else {
      _0x15d4a9 = await videoToWebp(_0x22d801);
    }
    await _0x569b4b.sendMessage(_0x1d0f66, {
      'sticker': {
        'url': _0x15d4a9
      },
      ..._0x4650da
    }, {
      'quoted': _0x4b4b28
    });
    return _0x15d4a9;
  };
  _0x569b4b.downloadAndSaveMediaMessage = async (_0x364ebf, _0x3bb364, _0x187cb9 = true) => {
    let _0x1d8f6b = _0x364ebf.msg ? _0x364ebf.msg : _0x364ebf;
    let _0x406c46 = (_0x364ebf.msg || _0x364ebf).mimetype || '';
    let _0x330711 = _0x364ebf.mtype ? _0x364ebf.mtype.replace(/Message/gi, '') : _0x406c46.split('/')[0x0];
    const _0x339839 = await downloadContentFromMessage(_0x1d8f6b, _0x330711);
    let _0x165790 = Buffer.from([]);
    for await (const _0x17d35f of _0x339839) {
      _0x165790 = Buffer.concat([_0x165790, _0x17d35f]);
    }
    let _0x400f40 = await FileType.fromBuffer(_0x165790);
    trueFileName = _0x187cb9 ? _0x3bb364 + '.' + _0x400f40.ext : _0x3bb364;
    await fs.writeFileSync(trueFileName, _0x165790);
    return trueFileName;
  };
  _0x569b4b.ev.on('messages.upsert', async _0xe74af9 => {
    try {
      mek = _0xe74af9.messages[0x0];
      if (!mek.message) {
        return;
      }
      mek.message = Object.keys(mek.message)[0x0] === 'ephemeralMessage' ? mek.message.ephemeralMessage.message : mek.message;
      if (mek.key && mek.key.remoteJid === "status@broadcast") {
        return;
      }
      if (!_0x569b4b["public"] && !mek.key.fromMe && _0xe74af9.type === 'notify') {
        return;
      }
      if (mek.key.id.startsWith("BAE5") && mek.key.id.length === 0x10) {
        return;
      }
      m = smsg(_0x569b4b, mek, store);
      require("./indek")(_0x569b4b, m, _0xe74af9, store);
    } catch (_0x5557bf) {
      console.log(_0x5557bf);
    }
  });
  _0x569b4b['public'] = true;
  _0x569b4b.serializeM = _0x38f6cc => smsg(_0x569b4b, _0x38f6cc, store);
  _0x569b4b.ev.on("connection.update", _0x54a8fc => {
    const {
      connection: _0x10a47a,
      lastDisconnect: _0xd14fa
    } = _0x54a8fc;
    if (_0x10a47a === "close") {
      if (_0xd14fa.error?.["output"]?.['statusCode'] !== DisconnectReason.loggedOut) {
        connectToWhatsApp();
      } else {
        '';
      }
    } else if (_0x10a47a === 'open') {
      console.log("Tersambung Kembali");
    }
    console.log(_0x54a8fc);
  });
  _0x569b4b.ev.on("creds.update", _0x1f720d);
}
connectToWhatsApp();