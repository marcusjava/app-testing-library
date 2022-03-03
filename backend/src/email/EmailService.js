const logger = require('../shared/logger');

const sendAccountActivation = async (email, token) => {
  const url = `http://localhost:9876/activate/${token}`;
  logger.info(url);
};

const sendPasswordReset = async (email, token) => {
  const url = `http://localhost:9876/password-reset/${token}`;
  logger.info(url);
};

module.exports = { sendAccountActivation, sendPasswordReset };
