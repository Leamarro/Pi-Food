import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRecipes, switchLoading  } from '../../actions/index';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import Card from '../Card/Card.js';
import Loading from '../Loading';
import Search from '../Search/Search.js';

import style from './home.module.css';


export default function HomePage() {
    
    const dispatch = useDispatch();

	const searchRecipes = useSelector((state) => state.recipesByName);
	const allRecipes = useSelector((state) => state.recipes);
	const loading = useSelector((state) => state.loading);

	const [search, setSearch] = useState(false);
	const [page, setPage] = useState(1);
	const [offset, setOffset] = useState(0);
	const [filter, setFilter] = useState('');
	const [recipes, setRecipes] = useState([]);
	const [filteredRecipes, setFilteredRecipes] = useState([]);
	const [orderedRecipes, setOrderedRecipes] = useState([]);

	//INIT
	useEffect(() => {
		dispatch(getRecipes());
		setTimeout(() => {
			dispatch(switchLoading(false));
		}, 3000);
	}, [dispatch]);

	//BÚSQUEDA
	useEffect(() => {
		setOrderedRecipes([]);
		setFilteredRecipes([]);
		setOffset(0);
		setPage(1);
		if (search) {
			setTimeout(() => {
				dispatch(switchLoading(false));
			}, 3000);
		}
	}, [dispatch, search, searchRecipes]);

	//FILTROS

	const filterDiets = function (recipe) {
		let arrayDiets = [];
		if (recipe.diets) {
			for(let diet of recipe.diets) {
				typeof diet === 'object' ? arrayDiets.push(diet.name.toLowerCase()) : arrayDiets.push(diet.toLowerCase());
			}
		}
		if (recipe.vegetarian) {
			arrayDiets.push('vegetarian')
		}
		return arrayDiets;
	}

	useEffect(() => {
		setSearch(false);
		setOffset(0);
		setPage(1);
		if (filter) {
			let filterRecipes = [...allRecipes].filter((recipe) =>{
				return (filterDiets(recipe) && filterDiets(recipe).includes(filter.toLowerCase()));
			} 
			);
			filterRecipes.length && setFilteredRecipes(filterRecipes);
		} else {
			setFilteredRecipes([]);
		}
	}, [filter, allRecipes]);

	//ORDENAMIENTOS
	function handleSort(e) {
		if (filteredRecipes.length) {
			if (e.target.value === 'asc') {
				const asc = [...filteredRecipes].sort((a, b) => {
					return a.title.toLowerCase() > b.title.toLowerCase()
						? 1
						: -1;
				});
				setFilteredRecipes(asc);
			}
			if (e.target.value === 'des') {
				const des = [...filteredRecipes].sort((a, b) => {
					return a.title.toLowerCase() < b.title.toLowerCase()
						? 1
						: -1;
				});
				setFilteredRecipes(des);
			}

			
			if (e.target.value === 'high') {
				const high = [...filteredRecipes].sort((a, b) => {
					return (a.score) <
						(b.score )
						? 1
						: -1;
				});
				setFilteredRecipes(high);
			}

			if (e.target.value === 'low') {
				const low = [...filteredRecipes].sort((a, b) => {
					return (a.score ) >
						(b.score )
						? 1
						: -1;
				});
				setFilteredRecipes(low);
			}

		} else if (searchRecipes.length && search) {
			if (e.target.value === 'asc') {
				const asc = [...searchRecipes].sort((a, b) => {
					return a.title.toLowerCase() > b.title.toLowerCase()
						? 1
						: -1;
				});
				setRecipes(asc);
			}
			if (e.target.value === 'des') {
				const des = [...searchRecipes].reverse((a, b) => {
					return a.title.toLowerCase() > b.title.toLowerCase()
						? 1
						: -1;
				});
				setRecipes(des);
			}
			if (e.target.value === 'high') {
				const high = [...searchRecipes].sort((a, b) => {
					return (a.score) <
						(b.score)
						? 1
						: -1;
				});
				setRecipes(high);
			}
			if (e.target.value === 'low') {
				const low = [...searchRecipes].sort((a, b) => {
					return (a.score) >
						(b.score)
						? 1
						: -1;
				});
				setRecipes(low);
			}
		} else {
			if (e.target.value === 'asc') {
				const asc = [...allRecipes].sort((a, b) => {
					return a.title.toLowerCase() > b.title.toLowerCase()
						? 1
						: -1;
				});
				setOrderedRecipes(asc);
			}
			if (e.target.value === 'des') {
				const des = [...allRecipes].sort((a, b) => {
					return a.title.toLowerCase() < b.title.toLowerCase()
						? 1
						: -1;
				});
				setOrderedRecipes(des);
			}
			if (e.target.value === 'high') {
				const high = [...allRecipes].sort((a, b) => {
					return (a.score) <(b.score)
						? 1
						: -1;
				});
				setOrderedRecipes(high);
			}
			if (e.target.value === 'low') {
				const low = [...allRecipes].sort((a, b) => {
					return (a.score ) >(b.score)
						? 1
						: -1;
				});
				setOrderedRecipes(low);
			}
		}
	}

	//PAGINADO
	const numRecipes = 9;
	const maxPage = filteredRecipes.length
		? Math.ceil(filteredRecipes.length / numRecipes)
		: searchRecipes.length
		? Math.ceil(searchRecipes.length / numRecipes)
		: Math.ceil(allRecipes.length / numRecipes);

	const next = function (e) {
		e.preventDefault();
		if (page < maxPage) {
			setOffset(offset + numRecipes);
			setPage(page + 1);
		}
	};

	const previous = function (e) {
		e.preventDefault();
		if (page > 1) {
			setOffset(offset - numRecipes);
			setPage(page - 1);
		}
	};


	useEffect(() => {
		if (search) {
			if (searchRecipes) {
				let pageRecipes = [...searchRecipes].slice(
					offset,
					offset + numRecipes
				);
				setRecipes(pageRecipes);
			}
		} else {
			if (filteredRecipes.length) {
				let pageRecipes = [...filteredRecipes].slice(
					offset,
					offset + numRecipes
				);
				setRecipes(pageRecipes);
			} else if (orderedRecipes.length) {
				let pageRecipes = [...orderedRecipes].slice(
					offset,
					offset + numRecipes
				);
				setRecipes(pageRecipes);
			} else {
				let pageRecipes = [...allRecipes].slice(
					offset,
					offset + numRecipes
				);
				setRecipes(pageRecipes);
			}
		}
	}, [
		allRecipes,
		filteredRecipes,
		orderedRecipes,
		searchRecipes,
		page,
		offset,
		search,
	]);

    return (
    <div className={style.caja}>
        
        <div>
				<div>
					<div className={style.filterSort}>
						<div>
							<span>Sort: </span>
							<select onChange={handleSort}>
								<option default value='sort'></option>
								<option value='asc'>A-Z</option>
								<option value='des'>Z-A</option>
							</select>

							<span>Score Order: </span>
							<select onChange={handleSort}>
								<option default value=''></option>
								<option value='high'>High</option>
								<option value='low'>Low</option>
							</select>

							<span>Filter: </span>
							<select
								className={style.filterSelect}
								onChange={(e) => setFilter(e.target.value)}
							>
								<option default value=''>
									Select a Diet
								</option>
								<option value='gluten free'>Gluten Free</option>
								<option value='dairy free'>Ketogenic</option>
								<option value='vegetarian'>Vegetarian</option>
								<option value='lacto ovo vegetarian'>
									Lacto-Vegetarian
								</option>
								<option value='lacto ovo vegetarian'>
									Ovo-Vegetarian
								</option>
								<option value='vegan'>Vegan</option>
								<option value='pescatarian'>Pescetarian</option>
								<option value='paleolithic'>Paleo</option>
								<option value='primal'>Primal</option>
								<option value='whole 30'>Whole30</option>;
							</select>
						</div>
						<Search setSearch={setSearch} />
					</div>
				</div>
			</div>
			<div className={style.recipesHome}>
				{loading ? (
					<div>
						<Loading
						/>
						<h2>¡Loading...!</h2>
					</div>
				) : recipes.length>0 ? (
					[...recipes].map((recipe) => (
						<Card
							key={recipe.id}
							id={recipe.id}
							title={recipe.title}
							image={recipe.img}
							diets={recipe.diets}
							healthScore={recipe.healthScore}
							score={recipe.score } 
						/>
					))
				) : (
					<h1>Recipes not found! Try again.</h1>
				)}
			</div>
			<div className={style.pagination}>
				<div className={style.divBtn}>
				<button className={style.btnPage} onClick={previous}>
				<ArrowBackIosIcon />
				</button>
				<span className={style.numPage}>{page}</span>
				<button className={style.btnPage} onClick={next}>
				<ArrowForwardIosIcon />
				</button>
				</div>
			</div>

       </div>
    );
}
