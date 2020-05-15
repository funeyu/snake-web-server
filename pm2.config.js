module.exports = {
  apps : [
      {
        name: "snake",
        script: "./snake.js",
        instances: 4,
        exec_mode: "cluster",
        instance_var: 'INSTANCE_ID',
      }
  ]
}
