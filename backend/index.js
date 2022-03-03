const app = require('./src/app');
const sequelize = require('./src/config/database');
const TokenService = require('./src/auth/TokenService');
const logger = require('./src/shared/logger');
const FileService = require('./src/file/FileService');
const User = require('./src/user/User');
const bcrypt = require('bcrypt');

sequelize.sync();

TokenService.scheduleCleanup();
FileService.removeUnusedAttachments();

const addUser = async (index) => {
  const hash = await bcrypt.hash('P4ssword', 10);
  const user = {
    username: `user${index}`,
    email: `user${index}@mail.com`,
    password: hash,
    inactive: false,
  };
  await User.create(user);
};

const add = async () => {
  if (process.env.NODE_ENV === 'devMem') {
    for (let i = 1; i <= 25; i++) {
      await addUser(i);
    }
  }
};

add();

app.listen(8080, () => logger.info('app is running. version: ' + process.env.npm_package_version));
