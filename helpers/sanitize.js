const sanitizeId = (id) => id && id !== "" && id !== "new" ? id : undefined;


exports.sanitizePuzzles = (puzzles = []) => puzzles.
    sort((a, b) => parseInt(isNaN(a.order) ? 0 : a.order, 10) < parseInt(isNaN(b.order) ? 0 : b.order, 10) ? -1 : 1).
    map((puzzle, order) => {
        const {id, title, desc, sol, automatic, duration, maxDuration, correct, fail, hints, categories = ["General"]} = puzzle;

        return {
            "id": sanitizeId(id),
            "automatic": automatic === "1",
            title,
            order,
            desc,
            sol,
            duration,
            maxDuration,
            correct,
            fail,
            "hints": (hints || []).map((hint) => ({
                "id": sanitizeId(hint.id),
                "order": hint.order,
                "content": hint.content,
                "category": categories[hint.category || 0]
            }))
        };
    });

exports.sanitizeHints = (hints = []) => hints.
    sort((a, b) => parseInt(isNaN(a.order) ? 0 : a.order, 10) < parseInt(isNaN(b.order) ? 0 : b.order, 10) ? -1 : 1).
    map((hint, order) => {
        const {id, content, puzzleId, category} = hint;
        const sanitizedCat = category ? category.toString().trim().replace(/[\r\n\t]+/, ". ") : category;

        return {
            "id": sanitizeId(id),
            order,
            puzzleId,
            content,
            "category": sanitizedCat
        };
    });
