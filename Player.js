module.exports = class PlayerClass {
  constructor({ id, name, figure, pc = false }) {
    this.id = pc ? 'PC' : id;
    this.name = name;
    this.figure = figure;
  }
};


