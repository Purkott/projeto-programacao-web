<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "website";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Conexao falhou: " . $e->getMessage());
}
?>