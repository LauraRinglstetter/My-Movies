import MovieCard from "../components/MovieCard"
import {useState, useEffect} from "react"
import { searchMovies, getPopularMovies, getGenres } from "../services/api"
import "../css/Home.css"

function Home() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedGenre, setSelectedGenre] = useState("")
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    //[] = dependency array, if empty, it will just run once
    //useEffect with empty depency array very common when fetching an API
    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const [popularMovies, genresData] = await Promise.all([
                    getPopularMovies(),
                    getGenres(),
                ]);
                setMovies(popularMovies)
                setGenres(genresData);
                setError(null);
            } catch(err) {
                console.log(err)
                setError('Failed to load movies')
            } finally {
                setLoading(false)
            }
        }
        loadPopularMovies()
    }, [])

    const handleSearch = async(e) => {
        e.preventDefault()
        if (!searchQuery.trim()) return
        if (loading) return
        setLoading(true)
        try {
            const searchResults = await searchMovies(searchQuery)
            setMovies(searchResults)
            setError(null)
        } catch (err) {
            console.log(err)
            setError("Failed to search movies...")
        }finally {
            setLoading(false)
        }
    }
    const filteredMovies = selectedGenre
        ? movies.filter((movie) =>
            movie.genre_ids?.includes(Number(selectedGenre))
        )
        : movies;
    return (
        <div className="home">  
            <form onSubmit={handleSearch} className="search-form">
                <input type="text" 
                placeholder="Search for a movie..." 
                className="search-input" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} />

                <select
                    className="genre-select"
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                >
                    <option value="">All Genres</option>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                            {genre.name}
                        </option>
                    ))}
                </select>

                <button type="submit" className="search-button">Search</button>

            </form>
            {error && <div className="error-message">{error}</div>}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="movies-grid">
                    {filteredMovies.map((movie) => (
                        (
                        <MovieCard movie={movie} key={movie.id} genres={genres}/>
                        )
                    ))}
                </div>
            )}
            
        </div>
    )
}

export default Home