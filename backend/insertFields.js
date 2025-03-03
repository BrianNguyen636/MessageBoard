import pool from './database.js';

async function main() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL database!');
        await insertUsers(connection);
        console.log('Inserted Users')
        await insertThreads(connection);
        console.log('Inserted Threads')
        await insertPosts(connection);
        console.log('Inserted Posts')
        connection.release()
        process.exit(1);
    } catch (error) {
        console.error('Error connecting to MySQL:', error.message);
        process.exit(1);
    }
}

async function insertUsers(connection) {
    await connection.execute(`
        INSERT INTO Users (username, password) VALUES 
            ('Hinanawi','Hisouten'),
            ('TerryBogard', 'FatalFury'), 
            ('Ragna', '214B'),
            ('KidoHyde', '123'),
            ('RockHoward', 'fullthrottle'),
            ('TestUser', 'test'),
            ('Langston','markanthony'),
            ('N2','playcvbla'),
            ('Barkley','astlibra'),
            ('Rakky','crabposter');
    `)
}

async function insertThreads(connection) {
    await connection.execute(`
        INSERT INTO Threads (title) VALUES
            ('Peach Recipe Ideas'),
            ('Best Burgers in Southtown?'),
            ('Anyone see this girl?'),
            ('Tips on getting the delay?'),
            ('Where is this Terry guy'),
            ('Any one see the game last night?'),
            ('Percival is honest.'),
            ('Google CVBLA'),
            ('I hate LinkedIn'),
            ('Kelvin bros');
    `)
}

async function insertPosts(connection) {
    await connection.execute(`
        INSERT INTO Posts(threadID, userID, replyID, body, time) VALUES
            (1, 1, NULL, 'I am tired of these peaches. Maybe I try some with mozzarella.', '2025-02-11 18:52:48.300'),
            (1, 2, 1, 'Are you okay?', '2025-02-12 18:52:48.300'),

            (2, 2, NULL, 'I am looking for a real bout burger in Southtown. Any recommendations?', '2025-02-13 18:52:48.300'),
            (2, 5, 3, 'Pigging out on fast food again?', '2025-02-14 18:52:48.300'),

            (3, 3, NULL, 'This girl with a brown ponytail has been missing, anyone see her?', '2025-02-15 18:52:48.300'),
            (3, 4, 5, 'I think I remember seeing someone like that near the train', '2025-02-16 18:52:48.300'),

            (4, 4, NULL, 'I cant hit these delays in this combo!', '2025-02-17 18:52:48.300'),
            (4, 2, 7, 'Try to match the rhythm with the ONE TWO THREE', '2025-02-18 18:52:48.300'),

            (5, 5, NULL, 'I havent been able to find him since yesterday', '2025-02-19 18:52:48.300'),
            (5, 2, 9, 'Hey Rock, I’m just getting busy around Southtown! Come on!', '2025-02-20 18:52:48.300');
    `)
}

main();