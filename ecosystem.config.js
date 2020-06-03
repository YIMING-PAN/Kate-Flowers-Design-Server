module.exports = {
  apps: [
    {
      name: "handy-booking-server",
      script: "./src/index.js",
      args: "one two",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
