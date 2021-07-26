# Disco-Courier

_A data-mover-and-shaker for Disco Elysium._

The goal of Disco-Courier is to normalize and condense data for easy reading or transfer to the format of your choice. It drives data around in a _SSSSOUPED UP MOTOR CARRIAGE!_

Some things you could use it for:

- export only Garte dialog and train an AI model on it.
- use it to plan a walkthrough.
- normalize data into a SQL or noSQL db for use in your personal project.

## Requirements

You need a purchased copy of the game and access to its data.

## Setup

- clone the repo
- run `npm install`
- place a copy of your exported data in /data/dialog.json
- run a health check: `npm run courier:health`

If everything is setup correctly, you'll get a json response with summary details of the game's "FYS" attribute (_...get it? ...Health check? ...GET IT?!? Yeah me neither_).

### Usage

Some sample commands you can try:

`npm run...`

| Command                                                             | Result                                                                                                       |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `courier -- --output=read locations`                                | prints locations in json format to the screen.                                                               |
| `courier -- --output=json items`                                    | writes all items to a json file in /data/items.json                                                          |
| `courier -- --output=db actors`                                     | generates a Sequelize seed file for a table named "Actors" and populates it with all actors                  |
| `courier -- --output=read --start=100 variables`                    | displays all variables, starting at entry 100 to finish.                                                     |
| `courier --output=json --start=4 --results=1 conversations`         | writes entry #4 in conversations to /data/conversations.json                                                 |
| `courier --output=db --results=2 items.consumable`                  | generates a seed file for an "Items_consumable" table, and populates it with the first two consumable items. |
| `courier --output=read --results=4 actors.skill conversations.task` | prints the first four results for both actors that are a skill, and conversations representing a task.       |

Note this is not raw output: each command passes through an extensive templating system that can be customized to taste.

#### Entities and groups

Use these as last argument to specify output. Can use multiple args.
Omitting a sub-item exports all groups for the entity (e.g. "actors" on its own producs all rows in actors)
|Entity|Group|
---|---|
|**locations**|(none)
|**actors**|`actors:skill`, `actors:attribute`
|**variables**| (none)
|**items**| `items.thought`, `items.key`, `items.substance`, `items.consumable`, `items.game`, `items.book`, `items.clothing`, `items.tare`
|**conversations**|`conversations.task`, `conversations.subtask`, `conversations.dialog`, `conversations.orb`, `conversations.check`

#### Customizing output

- All output is controlled by the template functions defined in /templates.
- Helper and utility methods are in the /search directory.
- Add a json-querying utility for extra flexibility if you like, or use the utilities that are in /search.

#### Adding new groups

- options are defined in /lib/args.ts
- routing to templates is done in /templates/index.ts
- if stuck, refer to /lib/migration.ts for details on how entities and groups are managed.
- if using the group with the `--output=db` flag, you'll need to generate a new schema using the sequelize-cli.

#### Live / Exporation Option
- use `npm run dev -- --output=read <rest-of-options>` if you want to use nodemon. Useful when making edits to the template system.

#### Sequelize Option

- after you've generated some seed files, you can do `npm run db:up` to populate the database of your choice.
- SQLite should be ready out-of-the-box, you'll need to follow the standard Sequelize setup for Postgres, etc.

### Notes

- Sample sequelize models and migrations can be found in /data/models and /data/migrations respectively.
- using the `--results` flag will greatly improve speed if limiting the number of results, but --start will need to go through the full dataset until it reaches the starting index. Further optimization and work on paging needs to be done.
- Dialogs within conversations are still a bit work-in-progress.
- **USE CAUTION** when working with a large amount of conversations.
- There are _lengthy_ TODO comments in the source for contributors to check out. I don't have a lot of time, so contributions welcome.

### Roadmap, barring time/interest/help

- Finish up dialogueEntry formatting.
- Finish up checks and modifiers.
- Add support for foreign key relationships for sequelize.
- While you can do a lot with the json export option for getting items into noSQL databases, better support.
- CSV and spreadsheets would be nice (for easy dumps for things like checks).
