/**
 * PM2 Ecosystem Configuration for IKMI SOCIAL
 * 
 * Usage:
 *   npm run start:pm2            # Start production
 *   npm run stop                 # Stop
 *   npm run restart              # Restart
 *   npm run logs                 # View logs
 *   pm2 monit                    # Monitor
 */

module.exports = {
  apps: [
    {
      name: 'ikmi-social',
      script: '.next/standalone/server.js',
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      // Logging configuration
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    }
  ]
};
