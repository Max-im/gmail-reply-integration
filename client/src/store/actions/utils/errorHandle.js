/**
 * @name errorHandle
 * @summary - trigger new Error
 * @argument { Error } err
 * @argument { string } alt
 */
export const errorHandle = (err, alt) => {
  if (err && err.response && err.response.data) {
    throw err.response.data;
  } else if (err && typeof err == "string") {
    throw err;
  } else {
    console.error(err);
    throw alt;
  }
};
