/*document.getElementById("settings-modal").addEventListener("click",()=>{
    modal_("true")
})*/
document.addEventListener("DOMContentLoaded", (event) => {
  document.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightBlock(block);
  });
});
function clearText(btn) {
  document.getElementById('in-text').value='';btn.style.display='none'

  if (localStorage.getItem("prompt") == "Paraphrase the following text:") {
    const lengthtext = document.getElementById("in-text").value.length
    if (lengthtext>10000) {
      document.getElementById("in-text").style.border = "2px solid red"
      document.getElementById("in-text").style.outlineColor = "red"
      document.getElementById("btn-input").disabled=true
      document.getElementById("btn-input").style.background = "#EEEEEE"
      alerta("I exceeded the character limit ("+lengthtext+"/10000)")
    }else{
      document.getElementById("in-text").style.border = "none"
      document.getElementById("btn-input").disabled=false
      document.getElementById("btn-input").style.background = "#1f2937"
      document.getElementById("in-text").style.outlineColor = "#1f2937"
    }
  }
  
}
function validate_in_text(text) {

  if (localStorage.getItem("prompt") == "Paraphrase the following text:") {
    const lengthtext = text.value.length
    if (lengthtext>10000) {
      document.getElementById("in-text").style.border = "2px solid red"
      document.getElementById("in-text").style.outlineColor = "red"
      document.getElementById("btn-input").disabled=true
      document.getElementById("btn-input").style.background = "#EEEEEE"
      alerta("I exceeded the character limit ("+lengthtext+"/10000)")
    }else{
      document.getElementById("in-text").style.border = "none"
      document.getElementById("btn-input").disabled=false
      document.getElementById("btn-input").style.background = "#1f2937"
      document.getElementById("in-text").style.outlineColor = "#1f2937"
    }
  }

  if (text.value.length > 0) {
    document.getElementById("btn-clear").style.display = "block";
  } else {
    document.getElementById("btn-clear").style.display = "none";
  }
}
document.getElementById("btn-input").addEventListener("click", () => {
  document.getElementById("btn-input").disabled = true;
  document.getElementById("btn-input").innerHTML = "Generating...";
  document.getElementById("in-text").readOnly = true;
  const msgsend = document.getElementById("in-text").value;
  

  if (msgsend.length == 0) {
    alerta("empty text");
    document.getElementById("in-text").focus();
    document.getElementById("btn-input").disabled = false;
    document.getElementById("btn-input").innerHTML = "Generate";
    document.getElementById("in-text").readOnly = false;
  } else {
    document.getElementById("out-text").innerHTML = ""
    sendPrompt(msgsend);
  }
});

localStorage.setItem("prompt", "Paraphrase the following text:");
localStorage.setItem("idioma", ", response in english");
function modal_(params) {
  const modal = document.querySelector(".modal");
  if (params == "true") {
    modal.style.display = "flex";

    setTimeout(() => {
      modal.style.opacity = "1";
    }, 300);
  } else {
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  }
}

document.getElementById("save-settings").addEventListener("click", () => {
  // Ejemplo de uso de la función
  const apiOpenai = document.getElementById("txtApi").value;
  let apisend;
  if (apiOpenai.length == 0) {
    apisend = "x";
  } else {
    apisend = apiOpenai;
  }
  $.ajax({
    url: "/save-api/" + apisend,
    success: function (response) {
      if (response == "") {
        console.log(response);
      } else {
        modal_("false");
      }
    },
  });
});

//window.onload=getApi()
function getApi() {
  $.ajax({
    url: "/get-api/",
    method: "get",
    success: function (response) {
      if (response == "empty") {
        modal_("true");
      } else {
        localStorage.setItem("apisend", response);
        document.getElementById("txtApi").value = response;
      }
    },
  });
}

function handleOptionSelected(optionValue) {
  const lblTitle = document.getElementById("lblTitle");
  switch (optionValue) {
    case "1":
      document.getElementById("idioma").style.opacity = "1";
      document.getElementById("idioma").disabled = false;
      document.getElementById("idioma").value = localStorage.getItem("idioma");
      localStorage.setItem("prompt", "Paraphrase the following text: ");
      lblTitle.innerHTML = "Enter text to paraphrase";
      break;
    case "2":
      document.getElementById("idioma").style.opacity = "0";
      document.getElementById("idioma").disabled = true;
      document.getElementById("idioma").value = "";
      localStorage.setItem(
        "prompt",
        "Corrects sentences into standard English: "
      );
      lblTitle.innerHTML = "Enter text to grammar correction english";
      break;
    case "3":
      document.getElementById("idioma").style.opacity = "0";
      document.getElementById("idioma").disabled = true;
      document.getElementById("idioma").value = "";
      localStorage.setItem(
        "prompt",
        "Corrects sentences into standard Spanish: "
      );
      lblTitle.innerHTML = "Enter text to grammar correction spanish";
      break;
    case "4":
      document.getElementById("idioma").style.opacity = "1";
      document.getElementById("idioma").disabled = false;
      document.getElementById("idioma").value = localStorage.getItem("idioma");
      localStorage.setItem(
        "prompt",
        "Extract in list keywords from this text: "
      );
      lblTitle.innerHTML = "Enter text to extract keywords from text";
      break;
    case "5":
      document.getElementById("idioma").style.opacity = "1";
      document.getElementById("idioma").disabled = false;
      document.getElementById("idioma").value = localStorage.getItem("idioma");
      localStorage.setItem("prompt", "Create an outline for an essay about ");
      lblTitle.innerHTML = "Enter the theme of the scheme to be made";
      break;
    case "6":
      document.getElementById("idioma").style.opacity = "1";
      document.getElementById("idioma").disabled = false;
      document.getElementById("idioma").value = localStorage.getItem("idioma");
      localStorage.setItem("prompt", "");
      lblTitle.innerHTML = "Enter question to ask";
      break;
    default:
      document.getElementById("idioma").style.opacity = "0";
      document.getElementById("idioma").disabled = true;
      console.log("Opción inválida");
      break;
  }
}


function sendPrompt(message) {
  //encodeURIComponent()

  if (localStorage.getItem("prompt") == "Paraphrase the following text:x") {
    let idomare;
    if (localStorage.getItem("idioma") == ", response in english") {
      idomare = "en";
    } else {
      idomare = "es";
    }

    $.ajax({
      url: "/parafrasear",
      method: "post",
      data: {
        prompt: message,
        idioma: idomare,
      },
      success: function (response) {
        document.getElementById("btn-input").disabled = false;
        document.getElementById("btn-input").innerHTML = "Generate";
        document.getElementById("in-text").readOnly = false;
        
        document.getElementById("out-text").innerHTML =
          convertToCodeBlock(response);
        console.log(convertToCodeBlock(response));
      },
    });
  } else {
    let msgsend =
      localStorage.getItem("prompt") +
      message +
      document.getElementById("idioma").value;

    $.ajax({
      url: "/gpt",
      method: "post",
      data: {
        prompt: msgsend,
      },
      success: function (response) {
        document.getElementById("btn-input").disabled = false;
        document.getElementById("btn-input").innerHTML = "Generate";
        document.getElementById("in-text").readOnly = false;

        document.getElementById("out-text").innerHTML =
          convertToCodeBlock(response);
      },
    });
  }
}

document.getElementById("copyButton").addEventListener("click", function () {
  const text = document.getElementById("out-text").textContent;

  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);

  textarea.select();
  document.execCommand("copy");

  document.body.removeChild(textarea);

  alerta("copied text");
});

/**FUNCION ALERTA */

function alerta(mensaje) {
  document.getElementById("message-alert").innerHTML = mensaje;
  $(".alert-message").css("top", "50px");

  setTimeout(() => {
    $(".alert-message").css("top", "-110%");
  }, 4000);
}

function convertToCodeBlock(text) {
  var pattern = /```(.*?)```/gs;
  var matches = text.matchAll(pattern);

  for (const match of matches) {
    var code = match[1].trim().split("<br>");
    var lang = code[0].trim();
    var codeLines = code.slice(1).join("<br>");
    var codeBlock =
      '<pre><code class="' + lang + '">' + codeLines + "</code></pre>";
    text = text.replace("```" + match[1] + "```", codeBlock);
  }

  return text;

  /*var pattern = /```(.*?)```/gs;
    var matches = text.matchAll(pattern);

    for (const match of matches) {
      var code = match[1].trim();
      var codeBlock = '<pre><code>' + code + '</code></pre>';
      text = text.replace("```" + match[1] + "```", codeBlock).replace("python<br>","python<br><br>").replace("javascript<br>","javascript<br><br>").replace("java<br>","java<br><br>").replace("c<br>","c<br><br>").replace("c++<br>","c++<br><br>").replace("swift<br>","swift<br><br>").replace("typescript<br>","typescript<br><br>");
    }

    return text;*/
}
