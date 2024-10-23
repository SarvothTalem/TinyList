<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Warhammer 40k Army List Parser</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        textarea {
            width: 100%;
            height: 200px;
        }
        button {
            padding: 10px;
            background-color: #007bff;
            color: #fff;
            border: none;
            cursor: pointer;
            margin-top: 10px;
        }
        button:hover {
            background-color: #0056b3;
        }
        #output {
            margin-top: 20px;
            white-space: pre-wrap;
            background-color: #f9f9f9;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>Warhammer 40k Army List Parser</h1>
    <p>Paste your army list below:</p>
    <textarea id="armyList" placeholder="Paste your Warhammer 40k army list here..."></textarea>
    <button onclick="parseList()">Simplify List</button>

    <h2>Parsed List:</h2>
    <div id="output"></div>
</div>

<script>
    // JavaScript parsing function (the code from above)
</script>

</body>
</html>