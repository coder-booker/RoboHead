

const unitWait = (time=10) => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}


export default unitWait;