<?php
session_start();

// Generate a random 5-digit security code and store it in the session
$_SESSION['security_code'] = rand(10000, 99999);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $securityCodeInput = $_POST['security-code'] ?? '';
    if ($securityCodeInput == $_SESSION['security_code']) {
        // Retrieve form data
        $firstName = htmlspecialchars($_POST['fname']);
        $lastName = htmlspecialchars($_POST['sname']);
        $phone = htmlspecialchars($_POST['tel']);
        $email = htmlspecialchars($_POST['email']);
        $arrival = htmlspecialchars($_POST['arrival']);
        $departure = htmlspecialchars($_POST['departure']);
        $adults = htmlspecialchars($_POST['adults-count']);
        $children = htmlspecialchars($_POST['children-count']);
        $room = htmlspecialchars($_POST['room']);
        $payment = htmlspecialchars($_POST['payment']);
        $comments = htmlspecialchars($_POST['comments']);

        // Prepare email
        $to = "rozsaapartman.alsoors@gmail.com";
        $subject = "Foglalás - Rózsa Apartman";
        $message = "
            <h1>Foglalási adatok</h1>
            <p><strong>Név:</strong> $firstName $lastName</p>
            <p><strong>Telefon:</strong> $phone</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Érkezési idő:</strong> $arrival</p>
            <p><strong>Távozási idő:</strong> $departure</p>
            <p><strong>Felnőttek:</strong> $adults</p>
            <p><strong>Gyermekek:</strong> $children</p>
            <p><strong>Szoba típusa:</strong> $room</p>
            <p><strong>Fizetési mód:</strong> $payment</p>
            <p><strong>Megjegyzés:</strong> $comments</p>
        ";
        $headers = "Content-Type: text/html; charset=UTF-8";

        if (mail($to, $subject, $message, $headers)) {
            echo "Foglalás sikeresen elküldve!";
        } else {
            echo "Hiba történt az e-mail küldése közben.";
        }
    } else {
        echo "Hibás biztonsági kód. Kérjük, próbálja újra!";
    }
} else {
    echo "Érvénytelen kérés.";
}
?>