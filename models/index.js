const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('desafio_db', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres',
});

const TaskModel = require('./Task');
const TagModel = require('./Tag');

const Task = TaskModel(sequelize);
const Tag = TagModel(sequelize);


Task.belongsToMany(Tag, { through: 'TaskTag', as: 'tags' });
Tag.belongsToMany(Task, { through: 'TaskTag', as: 'tasks' });

module.exports = {
  sequelize,
  Task,
  Tag,
};
