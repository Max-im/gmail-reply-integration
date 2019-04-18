module.exports = messages => {
  const excludeDomainArr = ["idealscorp.com", "idealsmail.com"];
  const people = {};

  messages.forEach(msg => {
    parseUser("From", msg);
    parseUser("To", msg);
  });

  const targetPeople = Object.keys(people)
    .filter(email => {
      const domain = email.replace(/.*@/, "");
      if (!excludeDomainArr.includes(domain)) return true;
      return false;
    })
    .map(email => email);

  return targetPeople;

  function parseUser(str, msg) {
    const theHeaders = msg.payload.headers.filter(el => el.name === str);

    // !!! there were threads with empty "To" headers, need to check if the headers not empty
    if (theHeaders.length > 0) {
      theHeaders[0].value.split(",").forEach(item => {
        // contact contains email and name
        if (item.match(/</)) {
          const userData = item.split("<");
          const email = userData[1]
            .replace(/>/, "")
            .trim()
            .toLowerCase();
          people[email] = true;
        }

        // contact contains email only
        else {
          const email = item.trim().toLowerCase();
          if (email.match(/.*@.*/)) {
            people[email] = true;
          }
        }
      });
    }
  }
};
