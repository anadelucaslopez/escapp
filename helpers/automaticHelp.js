const {getCurrentPuzzleAndCurrentTime} = require("./utils");
const {sendTeamMessage} = require("./sockets");
const {NEED_HELP, NEED_HELP_MAX} = require("./apiCodes");

exports.startAutomaticHelpOneTeam = async (team, puzzles, escapeRoom) => {
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
                sendTeamMessage(helpStrategyDuration, team.id);
                break;
            case "reqOneHint":
                sendTeamMessage(helpStrategyDuration, team.id);
                break;
            case "giveNextHint":
                sendTeamMessage(helpStrategyDuration, team.id);
                break;
            case "giveLastHint":
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
                sendTeamMessage(helpStrategyMaxDuration, team.id);
                break;
            case "reqOneHint":
                sendTeamMessage(helpStrategyMaxDuration, team.id);
                break;
            case "giveNextHint":
                sendTeamMessage(helpStrategyMaxDuration, team.id);
                break;
            case "giveLastHint":
                sendTeamMessage(helpStrategyMaxDuration, team.id);
                break;
            case "none":
            default:
                break;
            }
        }
        console.log("ANTESSS DEL TIMEOUT");
        setTimeout(() => exports.startAutomaticHelpOneTeam(team, puzzles, escapeRoom), 15000);
    }
};

exports.startAutomaticHelpShift = async (team, puzzles, escapeRoom) => {
   console.log("Hola");
};

