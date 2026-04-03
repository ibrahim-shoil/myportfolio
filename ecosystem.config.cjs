module.exports = {
  apps: [
    {
      name: 'ishoil-downloads',
      script: './server/index.mjs',
      cwd: '/var/www/ishoil_portfolio',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
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
