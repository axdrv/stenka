var tourch = {};
tourch.svg = document.getElementById("tourchsvg");
//tourch.geom = tourch.svg.getBoundingClientRect();
tourch.hole = $("#hole");
tourch.light = $("#light");
tourch.tourch = $("#hole, #light");
tourch.r = 200;
tourch.popup = $("#versionPopup, #counterPopup, #sajtimPopup");
tourch.mql = window.matchMedia("(orientation: landscape)");
tourch.mql.onchange = function(evt) {
  if (tourch.mql.matches) {
    arrangeEltsDeviceOrientation("landscape");
  } else {
    arrangeEltsDeviceOrientation("portrait");
  }
  defineTextProps();
};
var ua = navigator.userAgent;
function isMobile() {
  "use strict";
  return !!(
    ua.match(/(iemobile|opera mini|iphone|ipad|ipod|blackberry|andriod)/i) ||
    ua.search(/mobile/i) > 0
  );
}


if (!isMobile()) {
  //событие колёсика мыши
  window.onwheel = function() {
    if ($(tourch.svg).hasClass("active")) {
      bounds();
    } else {
      focus(event);
    }
  };
  //события tourch.svg
  $(tourch.svg).hover(
    function() {
      entered();
      bounds();
    },
    function() {
      $(tourch.tourch).attr("cy", -200);
      $("#chooseLight").css("display", "none");
      $(".unicblink").removeClass("unichover");
      $("#unicmask").attr("fill", "white");
    }
  );
  $(tourch.svg).on("mousemove", function(event) {
    if ($(this).hasClass("active")) {
      var listOfNodes = document.querySelectorAll(":hover");
      for (var i = 0; i < listOfNodes.length; i++) {
        if (listOfNodes[i].id == "unicuse") {
          $("#unicmask").attr("fill", "black");
          $(".unicblink").addClass("unichover");
        } else {
          $("#unicmask").attr("fill", "white");
          $(".unicblink").removeClass("unichover");
        }
      }
      $(tourch.tourch).each(function() {
        $(this).attr("cx", function() {
          var cx =
            Math.round(
              ((event.clientX - tourch.geom.x) / tourch.geom.width) * 100
            ) + "%";
          return cx;
        });
        $(this).attr("cy", function() {
          var cy =
            Math.round(
              ((event.clientY - tourch.geom.y) / tourch.geom.height) * 100
            ) + "%";
          return cy;
        });
      });
    }
  });

  //ниже функции для фонарика
  $(tourch.svg).on("contextmenu", function(event) {
    event.preventDefault();
    var posx = $(tourch.light).attr("cx");
    var posy = $(tourch.light).attr("cy");
    $("#chooseLight")
      .attr("x", posx)
      .attr("y", posy)
      .attr("transform", "translate(-200 -80)")
      .css("display", "block");
    $(this)
      .removeClass("active")
      .css("cursor", "pointer");
  });

  $(tourch.svg).on("click", function(event) {
    if (event.target.id == "LED") {
      $(tourch.light).attr("fill", "url(#LEDlight)");
    }
    if (event.target.id == "bulb") {
      $(tourch.light).attr("fill", "url(#bulblight)");
    }
    $(tourch.svg)
      .addClass("active")
      .css("cursor", "none");
    $("#chooseLight").css("display", "none");
  });

  // ниже события левой колонки
  $(".socialIcons").hover(socIconEvent, function() {
    $(this)
      .stop()
      .animate(
        {
          opacity: 0.5
        },
        1000
      );
    $("#popupSocialActive").hide(100, function() {
      $(this).remove();
    });
  });
  // события правой колонки
  // Всплывающие окна
  tourch.popup.on("mouseenter", function() {
    $(tourch.svg).removeClass("active");
    $(tourch.tourch).attr("cy", -200);
    if (tourch.mql.matches) {
      var len =
        $(this)
          .find("text")
          .text().length * 10;
      var popupX = $("#tourchsvg").width() - len;
      $(this)
        .find("rect")
        .attr("x", popupX + "px");
      $(this)
        .find("text")
        .attr("x", popupX + 10 + "px");
      if ($(this).attr("id") == "versionPopup") {
        $(this)
          .find("rect")
          .attr("y", "48%");
        $(this)
          .find("text")
          .attr("y", "48%");
      } else if ($(this).attr("id") == "counterPopup") {
        $(this)
          .find("rect")
          .attr("y", "70%");
        $(this)
          .find("text")
          .attr("y", "70%");
      } else {
        $(this)
          .find("rect")
          .attr("y", "90%");
        $(this)
          .find("text")
          .attr("y", "90%");
      }
    } else {
      $(this)
        .find("rect")
        .attr("x", "10px")
        .attr("y", "90%");
      $(this)
        .find("text")
        .attr("x", "12px")
        .attr("y", "90%");
    }
    $(this)
      .stop()
      .fadeIn(300);
  });

  tourch.popup.on("mouseleave", function() {
    $(this)
      .stop()
      .fadeOut(600);
    entered();
  });

  $(".popup").hover(function(event) {
    var eventElt = "#" + event.target.id + "Popup";
    $(eventElt).trigger(event.type);
  });

  // ниже анимированные элементы techFolder

  var techFolder = {
    context: "",
    getfolder: $.get("./icons/AboutPanel/folderSVG.svg"),
    folder: function() {
      return this.getfolder.responseText;
    },
    elts: function() {
      var beginColor;
      var customizedFolder = $(this.folder()).children();
      switch (this.context) {
        case "textHTML": {
          defineColors((beginColor = 2));
          break;
        }
        case "textCSS": {
          defineColors((beginColor = 6));
          break;
        }
        case "textJS": {
          defineColors((beginColor = 10));
          break;
        }
        case "textSVG": {
          defineColors((beginColor = 14));
          break;
        }
      }
      function defineColors(beginColor) {
        $(customizedFolder[2]).addClass("st" + beginColor);
        $(customizedFolder[3]).addClass("st" + (beginColor + 1));
        $(customizedFolder[4]).addClass("st" + (beginColor + 2));
        $(customizedFolder[5]).addClass("st" + (beginColor + 3));
        $(customizedFolder[6]).addClass("st" + (beginColor + 3));
      }
      return customizedFolder;
    }
  };

  $(".textSVG").one("mouseenter", function() {
    var self = this;
    var thisFolder = Object.create(techFolder);
    thisFolder.context = $(this).attr("id");
    thisFolder.elts().each(function() {
      $(this)
        .insertBefore(self)
        .hide();
    });
  });
  $(".textSVG").hover(
    function() {
      var animated = $(this)
        .parent()
        .find(".coverBorder, .coverBody, .holder, .corners")
        .toArray();
      animated.splice(
        animated.length,
        0,
        $(this)
          .parent()
          .find(".whiteShadow")[0],
        $(this)
          .parent()
          .find(".lastShadow")[0]
      );
      $(animated).each(function(index, elt) {
        $(elt)
          .stop()
          .show(index * 120);
      });
    },
    function() {
      var animated = $(this)
        .parent()
        .find(".coverBorder, .coverBody, .holder, .corners")
        .toArray();
      animated.splice(
        animated.length,
        0,
        $(this)
          .parent()
          .find(".whiteShadow")[0],
        $(this)
          .parent()
          .find(".lastShadow")[0]
      );
      animated.reverse();
      $(animated).each(function(index, elt) {
        $(elt)
          .stop()
          .hide(index * 60);
      });
    }
  );
  $("#mmask")
    .find("text")
    .each(function() {
      $(this).attr("fill", "white");
    });
  $("#unicmask").attr("fill", "white");
  $("#mouseclick").attr("display", "block");
} else {
  /* это вторая часть распознавания устройств,
которая относится к мобильным устройствам */
  /* здесь нет фонарика как такового, и маска отображает скрытый для десктопов текст */

  $("#mmask")
    .find("text")
    .each(function() {
      $(this).attr("fill", "black");
    });
  $("#unicmask").attr("fill", "black");
  $("#mouseclick").attr("display", "none");
  // событие нажатия иконок для сенсорных устройств
  $(".socialIcons").on("click", function(event) {
    if (!$(this).hasClass("active")) {
      event.preventDefault();
      $(".socialIcons").each(function() {
        $(this)
          .removeClass("active")
          .stop()
          .animate(
            {
              opacity: 0.3
            },
            500
          );
      });
      $(this).addClass("active");
      socIconEvent.call($(this));
    } else {
      $(this)
        .removeClass("active")
        .stop()
        .animate(
          {
            opacity: 0.3
          },
          500
        );
      $("#popupSocialActive").hide(100, function() {
        $(this).remove();
      });
    }
  });
  $(document).on("click", function(event) {
    if (!$(event.target).hasClass("socialIcons")) {
      $("#popupSocialActive").hide(100, function() {
        $(this).remove();
      });
      $(".socialIcons").each(function() {
        $(this)
          .removeClass("active")
          .stop()
          .animate(
            {
              opacity: 0.3
            },
            500
          );
      });
    }
  });
}
/* 
*
*
	окончание ветвления распознавания устройств 
*
*
*/

/* --- *** Все функции приложения *** --- */

// функция вызова всплывающего окна при событии с социальными иконками
function socIconEvent() {
  $(this)
    .stop()
    .animate(
      {
        opacity: 1
      },
      1000
    );
  var popupY;
  if (tourch.mql.matches) {
    popupY = $(this).attr("y");
  } else {
    popupY = "5%";
  }
  var thisLink = $(this).attr("xlink:href");

  var begin, inText;
  if (isMobile()) {
    begin = "Нажми иконку ещё раз, чтобы п";
  } else {
    begin = "П";
  }
  switch (thisLink) {
    case "#vk": {
      inText = "оделиться В Контакте";
      break;
    }
    case "#ok": {
      inText = "оделиться в Одноклассниках";
      break;
    }
    case "#mailru": {
      inText = "оделиться в Моём Мире";
      break;
    }
    case "#LI": {
      inText = "оделиться в Liveinternet";
      break;
    }
    case "#fb": {
      inText = "оделиться в Facebook";
      break;
    }
    case "#twit": {
      inText = "оделиться в Twitter";
      break;
    }
    case "#lin": {
      inText = "оделиться в Linkedin";
      break;
    }
    case "#pinst": {
      inText = "оделиться в Pinterest";
      break;
    }
  }
  if ($("#popupSocialActive").length > 0) {
    $("#popupSocialActive").remove();
  }
  var popupClone = popupFoo("#popupSocial");
  popupClone
    .find("rect")
    .attr("y", popupY)
    .attr("width", (begin.length + inText.length) / 1.5 + "em");
  popupClone
    .find("text")
    .attr("y", popupY)
    .text(begin + inText);
  tourch.svg.append(popupClone[0]);
  $("#popupSocialActive").show("slow");
}

//сброс на умолчание для вхождения фонарика в основной блок
function entered() {
  $(tourch.svg)
    .addClass("active")
    .css("cursor", "none");
  $(tourch.hole)
    .attr("r", tourch.r - 0.5)
    .attr("cy", -200);
  $(tourch.light)
    .attr("r", tourch.r)
    .attr("cy", -200);
}
// рассеивание фонарика
function focus(event) {
  event.preventDefault();
  if (event.deltaY < 0 && $(tourch.light).attr("r") > 160) {
    tourch.r -= 3;
    $(tourch.light).attr("r", tourch.r);
    $(tourch.hole).attr("r", tourch.r - 0.4);
  } else if (event.deltaY > 0 && $(tourch.light).attr("r") < 230) {
    tourch.r += 3;
    $(tourch.light).attr("r", tourch.r);
    $(tourch.hole).attr("r", tourch.r - 0.4);
  }
}

// Функция определения отношения размеров экрана и
// позиционирования элементов
function arrangeEltsDeviceOrientation(orient) {
  var socXY = 5; //позиционирование иконок соцсетей
  var incr = 0,
    panelTxtXY = ["-3%", "34%", "57.6%", "82%"],
    PanelTxtWH = ["44%", "29%", "29%", "21%"],
    iconsSVGXY = -2; //позиционирование неонов

  if (orient == "portrait") {
    $(".socialIcons").each(function() {
      $(this)
        .attr("width", "10%")
        .attr("x", socXY + "%")
        .attr("y", "55%")
        .attr("height", 40);
      socXY += 12;
    });
    $("#shareSVG")
      .attr("height", "40%")
      .attr("width", "64%")
      .attr("x", "20%")
      .attr("y", "5%");
    $("text.panelText").each(function() {
      $(this).attr("y", "60%");
    });
    $("#tech, #ver, #seen, #idea").each(function() {
      $(this)
        .attr("y", "1%")
        .attr("height", "30%")
        .attr("x", panelTxtXY[incr])
        .attr("width", PanelTxtWH[incr]);
      incr++;
    });
    $("#versionSVG")
      .attr("width", "10%")
      .attr("y", "40%")
      .attr("x", "44%");
    $("#counterSVG")
      .attr("width", "10%")
      .attr("y", "40%")
      .attr("x", "66%");
    $("#sajtim")
      .attr("width", "10%")
      .attr("y", "40%")
      .attr("x", "85%")
      .attr("height", "40");
    $(".iconsSVG").each(function() {
      $(this)
        .attr("width", "20%")
        .attr("height", "80px")
        .attr("x", iconsSVGXY + "%")
        .attr("y", "15%");
      iconsSVGXY += 7;
    });
  } else {
    $(".socialIcons").each(function() {
      $(this)
        .attr("width", "50%")
        .attr("x", "45%")
        .attr("y", socXY + "%")
        .attr("height", 50);
      socXY += 12;
    });
    $("#shareSVG")
      .attr("width", "30%")
      .attr("height", "69%")
      .attr("x", "2%")
      .attr("y", "20%");
    $("text.panelText").each(function() {
      $(this).attr("y", "48%");
    });
    $("#tech, #ver, #seen, #idea").each(function() {
      $(this)
        .attr("x", "75%")
        .attr("width", "25%")
        .attr("y", panelTxtXY[incr])
        .attr("height", PanelTxtWH[incr]);
      incr++;
    });

    $("#versionSVG")
      .attr("width", "70%")
      .attr("x", "5%")
      .attr("y", "46%");
    $("#counterSVG")
      .attr("width", "70%")
      .attr("x", "5%")
      .attr("y", "72%");
    $("#sajtim")
      .attr("width", "60%")
      .attr("x", "10%")
      .attr("y", "88%")
      .attr("height", "65");
    $(".iconsSVG").each(function() {
      $(this)
        .attr("width", "75%")
        .attr("height", "120px")
        .attr("y", iconsSVGXY + "%")
        .attr("x", "10%");
      iconsSVGXY += 7;
    });
  }
}
// определение всплывающих посказок для кнопок "поделиться" в соцсетях
function popupFoo(thisId) {
  var thisClone = $(thisId)
    .clone()
    .attr("id", function() {
      var popupId = $(this).attr("id") + "Active";
      return popupId;
    })
    .css({ display: "none" });
  return thisClone;
}

// включение неоновых элементов
function neonSwitchOn() {
  $("#neon").addClass("neonSwitchOn");
  $(".neon").each(function(index) {
    var self = this;
    setTimeout(function() {
      $(self).removeClass("neon");
    }, index * 200 + 500);
  });
}
//определяет размер экрана при любом его изменении
function bounds() {
  tourch.geom = tourch.svg.getBoundingClientRect();
}
//функция defineTextProps определяет текст в неоновых окнах

function defineTextProps() {
  var browsr = navigator.userAgent;
  var isFF = Number(browsr.search(/firefox/i));
  console.log(browsr, isFF);
  var sizeForWebKit = [14, 8, 5, 5, 4];
  var incr = 0;
  if (isFF <= 0) {
    $("text.panelText").each(function() {
      $(this).attr("textLength", sizeForWebKit[incr] + "em");
      incr++;
    });
  }
  if (tourch.mql.matches) {
    $("text.panelText").each(function() {
      $(this).attr("font-size", "20");
    });
  } else {
    $("text.panelText").each(function() {
      $(this).attr("font-size", "32");
    });
  }
}

// ****СОБЫТИЯ****
//события window
window.onload = function() {
  bounds();
  $(tourch.mql).trigger("change");
  if (!isMobile()) {
    entered();
    tourch.popup.fadeOut();
  } else {
    $("#sajtimPopup")
      .find("rect")
      .attr("x", "40%")
      .attr("y", "95%");
    $("#sajtimPopup")
      .find("text")
      .attr("x", "41%")
      .attr("y", "95%");
    $("#sajtimPopup").fadeIn(300);
  }
  neonSwitchOn();
  $(tourch.light).attr("fill", "url(#bulblight)");

  $(".popupRect")
    .attr({ height: 26, stroke: "#a58af696", fill: "#2c2cff2e" })
    .attr("stroke-width", 0.2);
};
window.onresize = function() {
  bounds();
};

/* функция вызова счётчика посещений */

function callCounter() {
  var seen,
    oldSeen = $("#counter").text();
  $.getJSON("/counter.json", function(data) {
    if (oldSeen !== data.seen) {
      $("#counter")
        .hide()
        .text(data.seen)
        .show("slow");
      seen = data.seen;
    }
  });
}
var call2000 = setInterval(callCounter, 5000);

$(document).one("mouseleave", function() {
  let read = document.createElement("div");
  $(read).addClass("read");
  let stop = document.createElement("h1");
  stop.innerText = "ПОСТОЙ!";
  let text = document.createElement("p");
  text.innerText =
    "Да, этот сайт не блещет дизайном.\nБольше похоже на баловтсво :-)\nПросто, обрати внимание, что он полностью сделан на SVG.\nПосле открытия тега 'body' там только три html тега\n Один 'div' и два скрипта.";
  let checkElt = document.createElement("p");
  checkElt.innerText =
    "Ты и сам можешь проверить это,\nнажав правую кнопу мыши и выбрав 'Исходный код страницы'.\nТолько сделать это надо на какой-нибудь из боковых панелей.\nА вообще, ты прав, это действительно баловство :-)";
  let readCloseBtn = document.createElement("button");
  readCloseBtn.innerText = "Закрыть";
  read.appendChild(stop);
  read.appendChild(text);
  read.appendChild(checkElt);
  read.appendChild(readCloseBtn);
  readCloseBtn.onclick = function() {
    $(read).remove();
  };
  $(".wrapper").append(read);
});
