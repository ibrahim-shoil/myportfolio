const fs = require('fs')

// Secrets live outside the repo in /etc/ishoil-portfolio/secrets.json (root-only).
let secrets = {}
try {
  secrets = JSON.parse(fs.readFileSync('/etc/ishoil-portfolio/secrets.json', 'utf8'))
} catch (err) {
  console.error('warning: could not read /etc/ishoil-portfolio/secrets.json:', err.message)
}

module.exports = {
  apps: [
    {
      name: 'ishoil-downloads',
      script: './server/index.mjs',
      cwd: '/var/www/ishoil_portfolio',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        TELEGRAM_BOT_TOKEN: secrets.TELEGRAM_BOT_TOKEN || '',
        TELEGRAM_CHAT_ID: secrets.TELEGRAM_CHAT_ID || '6229915378',
        INQUIRY_RATE_BYPASS_IPS: '156.206.210.141',
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: '100M',
      error_file: '/var/log/pm2/ishoil-downloads-error.log',
      out_file: '/var/log/pm2/ishoil-downloads-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
}
