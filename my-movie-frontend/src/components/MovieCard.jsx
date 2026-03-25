import "../css/MovieCard.css"
import { useMovieContext } from "../contexts/MovieContext";

function MovieCard({movie, genres}){
    const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext()
    const favorite = isFavorite(movie.id)
    function handleFavoriteClick(e){
        e.preventDefault()
        if(favorite) removeFromFavorites(movie.id)
            else addToFavorites(movie)
    }
    const movieGenres = genres
        .filter((genre) => movie.genre_ids?.includes(genre.id))
        .map((genre) => genre.name)
        .slice(0, 2);
    return(
        <div className="movie-card">
            <div className="movie-poster">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div className="movie-overlay">
                    <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={handleFavoriteClick}>🤍</button>
                </div>
            </div>
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.release_date?.split("-")[0]}</p>
                <p className="movie-genres">{movieGenres.join(", ")}</p>
            </div>
        </div>
    )
}

export default MovieCard;