const express = require("express");
const fs = require("fs");
const cors = require("cors");
//node server.js
const app = express();

app.use(cors());
app.use(express.json());

app.post("/save-score", (req, res) => {
    console.log("SAVE REQUEST:", req.body);

    try {

        const { name, score, highscore } = req.body;

        let data = [];

        if (fs.existsSync("data.json")) {
            const fileContent = fs.readFileSync("data.json", "utf8");

            if (fileContent.trim() !== "") {
                data = JSON.parse(fileContent);
            }
        }

        const player = data.find(
            p => p.Speler.Naam === name
        );

        if (player) {
            player.Speler.score = score;

            if (score > player.Speler.highscore) {
                player.Speler.highscore = score;
            }
        } else {
            data.push({
                Speler: {
                    Naam: name,
                    score: score,
                    highscore: score
                }
            });
        }

        fs.writeFileSync(
            "data.json",
            JSON.stringify(data, null, 2)
        );

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


app.listen(3000, () => {
    console.log("Server started on port 3000");
});