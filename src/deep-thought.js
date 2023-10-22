self.onmessage = ({ data: { question } }) => {
  let resp=0;
  for (let i =0; i<question; i++ ){
    resp+=i
  }
  self.postMessage({
    answer: resp,
  });
};