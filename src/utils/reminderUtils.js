export const scheduleReminders = (nextEvent) => {
  if (nextEvent.name === "Suhoor" && nextEvent.time > new Date()) {
    const timeUntilSuhoor = nextEvent.time - new Date();
    if (timeUntilSuhoor > 15 * 60 * 1000) {
      setTimeout(
        () => alert("Suhoor ends at Fajr in 15 minutes!"),
        timeUntilSuhoor - 15 * 60 * 1000
      );
    }
  } else if (nextEvent.name === "Iftar" && nextEvent.time > new Date()) {
    setTimeout(
      () => alert("Time for Iftar is approaching!"),
      nextEvent.time - new Date() - 5 * 60 * 1000
    );
  }
};
// REMINDWER STYLING IMPORVEMENGTS!!!!!!!
