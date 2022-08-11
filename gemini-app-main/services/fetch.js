
/**
 * Get method
 * @param url
 * @returns {Promise<R>}
 */
const get = (url, options = {}, token) => {
  return new Promise((resolve, reject) => {

    const isQuery = url.indexOf('?') >= 0;

    let authHeader = token
      ? `Bearer ${token}`
      : ""

    console.log("Url: ", url)
    console.log("authHeader: ", authHeader)

    fetch(url, {
      ...options,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("response: ", data)
        if (!data.status || data.status == 0) {
          reject(new Error(data.message));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        return error;
      });
  });
};

/**
 * Post method
 * @param url
 * @param data
 * @param method
 * @returns {Promise<R>}
 */
const post = (url, data, method = 'POST', type = 'none',token) => {
  return new Promise((resolve, reject) => {

    const isQuery = url.indexOf('?') >= 0;

    let authHeader = token
      ? `Bearer ${token}`
      : ""

    console.log("Url: ", url)
    console.log("authHeader: ", authHeader)
    console.log("body: ", data)
    console.log("type: ", type)

    fetch(url, {
      method: method,
      headers: {
        Accept: 'application/json',
        Authorization: authHeader,
        'Content-Type':
          type === "formData"
            ? 'multipart/form-data'
            : 'application/json',
      },
      body: type == "formData"
        ? data
        : JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("response:", result)
        if (!result.status || result.status == 0) {
          reject(new Error(result.message));
        } else {
          resolve(result);
        }
      })
      .catch((error) => {
        console.log("error:", error)
        reject(error);
      });
  });
};

export default {
  get,
  post,
  put: (url, data) => post(url, data, 'PUT'),
};
