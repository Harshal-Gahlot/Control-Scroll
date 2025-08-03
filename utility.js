function displayMessage(msg) {
    document.documentElement.innerHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Shorts Limit Reached</title>
</head>
<body style="margin:0; padding:0; height:100vh; width:100vw; display:grid; place-items:center; background-color:black;">
    <h1 style="background-color:#f00; padding:20px; margin:0;">${msg}</h1>
</body>
</html>`;
}