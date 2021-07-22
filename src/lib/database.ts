import { Sequelize } from 'sequelize'
import chalk from 'chalk'

export const connect = async (type:string) => {
  const db = new Sequelize({
    "dialect": "sqlite",
    "storage": "src/data/storage.sqlite3",
  })

  return await db.authenticate()
  .then((result) => {
    console.log(chalk.green('Connected to database'))
    return db
  })
  .catch((error) => {
    console.log(chalk.redBright("Unable to connect to db: "), chalk.red(error))
    process.exit(1)
  })
}

/*
const insert = (entityname: string, data) => {
  const sequelize = new Sequelize({
    host: 'localhost',
    dialect: 'sqlite',
    storage: `src/data/${entityname}.sqlite`
  })
}
*/