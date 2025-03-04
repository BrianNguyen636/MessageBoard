import pool from './database.js';

async function main() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL database!');


        // IF REMAKING THE TABLES UNCOMMENT
        // LEAVE COMMENTED OUT IF RUNNING FOR THE FIRST TIME
        
        // await dropConstraints(connection);
        await makeUsers(connection);
        console.log('User table created.')
        await makeThreads(connection);
        console.log('Threads table created.')
        await makePosts(connection);
        console.log('Posts table created.')
        await addFK(connection);
        console.log('Foriegn keys created.')

        connection.release()
        process.exit(1);
    } catch (error) {
        console.error('Error connecting to MySQL:', error.message);
        process.exit(1);
    }
}


async function makeUsers(connection) {
    await connection.execute('DROP TABLE IF EXISTS Users;')
    await connection.execute('CREATE TABLE Users'+
        '(userID int NOT NULL AUTO_INCREMENT PRIMARY KEY, username varchar(255) NOT NULL,password varchar(255) NOT NULL)')
}

async function makeThreads(connection) {
    await connection.execute('DROP TABLE IF EXISTS Threads;')
    await connection.execute('CREATE TABLE Threads'+
        '(threadID int NOT NULL AUTO_INCREMENT PRIMARY KEY, title varchar(255) NOT NULL) ')
}
async function makePosts(connection) {
    await connection.execute('DROP TABLE IF EXISTS Posts;')
    await connection.execute('CREATE TABLE Posts '+
        '(postID int NOT NULL AUTO_INCREMENT PRIMARY KEY,threadID int NOT NULL,userID int NOT NULL,' +
         'replyID int DEFAULT NULL,body varchar(255) NOT NULL,time DATETIME DEFAULT CURRENT_TIMESTAMP);')
}

async function addFK(connection) {
    await connection.execute('ALTER TABLE POSTS ADD CONSTRAINT fk_threadID FOREIGN KEY (threadID) REFERENCES Threads(threadID)')
    await connection.execute('ALTER TABLE POSTS ADD CONSTRAINT fk_replyID FOREIGN KEY (replyID) REFERENCES Posts(postID)')
    await connection.execute('ALTER TABLE POSTS ADD CONSTRAINT fk_userID FOREIGN KEY (userID) REFERENCES Users(userID)')
}

async function dropConstraints(connection) {
    await connection.execute('ALTER TABLE Posts DROP CONSTRAINT fk_replyID')
    await connection.execute('ALTER TABLE Posts DROP CONSTRAINT fk_threadID')
    await connection.execute('ALTER TABLE Posts DROP CONSTRAINT fk_userID')
}

main();