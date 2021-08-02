# Disco-Courier

_**A data-mover-and-shaker for Disco Elysium.**_

The goal of Disco-Courier is to normalize and condense data for easy reading or transfer to the format of your choice. It drives data around in a _SSSSOUPED UP MOTOR CARRIAGE!_

It is the first of three repos aimed at a larger project.

_**Things you can use Disco-Courier for:**_

- quickly look up game elements to plan a walkthrough.
- generate a markdown-friendly table of some interesting dialog.
- quickly format your own custom views of the data for display.
- normalize data into a SQL db for use in your personal project.
- slice-and-dice results as pre-prep for putting into noSQL docs.
- isolate Garte-only dialog and train an AI model on it.\*

\*(please, please let me know if you do this).

## Requirements

- You'll need a purchased copy of the game and access to its data.
- Assumes you have [Node.js and npm](https://medium.com/@nodesource/installing-node-js-tutorial-using-nvm-5c6ff5925dd8) installed.

## Setup

- clone or download this repo
- run `npm install` in the directory created.
- place a copy of your [exported data](https://github.com/Perfare/AssetStudio) in /data/dialog.json
- note: make sure your [extracted game data is in the JSON format](https://github.com/Perfare/AssetStudio/issues/477)!
- run a health check: `npm run courier:health`

If everything is setup correctly, you'll get a json response with summary details of the game's "FYS" attribute (_...get it? ...Health check? ...GET IT?!?_ Yeah me either).

### Usage

Here's a bunch of sample commands you can try to give you an idea of what's possibe (skip to next section for the full options/arguments reference):

`npm run...`

| Command                                                                                                            | Result                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `courier -- --export=read locations`                                                                               | prints a list of locations in json format to the screen.                                                                                                                                           |
| `courier -- --export=json items`                                                                                   | writes a list of all in-game items to a json file in `/data/json/items.json`                                                                                                                       |
| `courier -- --export=db actors`                                                                                    | generates a Sequelize seed file for a table named "Actors" and populates it with all actors                                                                                                        |
| `courier -- --export=read --start=100 variables`                                                                   | displays all variables, starting at entry 100 to finish.                                                                                                                                           |
| `courier -- --export=md --start=4 --results=1 conversations`                                                       | writes entry #4 in conversations as a table to `/data/markdown/conversations.md`                                                                                                                   |
| `courier -- --export=db --results=2 items.consumable`                                                              | generates a seed file for an "Items_consumable" table, and populates it with the first two consumable items.                                                                                       |
| `courier -- --export=read --results=4 actors.skill conversations.task`                                             | prints the first four results for both actors that are a skill, and conversations representing a task.                                                                                             |
| `courier -- --export=md conversations.whitecheck conversations.redcheck`                                           | writes all white checks as a markdown-friendly table to `/data/markdown/conversations.whitecheck.md` and likewise all redchecks to `data/markdown/conversations.redcheck.md`                       |
| `courier -- --export=db conversations.link`                                                                        | generates a seed file representing the entire dialog graph, normalized for a cross-reference table in a relational db                                                                              |
| `courier -- --export=json --start=188 conversations.dialog`                                                        | writes all dialog entries starting at the 188th result to `data/json/conversations.dialog.json`                                                                                                    |
| `courier -- --export=db --start=1 conversations.link conversations.task conversations.subtask conversations.check` | generates seed files for the dialog graph, a list of all tasks, a list of all subtasks, and all checks (white/red/passive) for their respective tables and populates with the first entry of each. |
| `courier -- --export=read --results=5 --actor=3 --conversant=8 conversations.dialogtext`                               | Creates a markdown-friendly table of the first five instances of Kim dialog where Jean Viqmarc is the conversant.                                                                                                              |
| `courier -- --export=json --actor=3 --OR=true --conversant=6 conversations.dialog` | Creates a detailed json export where the speaker is Kim, OR the conversant is Garte. |


Note this is not raw output: each command passes through an extensive templating system that can be customized to taste.

###Arguments

Arguments take the form of options for paging and output, and a list of entities and sub-groups you want to export.

#### Options

| flag                            | result                                                                                                                                                                                                                                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--start=<#>`                   | begins output at specified number, starting with 1 (no zero index). Similar to an `offset` command.                                                                                                                                                                                                           |
| `--results=<#>`                 | limits results to specified number. If used with start, will print the expected number of results _from the start number_. Similar to a `limit` command.                                                                                                                                                      |
| `--export=<read\|json\|md\|db>` | The `read` option prints results to your terminal. The `json` option writes the results to an "entity.group.json" file. The `md` option attempts to format the result in a markdown-friendly table. The `db` option generates a sequelize seed file (see the Sequelize seed section for more on this option). |
| `--actor=<id#>` | filter results by actor ID (only applies to relevant conversation groups) |
| `--conversant=<id#>` | filter results by conversant ID (only applies to relevant conversation groups) |
| `OR=true` | used to apply filters conditionally (actor OR conversant are true) default is AND (both conditions must be met) |


#### Entities and groups

Use these as last argument to specify output. Can use multiple args.
Omitting a sub-item exports all groups for the entity (e.g. "actors" on its own producs all rows in actors)
|Entity|Group|
---|---|
|**locations**|(none)
|**actors**|`actors:skill`, `actors:attribute`
|**variables**| (none)
|**items**| `items.thought`, `items.key`, `items.substance`, `items.consumable`, `items.game`, `items.book`, `items.clothing`, `items.tare`
|**conversations**|`conversations.task`, `conversations.subtask`, `conversations.dialog`, `conversations.dialogtext`, `conversations.orb`, `conversations.check` `conversations.whitecheck`, `conversations.redcheck` `conversations.passivecheck`

#### Customizing output

- All output is controlled by the template functions defined in /templates.
- Helper and utility methods are in the /search directory.
- Add a json-querying utility for extra flexibility if you like, or use the utilities that are in /search.

#### Adding new groups

- options are defined in /lib/args.ts
- routing to templates is done in /templates/index.ts
- if stuck, refer to /lib/migration.ts for details on how entities and groups are managed.
- if using the group with the `--output=db` flag, you'll need to generate a new schema using the sequelize-cli.

#### Live / Exploration Option

- use `npm run dev -- --output=read <rest-of-options>` if you want to use nodemon. Useful when making edits to the template system.

#### Sequelize Option

- If unfamiliar with SQL databases or the Sequelize ORM, this section probably isn't for you.
- The output of the `db` flag will place a seed in `/data/seeders/<timestamp-entity-group.js>`.
  - The resulting seed will reference Entity and Group names for the table name, with the first letter Capitalized, followed by an underscore and group name (if a group was specified):
    <br>
    _**Example:**_ `--output=db actors.skill` will generate **File:** `/data/seeders/202107271226-add-actors.skill.js` targeting **Table:** `Actors_skill`. See above section for more on Entities and groups.
    <br>
- after you've generated some seed files, you can do `npm run db:up` to populate the database of your choice.
- SQLite should be ready out-of-the-box, you'll need to follow the standard Sequelize setup for Postgres, etc.

#### Generating Models

Sample models and migration scripts have been provided for nearly every sample template in the app. To import:

- Have a database that Sequelize supports, and make sure to install the proper Sequelize items so you can talk to it.
- Run at least one --output=db command on an entity you wish to transfer to a db.
- Run `npm run db:up` to create your tables and run the seeders.
- Run `npm run db:down` to roll back.

### Notes

- Sample sequelize models and migrations can be found in /data/models and /data/migrations respectively.
- using the `--results` flag will greatly improve speed if limiting the number of results, but --start will need to go through the full dataset until it reaches the starting index. Further optimization and work on paging needs to be done.
- Dialogs within conversations are still a bit work-in-progress.
- **USE CAUTION** when working with a large amount of conversations.
- There are _lengthy_ TODO comments in the source for contributors to check out. I don't have a lot of time, so contributions welcome.

### Roadmap, barring time/interest/help

- Tidy up dialogueEntry formatting and make the generic model for it.
- ~~Finish up checks and modifiers (see above)~~ (Done).
- Add support for foreign key relationships for sequelize.
- While you can do a lot with the json export option for getting items into noSQL databases, it could use some better convenience options.
- CSV and spreadsheets would be nice (for easy dumps for things like checks).
- Markdown tables? If there's something easy, why not.
- Currently supports the version released 6th April 2021. Build on initial work to support additional versions.
