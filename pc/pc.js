// Initialize the buffer and other variables
let buffer = [];
let buffer_size = 0;
let num_produce = 0;
let num_consume = 0;
let in_ptr = 0;
let out_ptr = 0;
let count = 0;
const op = document.getElementById("output");

// Created the monitor object
const monitor = {
  // Producer method
  async produce(item) {
    while (count == buffer_size) {
      op.innerHTML += "Buffer is full, waiting for consumer to consume...";
      await this.wait(this.produce);
    }
    buffer[in_ptr] = item;
    in_ptr = (in_ptr + 1) % buffer_size;
    count++;
    const div = document.createElement("div");
    div.innerText = `Produced Items ${item}`;
    op.appendChild(div);
  },
  // Consumer method
  async consume() {
    while (count == 0) {
      op.innerHTML +=
        "Buffer is empty, waiting for producer to produce more items...";
      await this.wait(this.consume);
    }
    const item = buffer[out_ptr];
    out_ptr = (out_ptr + 1) % buffer_size;
    count--;
    const div = document.createElement("div");
    div.innerText = `Consumed Items ${item}`;
    op.appendChild(div);
  },
};

//taking user input from user function
function input() {
  buffer_size = document.getElementById("bs").value;
  num_produce = document.getElementById("pro").value;
  num_consume = document.getElementById("con").value;

  for (let i = 1; i <= num_produce; i++) {
    monitor.produce(i);
  }
  for (let i = 1; i <= num_consume; i++) {
    monitor.consume();
  }
}
// Consume Rem Function
function consumeRem() {
  if (buffer.length != 0) {
    while (buffer.length != 0) {
      const item = buffer.pop();
      const div = document.createElement("div");
      div.innerText = `Consumed Remaining Items ${item}`;
      op.appendChild(div);
    }
  }
}

// reset page function
function resetform() {
  window.location.reload();
}

// Add the wait and notify functions to the monitor object
monitor.waitingQueue = [];

monitor.wait = function (callback) {
  this.waitingQueue.push(callback);
  return new Promise((resolve) => {
    this.waitResolve = resolve;
  });
};

monitor.notify = function (callback) {
  const waitingCallback = this.waitingQueue.shift();
  if (waitingCallback === callback) {
    this.waitResolve();
  }
};
