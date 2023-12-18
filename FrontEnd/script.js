document.addEventListener('DOMContentLoaded', () => {
  const galleryContainer = document.getElementById('galeries');
  const apiUrl = 'http://localhost:5678/api/works';

  document.getElementById('btnTous').addEventListener('click', function () {
    changeButtonState(this);
  });

  document.getElementById('btnObjets').addEventListener('click', function () {
    changeButtonState(this);
  });

  document.getElementById('btnAppartements').addEventListener('click', function () {
    changeButtonState(this);
  });

  document.getElementById('btnHotelsrestaurants').addEventListener('click', function () {
    changeButtonState(this);
  });

  let activeButton = null;

  function changeButtonState(button) {
    if (activeButton) {
      activeButton.classList.remove('active');
    }

    button.classList.add('active');
    activeButton = button;
  }

  let allItems = [];

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Internet indisponible');
      }
      return response.json();
    })
    .then(data => {
      allItems = data;
      updateUIWithData(data);
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des données:', error);
    });

  function updateUIWithData(data) {
    galleryContainer.innerHTML = '';
    galleryContainer.classList.add('gallery');

    data.forEach(item => {
      const galleryItem = createGalleryItem(item);
      galleryContainer.appendChild(galleryItem);
    });
  }

  function createGalleryItem(item, isModal = false) {
    const galleryItem = document.createElement('div');
  
    if (isModal) {
      galleryItem.classList.add('modal-gallery-item');
    } else {
      galleryItem.classList.add('gallery-item');
    }
  
    const image = document.createElement('img');
    image.src = item.imageUrl;
    image.alt = item.title;
    galleryItem.appendChild(image);
  
    const title = document.createElement('figcaption');
    title.textContent = item.title;
    galleryItem.appendChild(title);
  
    return galleryItem;
  }

  function filterItems(categoryId) {
    const filteredItems = categoryId === 'all' ? allItems : allItems.filter(item => item.categoryId === categoryId);
    updateUIWithData(filteredItems);
  }

  document.getElementById('btnTous').addEventListener('click', () => filterItems('all'));
  document.getElementById('btnObjets').addEventListener('click', () => filterItems(1));
  document.getElementById('btnAppartements').addEventListener('click', () => filterItems(2));
  document.getElementById('btnHotelsrestaurants').addEventListener('click', () => filterItems(3));
});

document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const token = localStorage.getItem('token');

  function updateButtonVisibility() {
    if (token) {
      if (loginButton) loginButton.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
      if (loginButton) loginButton.style.display = 'inline-block';
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  }

  if (loginButton) {
    loginButton.addEventListener('click', submitForm);
  }

  function submitForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
    })
    .then(response => {
        if (!response.ok) {
            throw Error('Login incorrect. ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        alert('Login validé!');
        window.location.href = 'index.html';
        updateButtonVisibility();
    })
    .catch(error => {
        alert(error.message);
    });
  }

  updateButtonVisibility();
});

document.addEventListener('DOMContentLoaded', () => {
  const btnModifier = document.getElementById('btnModifier');
  const token = localStorage.getItem('token');

  if (token) {
    if (btnModifier) btnModifier.style.display = 'block';
  } else {

    if (btnModifier) btnModifier.style.display = 'none';
  }
});


function logout() {
  localStorage.removeItem('token');

  const loginButton = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  if (loginButton) loginButton.style.display = 'inline-block';
  if (logoutBtn) logoutBtn.style.display = 'none';

  window.location.reload();

}

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (token) {
    hideButtons(['btnTous', 'btnObjets', 'btnAppartements', 'btnHotelsrestaurants']);
  } else {
    document.getElementById('btnTous').addEventListener('click', () => filterItems('all'));
    document.getElementById('btnObjets').addEventListener('click', () => filterItems(1));
    document.getElementById('btnAppartements').addEventListener('click', () => filterItems(2));
    document.getElementById('btnHotelsrestaurants').addEventListener('click', () => filterItems(3));
  }
});

function hideButtons(buttonIds) {
  buttonIds.forEach(buttonId => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.style.display = 'none';
    }
  });
}

function ouvrirModalModifier() {
  const modal = document.getElementById('modalModifier');
  modal.style.display = 'block';
}

function fermerModalModifier() {
  const modal = document.getElementById('modalModifier');
  modal.style.display = 'none';
}

window.onclick = function (event) {
  const modal = document.getElementById('modalModifier');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};





document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modalModifier');
  const galleryContainer = document.getElementById('galleryContainer');

  function chargerPhotos() {
    fetch('http://localhost:5678/api/works')
      .then(response => response.json())
      .then(data => {
        construireGaleriePhoto(data);
      })
      .catch(error => console.error('Erreur lors du chargement des photos:', error));
  }


  function construireGaleriePhoto(photos) {
    galleryContainer.innerHTML = '';

    photos.forEach(photo => {
      const galleryItem = document.createElement('div');
      galleryItem.classList.add('modal-gallery-item');

      const imageElement = document.createElement('img');
      imageElement.src = photo.imageUrl;
      imageElement.alt = `Photo ID: ${photo.id}`;

      const deleteIcon = document.createElement('span');
      deleteIcon.innerHTML = '<i class="fas fa-trash"></i>';
      deleteIcon.classList.add('delete');
      deleteIcon.onclick = () => supprimerImage(photo.id, galleryItem);

      galleryItem.appendChild(imageElement);
      galleryItem.appendChild(deleteIcon);

      galleryContainer.appendChild(galleryItem);
    });
  }

  chargerPhotos();
});

function supprimerImage(imageId, galleryItem) {
  const confirmation = confirm('Voulez-vous vraiment supprimer cette image ?');

  if (confirmation) {
    fetch(`http://localhost:5678/api/works/${imageId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          galleryItem.remove();
        } else {
          console.error('Erreur lors de la suppression de l\'image.');
        }
      })
      .catch(error => console.error('Erreur réseau :', error));
  }
}

function ajouterPhoto(photoFile) {
  const formData = new FormData();
  formData.append('photo', photoFile);

  fetch('http://localhost:5678/api/works', {
    method: 'POST',
    body: formData,
  })
    .then(response => {
      if (response.ok) {
        alert('Photo ajoutée avec succès!');
        chargerPhotos();
      } else {
        throw Error('Erreur lors de l\'ajout de la photo.');
      }
    })
    .catch(error => console.error('Erreur réseau :', error));
}

function chargerPageAjoutPhoto() {
  const modalHeader = document.querySelector('.modal-header');
  modalHeader.innerHTML = '';

  const ajoutPhotoContent = `
  <div class="arrow-container" onclick="retourGalerie()">
    <i class="fa-solid fa-arrow-left"></i>
  </div>
  <h2>Ajout photo</h2>
  <div class="contents">
    <form id="ajoutPhotoForm">
      <div class="photo-container">
        <i class="fa-regular fa-image"></i>
        <input type="file" accept=".jpg, .jpeg, .png" id="photoInput" style="display: none;" onchange="handleFileSelect(event)">
        <label for="photoInput" class="photo-button">+ Ajouter photo</label>
        <p>jpg, png : 4mo max</p>
      </div>
    </form>
    <h3>Titre</h3>
    <input type="text" id="titleInput" required>
    <h3>Catégorie</h3>
    <div class="form-group">
      <select id="categorySelect" class="form-control" required>
        <option value="" selected disabled></option>
        <option value="1">Objets</option>
        <option value="2">Appartements</option>
        <option value="3">Hotels & restaurants</option>
      </select>
    </div>
    <hr>
  </div>
`;
  modalHeader.insertAdjacentHTML('beforeend', ajoutPhotoContent);
}

function getTitreProjet() {
  const titreInput = document.getElementById('titleInput');
  return titreInput.value;
}