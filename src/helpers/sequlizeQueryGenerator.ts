import * as Sequelize from "sequelize";

class SequlizeQueryGenerator {
  static instance: SequlizeQueryGenerator;
  constructor() {}

  static get(): SequlizeQueryGenerator {
    if (!SequlizeQueryGenerator.instance) {
      SequlizeQueryGenerator.instance = new SequlizeQueryGenerator();
    }
    return SequlizeQueryGenerator.instance;
  }

  searchRegex({ query, columns }: { query: string; columns: string[] }): any {
    const filter = [];
    for (const column of columns) {
      filter.push({ [column]: { [Sequelize.Op.iLike]: "%" + query + "%" } });
    }
    return filter;
  }
}

const sequlizeQueryGenerator = SequlizeQueryGenerator.get();

export { sequlizeQueryGenerator as SequlizeQueryGenerator };
