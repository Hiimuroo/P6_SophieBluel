// Récupération des fonctions pour être utilisé partout


let chargerPhotos;
let chargerDonneesBackend;

document.addEventListener('DOMContentLoaded', () => {
    const btnModifier = document.getElementById('btnModifier');
    const token = localStorage.getItem('token');
  
    if (token) {
      if (btnModifier) btnModifier.style.display = 'block';
    } else {
  
      if (btnModifier) btnModifier.style.display = 'none';
    }


// Désactivé le bouton valider si critère pas complet

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



// Récupère les photos du backend pour les afficher dans la modale

    const galleryContainer = document.getElementById('galleryContainer');

    chargerPhotos = function() {
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
            chargerDonneesBackend();
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
  

// Fonction pour charger les catégories dans la liste déroulante

  function chargerCategories() {
    // Sélectionnez la liste déroulante
    const categorySelect = document.getElementById('category');
  
    // Effectuez une requête pour récupérer les catégories depuis l'API
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            // Ajoutez chaque catégorie à la liste déroulante
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories :', error));
  }


// Fonction pour ouvrir la modale principale

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
  

// Fonction pour envoyer un nouveau "work" sur le site

function AjouterImages() {
  const formData = new FormData();
  const photoInput = document.getElementById('photoInput'); 
  const titleInput = document.getElementById('title'); 
  const categorySelect = document.getElementById('category');
  const imagePreview = document.getElementById('imagePreview');
  const hideElement = document.querySelector('.Hide');
  const flexContainer = document.querySelector('.Hide');
  const confirmationMessage = document.getElementById('confirmationMessage');



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
      confirmationMessage.textContent = 'Photo ajoutée avec succès!';
      confirmationMessage.style.display = 'block';

  // Fonctions pour charger les objets du backend sans refresh toute la page

      retourGalerie();
      chargerPhotos();
      chargerDonneesBackend();

  // Reset des champs formulaire

      photoInput.value = '';
      titleInput.value = '';
      categorySelect.value = '';
      validerButton.disabled = true;
      imagePreview.src = '';

  // Affichage de nouveau du contenu pour ajouter une image

      hideElement.style.display = 'block';
      flexContainer.style.display = 'flex';


    } else {
      throw Error('Erreur lors de l\'ajout de la photo.');
    }
  })
  .catch(error => console.error('Erreur réseau :', error));
}
