import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import classNames from "classnames";

import { activeFilterChanged, fetchFilters, selectAll } from '../../reducers/filtersSlice';
import store from '../../store';
import Spinner from '../spinner/Spinner';

const HeroesFilters = () => {

    const { filtersLoadingStatus, activeFilter } = useSelector(state => state.filters);
    const filters = selectAll(store.getState());
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFilters());

        // eslint-disable-next-line
    }, []);

    if (filtersLoadingStatus === 'loading') {
        return <Spinner />
    } else if (filtersLoadingStatus === 'error') {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderFilters = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтры не найдены</h5>
        }

        return arr.map(({name, label, className}) => {
            const btnClass = classNames('btn', className, {
                'active' : name === activeFilter
            })

            return <button 
                className={btnClass}
                key={name}
                id={name}
                onClick={() => dispatch(activeFilterChanged(name))}>
                    {label}
            </button>
        })
    }

    const viewFilters = renderFilters(filters);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {viewFilters}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;