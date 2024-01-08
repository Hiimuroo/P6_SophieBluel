  // Récupération des données du backend pour l'afficher sur le site en récupérant les images, les titres, les catégories)

document.addEventListener('DOMContentLoaded', () => {
  const galleryContainer = document.getElementById('galeries');
  const apiUrl = 'http://localhost:5678/api/works'; 

   // Changement état bouton filtre actif

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

   // Erreurs ou MAJ de l'interface avec les données récupérer

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

    // Utilisation de classe CSS pour le style de la galerie

  function updateUIWithData(data) {
    galleryContainer.innerHTML = '';
    galleryContainer.classList.add('gallery');

    data.forEach(item => {
      const galleryItem = createGalleryItem(item);
      galleryContainer.appendChild(galleryItem);
    });
  }

   // Affichage de certains éléments sur la page HTML comme l'image et le titre puis utilisation de l'ID des items pour le filtrage

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

  // Permet le fitrage de chaque bouton

  document.getElementById('btnTous').addEventListener('click', () => filterItems('all'));
  document.getElementById('btnObjets').addEventListener('click', () => filterItems(1));
  document.getElementById('btnAppartements').addEventListener('click', () => filterItems(2));
  document.getElementById('btnHotelsrestaurants').addEventListener('click', () => filterItems(3));
});

// Fonction pour mettre à jour la visibilité des boutons de connexion/déconnexion en fonction du token stocké localement

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

// Formulaire de connexion

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

// Permet d'afficher le bouton "Modifier" pour ouvrir la modale en fonction du token stocké ou non

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


// Cache les boutons de filtres lorsqu'on est connecté

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

// Ouvrir modale sur bouton "modifier"

function ouvrirModalModifier() {
  const modal = document.getElementById('modalModifier');
  modal.style.display = 'block';
}


// Gestionnaire d'événement pour fermer le modal si l'utilisateur clique en dehors de celui-ci

window.onclick = function (event) {
  const modal = document.getElementById('modalModifier');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};


// Récupère les photos du backend pour les afficher dans la modale

document.addEventListener('DOMContentLoaded', () => {
    // Récupère l'élément modal avec l'ID 'modalModifier' et le conteneur de la galerie avec l'ID 'galleryContainer'
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


  // Fonction pour construire la galerie de photos dans le conteneur spécifié

  function construireGaleriePhoto(photos) {
    galleryContainer.innerHTML = '';

      // Pour chaque photo dans le tableau 'photos'
    photos.forEach(photo => {
      const galleryItem = document.createElement('div');
      galleryItem.classList.add('modal-gallery-item');

        // Crée un élément image pour afficher la photo
      const imageElement = document.createElement('img');
      imageElement.src = photo.imageUrl;
      imageElement.alt = `Photo ID: ${photo.id}`;

        // Crée une icône de suppression avec une classe CSS et un gestionnaire de clic
      const deleteIcon = document.createElement('span');
      deleteIcon.innerHTML = '<i class="fas fa-trash"></i>';
      deleteIcon.classList.add('delete');
      deleteIcon.onclick = () => supprimerImage(photo.id, galleryItem); // Appelle la fonction de suppression avec l'ID de la photo et l'élément de galerie (fonction en dessous)

      galleryItem.appendChild(imageElement);
      galleryItem.appendChild(deleteIcon);

      galleryContainer.appendChild(galleryItem);
    });
  }

  chargerPhotos();
});

// Fonction suppression

function supprimerImage(imageId, galleryItem) {
  const confirmation = confirm('Voulez-vous vraiment supprimer cette image ?');

  if (confirmation) {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:5678/api/works/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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

// Fonction de preview sur la seconde modale pour aperçu de l'image


function handleFileSelect(event) {
    const fileInput = event.target;
    const imagePreview = document.getElementById('imagePreview');
    const Hide = document.querySelector('.Hide');

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block'; 
            Hide.style.display = 'none'; 
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
}

// Fonction pour envoyer un nouveau "work" sur le site


function AjouterImages() {
  const formData = new FormData();
  const photoInput = document.getElementById('photoInput'); 
  const titleInput = document.getElementById('title'); 
  const categorySelect = document.getElementById('category'); 

  formData.append('image', photoInput.files[0]);
  formData.append('title', titleInput.value);
  formData.append('category', categorySelect.value);

  const token = localStorage.getItem('token');

  fetch('http://localhost:5678/api/works', {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
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


// Fonction pour obtenir l'élément input avec l'identifiant 'titleInput'

function getTitreProjet() {
  const titreInput = document.getElementById('titleInput');
  return titreInput;
}

// Fonction pour afficher le 'modalAjoutPhoto' et masquer le 'modalModifier'

function afficherAjoutPhoto() {
  const modalModifier = document.getElementById('modalModifier');
  const modalAjoutPhoto = document.getElementById('modalAjoutPhoto');

  modalModifier.style.display = 'none';
  modalAjoutPhoto.style.display = 'block';
}

// Fonction pour fermer le 'modalAjoutPhoto' et afficher le 'modalModifier'

function fermerAjoutPhoto() {
  const modalModifier = document.getElementById('modalModifier');
  const modalAjoutPhoto = document.getElementById('modalAjoutPhoto');

  modalAjoutPhoto.style.display = 'none';
  modalModifier.style.display = 'block';
}

// Fonction pour revenir à la 'modalModifier' depuis 'modalAjoutPhoto'

function retourGalerie() {
  const modalAjoutPhoto = document.getElementById('modalAjoutPhoto');
  const modalModifier = document.getElementById('modalModifier');

  modalAjoutPhoto.style.display = 'none';
  modalModifier.style.display = 'block';
}

// Fonction pour fermer le 'modalModifier'

function fermerModalPrincipal() {
  const modalModifier = document.getElementById('modalModifier');
  modalModifier.style.display = 'none';
}

// Fonction pour masquer le 'modalAjoutPhoto'

function modalAjoutPhoto() {
  const modalAjoutPhoto = document.getElementById('modalAjoutPhoto');
  modalAjoutPhoto.style.display = 'none';
}


document.addEventListener("DOMContentLoaded", function() {
    // Vérifier si le token est présent dans le localStorage
    const token = localStorage.getItem('token');
    
    // Sélectionner l'élément de la bannière
    const editModeBanner = document.getElementById('editModeBanner');

    // Vérifier si le token est présent et afficher la bannière en conséquence
    if (token) {
      editModeBanner.style.display = 'block';
    } else {
      editModeBanner.style.display = 'none';
    }
  });

  
        // Désactivé le bouton valider si critère pas complet

  document.addEventListener('DOMContentLoaded', function () {
    const photoInput = document.getElementById('photoInput');
    const titleInput = document.getElementById('title');
    const categorySelect = document.getElementById('category');
    const validerButton = document.getElementById('validerButton');

    function updateValiderButtonState() {
        const isFormValid = photoInput.files.length > 0 && titleInput.value.trim() !== '' && categorySelect.value !== '';
        validerButton.disabled = !isFormValid;
    }

    photoInput.addEventListener('change', updateValiderButtonState);
    titleInput.addEventListener('input', updateValiderButtonState);
    categorySelect.addEventListener('change', updateValiderButtonState);
});
