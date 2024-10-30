export const calculateTimeAgo = (millisec) => {
  const minAgo = Math.round((Date.now() - new Date(millisec)) / 1000 / 60);
  let time = null;

  if (minAgo / 60 / 24 >= 1) {
    const daysAgo = Math.trunc(minAgo / 60 / 24);
    time = `${daysAgo} days ago`;
  } else if (minAgo / 60 >= 1) {
    const hoursAgo = Math.trunc(Number(minAgo) / 60);
    time = `${hoursAgo} h. ago`;
  } else {
    time = `${minAgo} min. ago`;
  }
  return time;
};
