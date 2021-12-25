document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable([data['data']]));
});

const addBtn = document.querySelector('#add-name-btn');
const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

document.querySelector('table tbody').addEventListener('click', function (event) {

    if (event.target.className === "delete-row-btn") {
        // console.log(event.target.dataset.id);
        deleteRowById(event.target.dataset.id);
    }

    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id);
    }

});

function deleteRowById(id) {
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        });
}
function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-name-input').dataset.id = id

}

updateBtn.onclick = function () {
    const updateNameInput = document.querySelector('#update-name-input');  

    fetch('http://localhost:5000/update/', {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id:updateNameInput.dataset.id,
            name:updateNameInput.value
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        });
}
addBtn.onclick = function () {
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ name: name })
    })
        .then(response => response.json())
        .then(data => insertRowIntoTable(data['data']));
}
searchBtn.onclick = function () {
    let searchInput = document.querySelector('#search-input').value;
    if(searchInput == ''){
        searchInput = 'All';
    }
    fetch('http://localhost:5000/search/'+searchInput,)
        .then(response => response.json())
        .then(data => loadHTMLTable([data['data']]));
}


function insertRowIntoTable(data) {
    console.log(data);
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;
    tableHtml += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}


function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }

   
    console.log(data );
    console.log(data = data[0]);
    let tableHtml = "";

    data.forEach(function ({ id, name, datetime }) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${new Date(datetime).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;


}