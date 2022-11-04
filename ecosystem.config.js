module.exports = {
  apps: [
    {
      name: "What-s-my-look",
      script: "./dist/app.js",
      instances: 0,
      autorestart: true,
      exec_mode: "cluster",
    },
  ],
};
