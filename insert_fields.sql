-- database for the message_board
use message_board;

INSERT INTO Users VALUES 
	('Hinanawi','Hisouten'), --1
	('TerryBogard', 'FatalFury') --2

INSERT INTO Threads (title) VALUES
	('Peach Recipe Ideas')

INSERT INTO Posts(threadID, userID, replyID, body) VALUES
	(1, 1, NULL, 'I am tired of these peaches. Maybe I try some with mozzarella.'),
	(1, 2, 1, 'Are you okay?')