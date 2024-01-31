// Clé API TMDb
const KEY = "36549efa33a546a8545b0116b37ad70c";
// Base URL
const baseURL = "https://api.themoviedb.org/3";

Vue.component('movie-item', {

})

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
        displayVote : true,
        displaySubmitButton : false,
        displayResults : true,
        arrayResults : [],
        displayMovies : true,
    },
    mounted() {
       // Récupération genres sur TMDB
        fetch(`https://api.themoviedb.org/3/genre/movie/list?language=fr&api_key=${KEY}`)
            .then(response => response.json())
            .then(response => this.typesList = response.genres)
            .catch(err => console.error(err)); 
        this.checkLocalStorage();
    },
    methods: {
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
        showResults() {
            this.displayResults = true;
        },
        saveVote() {
            localStorage.setItem(this.typeSelected.name, JSON.stringify(this.moviesList));
            this.displayVote = false;
            this.arrayResults = JSON.parse(localStorage.getItem(this.typeSelected.name));
            this.showResults();
        },
    }
});