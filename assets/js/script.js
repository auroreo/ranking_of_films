// Clé API TMDb
const KEY = "36549efa33a546a8545b0116b37ad70c";
// Base URL
const baseURL = "https://api.themoviedb.org/3";

let app = new Vue({
    el: "#app",
    data: {
        // Initialisation tableau d'objets genres
        genresList : [],
        // Initialisation tableau d'objets films selon le genre choisi
        filmsList : [],
        // Variables permettant l'affichage draggable
        enabled : true,
        drag : false,
        // Récupération du genre sélectionné
        genreSelected : "",
        // Gérer affichage du vote
        displayVote : false,
        // Gérer affichage du bouton de fin de vote
        // Gérer affichage du résultat du vote
        displayResult : false,
        // Tableau qui récupère le vote enregistré dans le local storage
        arrayResult : [],
    },
    mounted() {
       // Récupération genres sur TMDB
        fetch(`https://api.themoviedb.org/3/genre/movie/list?language=fr&api_key=${KEY}`)
            .then(response => response.json())
            .then(response => this.genresList = response.genres)
            .catch(err => console.error(err));
    },
    methods: {
        // Méthode qui affiche les films selon la catégorie lorsque l'on clique sur celle-ci
        showFilms(id) {
            // Récupération des 20 films du genre sélectionné et trié selon leur popularité sur TMDB
            fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&language=fr-FR&sort_by=popularity.desc&with_genres=${id}&page=1&api_key=${KEY}`)
                .then(response => response.json())
                .then(response => {
                    // on stocke ces résultats dans la variable moviesList
                    this.filmsList = response.results;
                    // on splice le tableau pour ne garder que les 10 premiers 
                    this.filmsList.splice(10,10)
                })
                .catch(err => console.error(err));
            this.displayResult = false;
            this.displayVote = true;
        },
        // Méthode qui se lance au moment du clique sur le bouton "Terminer le vote"
        saveVote() {
            // Ajout d'un item dans le local storage du navigateur : le tableau avec les films classés + nom clé = catégorie
            localStorage.setItem(this.genreSelected.name, JSON.stringify(this.filmsList));
            // La section de vote est cachée
            this.displayVote = false;
            // Récupération item local storage et stockage dans une variable
            this.arrayResult = JSON.parse(localStorage.getItem(this.genreSelected.name));
            // Affichage section résultats
            this.displayResult = true;
        },
        // Méthode qui se lance lorsque l'on clique sur une catégorie pour vérifier s'il existe un vote enregistré dans le local storage
        checkLocalStorage() { 
            if (localStorage.getItem(this.genreSelected.name)){
                // si c'est le cas, on récupère le vote dans une variable
                this.arrayResult = JSON.parse(localStorage.getItem(this.genreSelected.name));
                // on cache le vote et on affiche les résultats
                this.displayVote = false;
                this.displayResult = true;
           }
        },
        editVote() {
            this.displayResult = false;
            this.displayVote = true;
        },
        refresh() {
            location.reload();
        }
    }
});