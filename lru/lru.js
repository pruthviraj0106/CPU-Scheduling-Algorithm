function lru(pages, n, capacity) {
  let s = new Set(); // Declared s set as object which stores pages
  let indexes = new Map(); // declared indexes as object which stores indexes
  let page_faults = 0;

  let r = capacity + 3, // setting r's given capacity + 3
    c = pages.length + 2,
    val = " ";
  let arr2 = new Array(r); // declared 2D array
  for (let i = 0; i < r; i++) {
    arr2[i] = Array(c).fill(val);
  }
  arr2[0][0] = "No"; // setting NO as no of columns
  arr2[1][0] = "Reference"; // setting dynamic reference from user
  for (let i = 2; i < r - 1; i++) arr2[i][0] = "Frame"; // declaring frames
  arr2[r - 1][0] = "Hit"; // setting hit/miss string with respective ratio to n-1
  for (let j = 0; j <= pages.length; j++) arr2[0][j + 1] = j;

  for (let i = 0; i < n; i++) {
    let prev_page_faults = page_faults;
    arr2[1][2 + i] = pages[i];
    if (s.size < capacity) {
      // checks if size of set is less than capacity
      if (!s.has(pages[i])) {
        // checks if current page is preset in set or not
        s.add(pages[i]); // if above true page is added in the set
        page_faults++;
      }
      indexes.set(pages[i], i); // index values gets updated
    } else {
      if (!s.has(pages[i])) {
        let lru = Number.MAX_VALUE,
          val = Number.MIN_VALUE;

        for (let itr of s.values()) {
          // current value stored in temp
          let temp = itr; //
          if (indexes.get(temp) < lru) {
            // compare index of temp and lru
            lru = indexes.get(temp); // if above true then lru values gets updated
            val = temp;
          }
        }
        s.delete(val);
        indexes.delete(val);
        s.add(pages[i]);
        page_faults++;
      }
      indexes.set(pages[i], i);
    }
    if (prev_page_faults === page_faults) {
      // checks whether the fault is happened or not
      arr2[r - 1][i + 2] = "HIT";
    } else {
      arr2[r - 1][i + 2] = "MISS";
    }
    let k = indexes.size - 1, // updating the value of arr2 (array)
      ind = 0; // it updates the current value of row
    for (let itr of indexes) {
      arr2[2 + ind][2 + i] = itr[0];
      ind++;
    }
  }
  console.log(arr2);
  buildTable(arr2);
  return page_faults;
}

// getting the user data from html
function pushData() {
  let summaryCheck = document.querySelector("#Summary").checked;
  if (!summaryCheck) {
    const part1 = document.querySelector(".part1");
    part1.innerHTML = "";
  }
  let pra = document.querySelector("#pra").value;
  pra = pra.toString();

  pages = [];
  let inputText = document.getElementById("references").value;
  let frames = Number(document.querySelector(".noofframes").value);
  inputText = inputText.split(" ");
  for (let i = 0; i < inputText.length; i++) {
    inputText[i] = Number(inputText[i]);
    pages.push(Number(inputText[i]));
  }

  let faults = 0;
  if (pra === "LRU") {
    faults = lru(pages, pages.length, frames);
  } else {
    const part2 = document.querySelector(".part2");
    document.querySelector(".part1").innerHTML = "";
    document.querySelector(".part3").innerHTML = "";
    part2.innerHTML = "";
    return;
  }
  buildSchedule(frames, pra, pages, faults, summaryCheck);
}
// Summary Part Starts
function buildSchedule(frames, str, pages, faults, summaryCheck) {
  if (summaryCheck) {
    const part1 = document.querySelector(".part1");
    part1.innerHTML = "";
    const head = document.createElement("div");
    head.id = "head";
    head.innerHTML = `<h2 style="margin-left: 20px">Summary </h2><br>`;
    part1.appendChild(head);
    const base = document.createElement("div");
    base.id = "base";
    base.innerHTML = `
    <ul style="margin-left: 20px">
        <ul>Total Frames : ${frames}</ul>
        <ul>Algorithm : ${str}</ul>
        <ul>Reference String Length : ${pages.length} References</ul>
        <ul>String : ${pages}</ul>
      </ul><br>`;
    part1.appendChild(base);
  } // Summary Part ends

  // Observation Part Starts
  const count = {};
  pages.forEach((element) => {
    count[element] = (count[element] || 0) + 1;
  });
  const distinctPages = Object.keys(count).length;
  const part3 = document.querySelector(".part3");
  part3.innerHTML = "";
  const head1 = document.createElement("div");
  head1.id = "head1";
  head1.innerHTML = `<br><h2 style="margin-left: 20px">Observation </h2>`;
  part3.appendChild(head1);
  const calcs = document.createElement("div");
  calcs.innerHTML = `<br><ul style="margin-left: 20px"><ul>Total References : ${
    pages.length
  }</ul>
        <ul>Total distinct references : ${distinctPages}</ul>
        <ul>Hits : <b> ${pages.length - faults} </b> </ul>
        <ul>Faults : <b> ${faults} </b></ul>
        <ul><b>Hit rate : </b> ${pages.length - faults}/${pages.length} = <b>${(
    (1 - faults / pages.length) *
    100
  ).toFixed(2)}</b>%</ul>
        <ul><b>Fault rate : </b> ${faults}/${pages.length} = <b>${(
    (faults / pages.length) *
    100
  ).toFixed(2)}</b>%</ul></ul><br>`;
  part3.appendChild(calcs);
} // Observation Part ends

// Table Part Starts
function buildTable(arr) {
  const part2 = document.querySelector(".part2");
  part2.innerHTML = "";
  var mytable = '<table style="margin-left: 20px">';
  let i = 0,
    j = 0;
  for (var CELL of arr) {
    mytable += `<tr class="r${i}">`;
    for (var CELLi of CELL) {
      if (CELLi === "MISS" || CELLi == "HIT") {
        mytable += `<td class="c${j} ${CELLi}">` + CELLi + "</td>";
      } else {
        mytable += `<td class="c${j} ">` + CELLi + "</td>";
      }
      j++;
    }
    j = 0;
    mytable += "</tr>";
    i++;
  }

  mytable += "</table>";
  part2.innerHTML = mytable;
} // Table Part ends

// reset function
function resetform() {
  window.location.reload();
}
