const path = require("path");
const express = require("express");
const app = express();
const axios = require("axios");

const bodyParser = require("body-parser");

const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const os = require("os");
const { selectApi, insertApi, deleteApi } = require("./db");

app.use(express.static(path.join(__dirname, "public")));
// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

async function parafrasear(input, idioma, res) {
  const options = {
    method: "POST",
    url: "https://paraphrasing-and-rewriter-api.p.rapidapi.com/rewrite-light",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "4304a757b4mshd51314db41874f9p1cccbdjsn443b2be1ac8e",
      "X-RapidAPI-Host": "paraphrasing-and-rewriter-api.p.rapidapi.com",
    },
    data: {
      from: idioma,
      text: input,
    },
  };

  try {
    const response = await axios.request(options);
    res.send(response.data);
  } catch (error) {
    res.send(
      "<span style='color: red;'>Ocurrió un error vuelva a intentarlo. : <i>" +
        error +
        "</i></span>"
    );
  }
}

async function generateText(input, res) {
  try {
    //createChatCompletion
    //createCompletion
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: input }],
      /*model: "text-davinci-003",
        prompt: input,
        temperature: 0.9,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 1.0,
        presence_penalty: 0.0,
        stop: ["Human: ","AI: "],*/
    });

    //promtanterior = input
    quitaretiquetas = response.data.choices[0].message.content
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "\n<br>")
      .replace(/(^<br><br>)/gm, "");
    //quitaretiquetas = response.data.choices[0].text.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>").replace(/(^<br><br>)/gm,"")

    res.send(quitaretiquetas);
  } catch (error) {
    //generateText(input, res)
    res.send(
      "<span style='color: red;'>Ocurrió un error vuelva a intentarlo. : <i>" +
        error +
        "</i></span>"
    );
  }
}

app.set("port", process.env.PORT || 3000);

const server = app.listen(app.get("port"), () => {
  console.log("server port:", app.get("port"));
});

// HOME
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/gpt", (req, res) => {
  var msg = req.body.prompt;
  generateText(msg, res);
});
app.post("/parafrasear", (req, res) => {
  var input = req.body.prompt;
  var idioma = req.body.idioma;
  parafrasear(input, idioma, res);
});

app.get("/get-api/", (req, res) => {
  selectApi(res);
});
app.get("/save-api/:api", (req, res) => {
  const apiSeacrh = req.params.api;

  if (apiSeacrh == "x") {
    deleteApi();
  } else {
    deleteApi();
    insertApi(apiSeacrh);
    selectApi(res);
  }
});
