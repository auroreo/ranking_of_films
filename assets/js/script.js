// Clé API TMDb
const KEY = "36549efa33a546a8545b0116b37ad70c";
// Base URL
const baseURL = "https://api.themoviedb.org/3";

let app = new Vue({
    el: "#app",
    data: {
        // Initialisation tableau d'objets genres
        typesList : [],
        // Initialisation tableau d'objets films selon le genre choisi
        moviesList : [],
        // Variables permettant l'affichage draggable
        enabled : true,
        drag : false,
        // Récupération du genre sélectionné
        typeSelected : "",
        // Gérer affichage du vote
        displayVote : true,
        // Gérer affichage du bouton de fin de vote
        displaySubmitButton : false,
        // Gérer affichage du résultat du vote
        displayResults : true,
        // Tableau qui récupère le vote enregistré dans le local storage
        arrayResults : [],
    },
    mounted() {
       // Récupération genres sur TMDB
        fetch(`https://api.themoviedb.org/3/genre/movie/list?language=fr&api_key=${KEY}`)
            .then(response => response.json())
            .then(response => this.typesList = response.genres)
            .catch(err => console.error(err));
    },
    methods: {
        // Méthode qui affiche les films selon la catégorie lorsque l'on clique sur celle-ci
        showMovies(id) {
            // Récupération des 20 films du genre sélectionné et trié selon leur popularité sur TMDB
            fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&language=fr-FR&sort_by=popularity.desc&with_genres=${id}&page=1&api_key=${KEY}`)
                .then(response => response.json())
                .then(response => {
                    // on stocke ces résultats dans la variable moviesList
                    this.moviesList = response.results;
                    // on splice le tableau pour ne garder que les 10 premiers 
                    this.moviesList.splice(10,10)
                })
                .catch(err => console.error(err));
            this.displaySubmitButton = true;
        },
        // Méthode qui se lance au moment du clique sur le bouton "Terminer le vote"
        saveVote() {
            // Ajout d'un item dans le local storage du navigateur : le tableau avec les films classés + nom clé = catégorie
            localStorage.setItem(this.typeSelected.name, JSON.stringify(this.moviesList));
            // La section de vote est cachée
            this.displayVote = false;
            // Récupération item local storage et stockage dans une variable
            this.arrayResults = JSON.parse(localStorage.getItem(this.typeSelected.name));
            // Affichage section résultats
            this.displayResults = true;
        },
        // Méthode qui se lance lorsque l'on clique sur une catégorie pour vérifier s'il existe un vote enregistré dans le local storage
        checkLocalStorage() { 
            if (localStorage.getItem(this.typeSelected.name)){
                // si c'est le cas, on récupère le vote dans une variable
                this.arrayResults = JSON.parse(localStorage.getItem(this.typeSelected.name));
                // on cache le vote et on affiche les résultats
                this.displayVote = false;
                this.displayResults = true;
           }
        }
    }
});