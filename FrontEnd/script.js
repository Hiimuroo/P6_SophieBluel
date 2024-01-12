  // Récupération des données du backend pour l'afficher sur le site en récupérant les images, les titres, les catégories)

  document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:5678/api/categories';
    const buttonsContainer = document.getElementById('buttonsContainer');
    const galleryContainer = document.getElementById('galeries');
    let allItems = []; 
    chargerCategories();

  // Fonction pour créer un bouton de filtre
    function createFilterButton(category) {
      const button = document.createElement('button');
      button.innerText = category.name;
      button.className = 'filter-button'; // Ajout de la classe CSS
      button.addEventListener('click', () => handleButtonClick(button, category.id));
      return button;
    }

  // Fonction pour gérer le clic sur un bouton
    function handleButtonClick(button, categoryId) {
  // Supprimer la classe active de tous les boutons
      buttonsContainer.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));

  // Ajouter la classe active au bouton cliqué
      button.classList.add('active');

      filterItems(categoryId);
    }

  // Fonction pour mettre à jour les boutons de filtre avec les catégories
    function updateFilterButtons(categories) {
      buttonsContainer.innerHTML = ''; // Nettoyer les anciens boutons

  // Ajouter le bouton "Tous"
      const allButton = createFilterButton({ id: 'all', name: 'Tous' });
      buttonsContainer.appendChild(allButton);

  // Ajouter les boutons pour chaque catégorie
      categories.forEach(category => {
        const button = createFilterButton(category);
        buttonsContainer.appendChild(button);
      });
    }

  // Fonction pour mettre à jour l'interface utilisateur avec les données filtrées
    function updateUIWithData(data) {
      galleryContainer.innerHTML = '';
      galleryContainer.classList.add('gallery');

      data.forEach(item => {
        const galleryItem = createGalleryItem(item);
        galleryContainer.appendChild(galleryItem);
      });
    }

  // Fonction de filtrage des éléments en fonction de la catégorie
    function filterItems(categoryId) {
      const filteredItems = categoryId === 'all' ? allItems : allItems.filter(item => item.categoryId === categoryId);
      updateUIWithData(filteredItems);
    }

  // Fonction pour créer un élément de galerie à partir des données
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

  // Appel initial pour charger les catégories et les boutons
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Internet indisponible');
        }
        return response.json();
      })
      .then(categories => {
        updateFilterButtons(categories);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des catégories:', error);
      });

      function updateFilterButtonsVisibility() {
      const token = localStorage.getItem('token');
      const buttonsContainer = document.getElementById('buttonsContainer');

      if (token) {
  // Si connecté, masquer les boutons
        buttonsContainer.style.display = 'none';
      } else {
  // Si déconnecté, afficher les boutons
        buttonsContainer.style.display = 'flex'; // Ajustez cela en fonction de votre disposition
      }
    }

    updateFilterButtonsVisibility();

  // Appel initial pour charger tous les éléments
  chargerDonneesBackend = function() {
    fetch('http://localhost:5678/api/works')
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
  }

  chargerDonneesBackend();
  
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