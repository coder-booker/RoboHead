

const waiter = (text="", time=1000) => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (text !== "") {
        console.log("waiting", text);
      }
      resolve();
    }, time);
  });
}

const mover = async (distance) => {
  await waiter("move", 2000);

}

export default waiter;