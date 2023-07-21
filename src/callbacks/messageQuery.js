const messageQuery = (message)=>{
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const nicknameRegex = /^[A-Za-z0-9_]+(?=\s*,|$)/
  
    const emailMatch = message.match(emailRegex);
    const nicknameMatch = message.match(nicknameRegex);
  
    const result = {
      email: emailMatch ? emailMatch[0] : null,
      nickname: nicknameMatch ? nicknameMatch[0] : null,
    };
  
    return(result);
}

module.exports = {messageQuery};