$(function () {
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse("hide");
    }
  });

  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});

$("#animate-button").click(function () {
  btn1.disabled = true;
  var b = document.forms["myForm"]["bitstream-input"].value;
  var i = document.forms["myForm"]["initial-input"].value;
  if (b == "") {
    alert("Enter the Sequence of Request queue!");
    return false;
  }
  if (b != "" && i == "") {
    alert("Enter the value of Initial Cylinder!");
    return false;
  }

  var ini = parseInt(document.getElementById("initial-input").value);
  var str = document.getElementById("bitstream-input").value;

  var inp = [],
    r2 = str.split(" "),
    r3;
  for (a1 = 0; a1 < r2.length; ++a1) {
    if (r2[a1] == "") {
      continue;
    }
    r3 = parseInt(r2[a1]);
    inp.push(r3);
  }

  ini = parseInt(ini);

  if (
    $("div.left").hasClass("transform") &&
    window.matchMedia("(min-width: 1249px)").matches
  ) {
    $(".left").css("width", "30%");
    $(".left").css("margin", "30px");
    $("#plot-button").css("margin-left", "30px");
    $("#plot-button").css("margin-bottom", "5%");
    $(".container2").css("top", "800px");
    $(".container3").css("top", "1500px");

    setTimeout(function () {
      document.getElementById("canvas").style.visibility = "visible";
      myalgorithm(document.getElementById("algorithm").value, inp, ini);
    }, 500);
  }
});

/***** GRAPH STARTS *****/
var pre, v1, v2, v3, v4, v5, v6;

function sstf(inp, ini) {
  var x1 = [];
  var y1 = [];
  var seek = 0;
  var visited = [];
  var a1, a2;
  for (a1 = 0; a1 < inp.length; ++a1) {
    visited[a1] = 0;
  }

  x1.push(ini);
  y1.push(0);
  var hold = ini;
  for (a1 = 1; a1 <= inp.length; ++a1) {
    var mn = 10000;
    var idx;
    for (a2 = 0; a2 < inp.length; ++a2) {
      if (visited[a2] == 0) {
        if (Math.abs(hold - inp[a2]) < mn) {
          idx = a2;
          mn = Math.abs(hold - inp[a2]);
        }
      }
    }
    seek = seek + Math.abs(hold - inp[idx]);
    visited[idx] = 1;
    hold = inp[idx];
    x1.push(inp[idx]);
    y1.push(-1 * a1);
  }

  var trace1 = {
    x: x1,
    y: y1,
    type: "scatter",
  };

  var data = [trace1];
  v2 = seek;

  return [data, seek];
}

/***** GRAPH ENDS *****/

/***** ALGO STARTS *****/

// getting the user input from the user, function
function getBitStreamAndPlot(event, r1, ini, alg) {
  var b = document.forms["myForm"]["bitstream-input"].value;
  var i = document.forms["myForm"]["initial-input"].value;
  if (b == "") {
    alert("Enter the Sequence of Request queue!");
    return false;
  }
  if (b != "" && i == "") {
    alert("Enter the value of Initial Cylinder!");
    return false;
  }

  var inp = [],
    r2 = r1.split(" "),
    r3;
  for (a1 = 0; a1 < r2.length; ++a1) {
    if (r2[a1] == "") {
      continue;
    }
    r3 = parseInt(r2[a1]);
    inp.push(r3);
  }

  ini = parseInt(ini);
  pre = 1;

  if (alg == "sstf") {
    var alg_use = sstf(inp, ini);
    var plt_alg = "SHORTEST <span> SEEK </span> TIME <span>FIRST";
  }
  var data = alg_use[0];
  var seek = alg_use[1];

  var layout = {
    xaxis: {
      autorange: true,
      showgrid: true,
      zeroline: false,
      showline: true,
      autotick: true,
      ticks: "",
      showticklabels: true,
      title: "Cylinder Number",
    },
    yaxis: {
      autorange: true,
      showgrid: false,
      zeroline: false,
      showline: false,
      autotick: true,
      ticks: "",
      showticklabels: false,
    },
  };

  if (pre) {
    Plotly.newPlot("graph_area", data, layout);
    var val = data[0].x;
    var tot_seek = "Seek-Time: ";
    for (var i = 1; i < val.length; i++) {
      tot_seek =
        tot_seek +
        " | " +
        val[i].toString() +
        " - " +
        val[i - 1].toString() +
        " | ";
      if (i < val.length - 1) tot_seek = tot_seek + " + ";
    }
    document.getElementById("plt_alg_name").innerHTML = plt_alg;
    document.getElementById("cal-seek").innerHTML = tot_seek + " = " + seek;

    document.getElementById("graph_area").style.visibility = "visible";
  }
}
/***** ALGO ENDS *****/
//reset page function
function resetform() {
  window.location.reload();
}
