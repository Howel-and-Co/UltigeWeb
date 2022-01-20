const randomColorHSL = (string) => {
  const hashCode = (str) => { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  } 
  
  const intToHSL = (i) => {
    return `hsl(${i * 28}, 70%, 50%)`;
  }

  return intToHSL(hashCode(string));
}


export default randomColorHSL;