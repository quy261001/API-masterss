const sendHttpRequest = (method, url, data) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.responseType = 'json';
   
    if (data) {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }

    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(xhr.response);
      } else {
        resolve(xhr.response);
      }
    };

    xhr.onerror = () => {
      reject('Something went wrong!');
    };

    xhr.send(JSON.stringify(data));
  });
};
const url = 'https://617b71c2d842cf001711bed9.mockapi.io/api/v1/blogs'
function API () {
  this.get = function() {
      return sendHttpRequest('GET', url);
  }
  this.post = function (idUser,titleUser,date,img,contentUser) {
    return  sendHttpRequest('POST', url, {content: `${contentUser}`,
      createdAt: `${date}`,
      id: `${idUser}`,
      image: `${img}`,
      title: `${titleUser}`,
        })
  }
  this.put = function (idUser,titleUser,date,img,contentUser) {
     return sendHttpRequest('PUT', `${url}/${idUser}`, {content: `${contentUser}`,
      createdAt: `${date}`,
      image: `${img}`,
      title: `${titleUser}`,
        })
  }

}