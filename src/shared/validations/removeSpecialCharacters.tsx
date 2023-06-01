function removeSpecialCharacters(string:any) {
    if (typeof string === 'string' || string instanceof String) {
      return string.replace(/[./\-() ]/g, "");
    }
    return "";
  }
  
  export default removeSpecialCharacters;
  