const sequelize = require("../models");
const {models} = sequelize;
const {getCurrentPuzzle, getCurrentPuzzleAndCurrentTime} = require("./utils");

exports.calculateNextHint = async (escapeRoom, team, status, score, category, messages) => {
    const success = status === "completed" || status === "passed";

    try {
        const teamId = team.id;

        if (success) {
            const currentlyWorkingOn = await getCurrentPuzzle(team, escapeRoom.puzzles);

            const hints = await models.requestedHint.findAll({
                "where": {
                    teamId,
                    "success": true
                },
                "include": [
                    {
                        "model": models.hint,
                        "attributes": ["id", "category", "order"],
                        "include": [
                            {
                                "model": models.puzzle,
                                "attributes": ["id", "order"]
                            }
                        ]
                    }
                ],
                "order": [["createdAt", "ASC"]]
            });
            // Para calcular la ultima pista en el momento adecuado
            const {timeElapsed, retosSuperados} = await getCurrentPuzzleAndCurrentTime(team, escapeRoom.puzzles);
            const currentPuzzle = escapeRoom.puzzles.find((p) => p.order === currentlyWorkingOn);

            if (escapeRoom.hintLimit !== undefined && escapeRoom.hintLimit !== null && hints.length >= escapeRoom.hintLimit) {
                return { "msg": messages.tooMany, "ok": false };
            }

            if (escapeRoom.hintInterval && hints.length > 0) {
                const latestHint = hints[hints.length - 1].createdAt;
                const now = new Date();
                const timeSinceLastHint = (now - latestHint) / 1000 / 60;

                if (timeSinceLastHint < escapeRoom.hintInterval) {
                    const timeAhead = escapeRoom.hintInterval - timeSinceLastHint;
                    const each = timeAhead < 1 ? `${Math.round(timeAhead * 60)} s.` : `${Math.round(timeAhead)} min.`;

                    return { "msg": `${messages.notUntil} ${each}`, "ok": false };
                }
            }

            const requestedHints = hints.filter((h) => h.id !== null);
            let currentHint = -1;
            const allHints = [];
            const allHintsIndexes = [];
            const puzzleOrder = currentPuzzle ? currentPuzzle.order + 1 : null;

            if (!currentPuzzle) {
                return { "ok": false, "msg": messages.cantRequestMoreThis};
            }

            for (const i in currentPuzzle.hints) {
                const currentHintAll = currentPuzzle.hints[i];

                if (!category || category === currentHintAll.category) {
                    allHints.push(currentHintAll);
                    allHintsIndexes.push(currentHintAll.id);
                }
            }

            for (const h in requestedHints) {
                const hint = requestedHints[h];

                const hIndex = allHintsIndexes.indexOf(hint.hintId);

                if (hIndex > currentHint) {
                    currentHint = hIndex;
                }
            }
            if (escapeRoom.autHelpOptionsDuration === "giveLastHint" && timeElapsed >= currentPuzzle.duration * 60000 && timeElapsed <= currentPuzzle.duration * 60000 + 13000) {
                currentHint = allHintsIndexes.length - 1;
            } else if (escapeRoom.autHelpOptionsMaxDuration === "giveLastHint" && timeElapsed >= currentPuzzle.maxDuration * 60000 && timeElapsed <= currentPuzzle.maxDuration * 60000 + 13000) {
                currentHint = allHintsIndexes.length - 1;
            } else {
                currentHint++;
            }
            let msg = messages.empty;
            let hintId = null;
            let hintOrder = null;

            if (currentHint < allHintsIndexes.length) {
                msg = allHints[currentHint].content;
                hintId = allHints[currentHint].id;
                hintOrder = allHints[currentHint].order + 1;
            }
            if (hintOrder || escapeRoom.allowCustomHints) {
                const reqHint = models.requestedHint.build({hintId, teamId, success, score});

                await reqHint.save();
                return {"ok": true, msg, hintOrder, puzzleOrder, category};
            }
            return {"ok": false, "msg": messages.cantRequestMoreThis, hintOrder, puzzleOrder, category};
        }
        const reqHint = models.requestedHint.build({"hintId": null, teamId, success, score});

        await reqHint.save();
        return { "ok": false, "msg": messages.failed};
    } catch (e) {
        return {"ok": false, "msg": e.message};
    }
};
