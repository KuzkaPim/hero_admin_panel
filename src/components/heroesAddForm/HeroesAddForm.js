// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { useHttp } from "../../hooks/http.hook";
import { heroCreated } from "../../actions";

const HeroesAddForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [element, setElement] = useState('');
    const { filters, filtersLoadingStatus } = useSelector(state => state.filters);

    const { request } = useHttp();
    const dispatch = useDispatch();

    const onHeroesAdd = (e) => {
        e.preventDefault();

        const newHero = {id: uuidv4(), name, description, element};

        request('http://localhost:3001/heroes', 'POST', JSON.stringify(newHero))
            .then(res => console.log(res))
            .then(dispatch(heroCreated(newHero)))
            .catch(err => console.log(err));

        setName('');
        setDescription('');
        setElement('');
    }

    const renderFilters = (arr, status) => {
        if (status === 'loading') {
            return <option>Загрузка компонентов</option>
        } else if (status === 'error') {
            return <option>Ошибка загрузки</option>
        }

        if (arr && arr.length > 0) {
            return arr.map(({name, label}) => {
                if (name === 'all') return;
    
                return <option 
                    key={name}
                    value={name}>
                        {label}
                </option>
            })
        }
    }

    const viewFilters = renderFilters(filters, filtersLoadingStatus);

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onHeroesAdd}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    value={element}
                    onChange={e => setElement(e.target.value)}
                    className="form-select" 
                    id="element" 
                    name="element">
                    <option value="">Я владею элементом...</option>
                    {viewFilters}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;