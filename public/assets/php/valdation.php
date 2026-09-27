<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $name = strip_tags(trim($_POST["name"]));
  $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
  $message = trim($_POST["message"]);

  if (empty($name) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($message)) {
    http_response_code(400);
    echo "Invalid input.";
    exit;
  }

  $recipient = "info@crystalclearwindows.com";
  $subject = "New Contact Message";
  $email_content = "Name: $name\nEmail: $email\n\nMessage:\n$message";
  $headers = "From: <$email>";

  if (mail($recipient, $subject, $email_content, $headers)) {
    echo "Thank you! Your message has been sent.";
  } else {
    http_response_code(500);
    echo "Oops! Something went wrong.";
  }
}
?>
