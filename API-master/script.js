const url = "https://jsonplaceholder.typicode.com/posts";
const wrapper = document.querySelector(".wrapper");
const sourceList = document.querySelector(".source-list");
const tbodyScroll = document.querySelector(".tbody-scroll");
const formSubmit = document.querySelector(".form-submit");
let updateId = null;
//Render
 let perPage = 10;
 let currentPage = 1;
 let start = 0;
 let end = perPage;
 const btnNext = document.querySelector(".btn-next");
 const btnPrev = document.querySelector(".btn-prev");
 const myInput = document.getElementById("myInput");

 function getCurrentPage(currentPage) {
   start = (currentPage - 1) * perPage;
   end = currentPage * perPage;
   }
async function getSource() {
  try {
    const response = await fetch(`${url}?_page=${currentPage}&_limit=${perPage}`);
    if (response && response.status !== 200) {
      throw new Error("something Wrongs get source:" + response.status);
    }
    const data = await response.json();
    const product = [...data];
    let html = "";
    const content = product.map((item, index) => {
      if (index >= start && index < end) {
        html += '<tr class="trbody">';
        html += "<td>" + item.id + "</td>";
        html += "<td>" + item.title + "</td>";
        html += "<td>" + new Date(item.createdAt).toLocaleString() + "</td>";
        html += "<td>" + item.body + "</td>";
        html += "<td>" + item.userId;
        html += '<button class="source-edit" data-id =' + item.id + '> <i class="fa fa-list-alt"></i></button>';
        html +='<button class="source-remove" data-id =' + item.id + '><i class="fa fa-times"></i></button>';
        html += "</td>";
        html += "</tr>";
        document.getElementById("product").innerHTML = html;
        return html;
      }
    });
  } catch (err) {
    console.log(err, err.message);
  }
}
getSource();

async function getClick() {
    const response = await fetch(`${url}?_page=${currentPage}&_limit=${perPage}`);
    const data = await response.json();
    var totalPages = Math.ceil(data.length / perPage);
    let pages = currentPage;  
    btnNext.addEventListener("click", () => {
      currentPage++;
      pages++;
      if (currentPage > 10) {
        currentPage = totalPages;
        btnNext.classList.add("activeFilter");
        }
      if (currentPage === totalPages) {
        btnNext.classList.remove("activeFilter");
      }
      btnPrev.classList.remove("activeFilter");
      getSource();
    });
    btnPrev.addEventListener("click", () => {
      currentPage--;
      pages--;
      if (currentPage < 1) {
        currentPage = totalPages;
      }
      if (currentPage === 1) {
        btnPrev.classList.add("activeFilter");
      }
      btnNext.classList.remove("activeFilter");
      getSource();
    });
    let htmlPage = "";
    htmlPage += `<li class="btn-page-item active"><a href="#">${pages}</a></li>`;
    document.getElementById("number-page").innerHTML = htmlPage;

    myInput.addEventListener('change', () => {
      perPage = myInput.value;
      start = (currentPage - 1) * perPage;
      end = currentPage * perPage;
      getSource(); 
    })
  }
  getClick();
// Submit
wrapper.addEventListener("submit", async function (e) {
  e.preventDefault();
  const source = {
    id: this.elements["id"].value,
    title: this.elements["title"].value,
    createdAt: this.elements["createdAt"].value,
    image: this.elements["image"].value,
    content: this.elements["content"].value,
  };
  updateId
    ? await updateSource({ id: updateId, ...source })
    : await addPost(source);
  this.reset();
  await getSource();
});
// Post
async function addPost({ id, title, createdAt, image, content }) {
  try {
    let response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        id,
        title,
        createdAt,
        image,
        content,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (response && response.status !== 200) {
      throw new Error("POST loi:", response.status);
    }
    let data = await response.json();
    return data;
  } catch (err) {
    console.log(err, err.message);
  }
  // .then((response) => response.json())
  // .then((json) => console.log(json));
}
//Delete
async function deleteSource(id) {
  try {
    let response = await fetch(`${url}/${id}`, {
      method: "DELETE",
    });
    if (response && response.status !== 200) {
      throw new Error("loi delete:", response.status);
    }
    let data = await response.json();
    return data;
  } catch (err) {
    console.log("Loi delete:", err.message);
  }
}

async function getSingleSource(id) {
  const response = await fetch(`${url}/${id}`);
  const data = await response.json();
  return data;
}
// Click Delete, Edit
tbodyScroll.addEventListener("click", async function (e) {
  if (e.target.matches(".source-remove")) {
    const id = e.target.dataset.id;
    await deleteSource(id);
    this.reset;
    await getSource();
  } else if (e.target.matches(".source-edit")) {
    const id = e.target.dataset.id;
    const data = await getSingleSource(id);
    wrapper.elements["id"].value = data.id;
    wrapper.elements["title"].value = data.title;
    wrapper.elements["createdAt"].value = data.createdAt;
    wrapper.elements["image"].value = data.id;
    wrapper.elements["content"].value = data.id;
    formSubmit.textContent = "Update";
    updateId = id;
  }
});
// Update
async function updateSource({ id, title, createdAt, image, content }) {
  await fetch(`${url}/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      id,
      title,
      createdAt,
      image,
      content,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}
