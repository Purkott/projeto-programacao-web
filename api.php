<?php
header("Content-Type: application/json");
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
	case 'POST':
		handlePost($pdo ,$input);
		break;
	case 'PUT':
		handlePut($pdo, $input);
		break;
	case 'DELETE':
		handleDelete($pdo, $input);
		break;
	default:
	echo json_encode(['message' => 'Invalid request method']);
	break;
}

function handlePost($pdo, $input) {
	switch ($input['requestID'])
	{
		case '1':
			$sql = "SELECT UID FROM users WHERE email = :email AND password = :pwd";
			$stmt = $pdo->prepare($sql);
			$stmt->execute(['email' => $input['email'], 'pwd' => $input['pwd']]);
			$result = $stmt->fetchAll(PDO::FETCH_ASSOC);	
			echo json_encode($result);
			break;
		case '2':
			$sql = "SELECT * FROM books INNER JOIN userlist ON books.bookID=userlist.bookID WHERE UID = :UID;";
			$stmt = $pdo->prepare($sql);
			$stmt->execute(['UID' => $input['uid']]);
			$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
			echo json_encode($result);
			break;
		case '3':
			$sql = "SELECT * FROM books WHERE title LIKE :search OR author LIKE :search OR publishedYear LIKE :search OR genre LIKE :search ;";
			$stmt = $pdo->prepare($sql);
			$stmt->execute(['search' => $input['search']]);
			$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
			echo json_encode($result);
			break;
		case '4':
			$sql = "SELECT COUNT(*) FROM books INNER JOIN userlist ON books.bookID=userlist.bookID WHERE UID = :UID; 
			SELECT genre, COUNT(genre) AS count_value FROM books INNER JOIN userlist ON books.bookID=userlist.bookID WHERE UID = :UID GROUP BY genre ORDER BY count_value DESC LIMIT 1;
			SELECT author, COUNT(author) AS count_value FROM books INNER JOIN userlist ON books.bookID=userlist.bookID WHERE UID = :UID GROUP BY author ORDER BY count_value DESC LIMIT 1;
			SELECT publishedYear, title FROM books INNER JOIN userlist ON books.bookID=userlist.bookID WHERE UID = :UID ORDER BY publishedYear DESC LIMIT 1;
			SELECT publishedYear, title FROM books INNER JOIN userlist ON books.bookID=userlist.bookID WHERE UID = :UID ORDER BY publishedYear ASC LIMIT 1;";
			$stmt = $pdo->prepare($sql);
			$stmt->execute(['UID' => $input['uid']]);
			do {
				$result[] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			} while ($stmt->nextRowset());
			echo json_encode($result);
			break; 
		default;
		echo json_encode(['message' => 'Invalid request ID']);
		break;
	}
}
							
function handlePut($pdo, $input) {
	$sql = "INSERT INTO userlist (UID, bookID) VALUES (:uid, :bookid)";
	$stmt = $pdo->prepare($sql);
	$stmt->execute(['uid' => $input['UID'], 'bookid' => $input['bookID']]);
	echo json_encode(['message' => 'List updated successfully']);
}

function handleDelete($pdo, $input) {
	$sql = "DELETE FROM userlist WHERE UID = :uid AND bookID = :bookid";
	$stmt = $pdo->prepare($sql);
	$stmt->execute(['uid' => $input['UID'], 'bookid' => $input['bookID']]);
	echo json_encode(['message' => 'Book deleted successfully']);
}
?>
