"use strict";

const arrDates = [
    new Date(),
    new Date(),
    new Date(),
    new Date()
];

arrDates[0].setHours(10);
arrDates[0].setMinutes(0);

arrDates[1].setHours(12);
arrDates[1].setMinutes(0);

arrDates[2].setDate(arrDates[2].getDate() + 1);
arrDates[2].setHours(9);
arrDates[2].setMinutes(0);

arrDates[3].setDate(arrDates[3].getDate() + 1);
arrDates[3].setHours(11);
arrDates[3].setMinutes(0);

module.exports = {
    "up": (queryInterface) => queryInterface.bulkInsert("turnos", [
        {
            "escapeRoomId": 1,
            "date": arrDates[0],
            "startTime": arrDates[0],
            "status": "finished",
            "place": "Class",
            "createdAt": new Date(),
            "updatedAt": new Date()
        },
        {
            "escapeRoomId": 1,
            "date": arrDates[1],
            "startTime": arrDates[1],
            "status": "finished",
            "place": "Lab",
            "createdAt": new Date(),
            "updatedAt": new Date()
        },
        {
            "escapeRoomId": 1,
            "date": arrDates[2],
            "startTime": arrDates[2],
            "status": "finished",
            "place": "Class",
            "createdAt": new Date(),
            "updatedAt": new Date()
        },
        {
            "escapeRoomId": 1,
            "date": arrDates[3],
            "status": "pending",
            "place": "Lab",
            "createdAt": new Date(),
            "updatedAt": new Date()
        }

    ]),

    "down": (queryInterface) => queryInterface.bulkDelete("turnos", null, {})
};
