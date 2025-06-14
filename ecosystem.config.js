module.exports = {
  apps: [
    {
      name: 'cs-certificates',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      max_restarts: 10,
      restart_delay: 10000,
    },
  ],
};
