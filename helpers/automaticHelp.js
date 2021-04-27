const {getCurrentPuzzleAndCurrentTime} = require("./utils");
const {sendTeamMessage} = require("./sockets");
const {NEED_HELP, NEED_HELP_MAX} = require("./apiCodes");
const sequelize = require("../models");
const {models} = sequelize;
const queries = require("../queries");

exports.startAutomaticHelp = async (team, puzzles, escapeRoom, turno) => {
    if (turno.allowAutomaticHelp && turno.status === "active") {
        console.log("SINCRONOOO");
        const teamsPlaying = await models.team.findAll(queries.team.rankingShort(escapeRoom.id, turno.id));
        // Para poder parar el timeout cuando el turno de pare
        const turnoReload = await models.turno.findOne({"where": {"id": turno.id, "escapeRoomId": escapeRoom.id}, "attributes": ["id", "allowAutomaticHelp", "date", "status"]});

        for (const t in teamsPlaying) {
            // eslint-disable-next-line no-await-in-loop
            await exports.startAutomaticHelpOneTeam(teamsPlaying[t], puzzles, escapeRoom, turnoReload);
        }
        // Si no le ha dado al boton stop se sigue haciendo el tiemout que se activa al pulsar el boton play
        console.log("ANTESSS DEL TIMEOUT SINCRONO");
        setTimeout(() => exports.startAutomaticHelp(team, puzzles, escapeRoom, turnoReload), 15000);
    }
};

exports.startAutomaticHelpOneTeam = async (team, puzzles, escapeRoom, turno) => {
    console.log("ESTA ENTRANDO EN LA FUNC");

    const {currentPuzzle, timeElapsed, retosSuperados} = await getCurrentPuzzleAndCurrentTime(team, puzzles);
    const helpStrategyDuration = {"type": NEED_HELP, "payload": {"helpStrategyDuration": escapeRoom.autHelpOptionsDuration}};
    const helpStrategyMaxDuration = {"type": NEED_HELP_MAX, "payload": {"helpStrategyMaxDuration": escapeRoom.autHelpOptionsMaxDuration}};

    if (retosSuperados.length < puzzles.length) {
        // Comprobar en cual trabajo
        console.log("PRIMER IFFF");
        if (timeElapsed >= puzzles.find((p) => p.order === currentPuzzle).duration * 60000 && timeElapsed <= puzzles.find((p) => p.order === currentPuzzle).duration * 60000 + 13000) { // Convertir duration de minutos a ms (&& timeElapsed < (puzzles.find((p) => p.order === currentPuzzle).duration * 60000 + 20000))
            console.log("SEGUNDO IF Duration");
            // Switch case con las opciones de ayuda excepto si lo escribe el profe, el resto con i18n
            switch (escapeRoom.autHelpOptionsDuration) {
            case "msg":
            case "reqOneHint":
            case "giveNextHint":
            case "giveLastHint":
            case "giveSolution":
                sendTeamMessage(helpStrategyDuration, team.id);
                break;
            case "none":
            default:
                break;
            }
        } else if (timeElapsed >= puzzles.find((p) => p.order === currentPuzzle).maxDuration * 60000 && timeElapsed <= puzzles.find((p) => p.order === currentPuzzle).maxDuration * 60000 + 13000) { // Convertir duration de minutos a ms
            console.log("SEGUNDO IF MAX Duration");
            // Switch case con las opciones de ayuda excepto si lo escribe el profe, el resto con i18n
            switch (escapeRoom.autHelpOptionsMaxDuration) {
            case "msg":
            case "reqOneHint":
            case "giveNextHint":
            case "giveLastHint":
            case "giveSolution":
                sendTeamMessage(helpStrategyMaxDuration, team.id);
                break;
            case "none":
            default:
                break;
            }
        }
        if (turno.date === null) {
            console.log("ANTESSS DEL TIMEOUT ASINCRONO");
            setTimeout(() => exports.startAutomaticHelpOneTeam(team, puzzles, escapeRoom, turno), 15000);
        }
    }
};

