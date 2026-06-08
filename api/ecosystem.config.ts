module.exports = {
  apps: [
    {
      name: "api-ts",
      script: "dist/app.js",

      // 🔁 Instancias (modo cluster para producción)
      instances: "max",
      exec_mode: "cluster",

      // 🌍 Variables de entorno
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        DB_HOST: "db",
        DB_USER: "root",
        DB_PASSWORD: "root",
        DB_NAME: "app_db"
      },

      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        DB_HOST: "db",
        DB_USER: "root",
        DB_PASSWORD: "root",
        DB_NAME: "app_db"
      },

      // 📦 Logs
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",

      // 🔄 Reinicio automático
      autorestart: true,
      watch: false,

      // ⚙️ Control de memoria
      max_memory_restart: "300M"
    }
  ]
};