import { ChangeEvent } from "react";
import { categories } from "../data";
import { useBudget } from "../hooks";

export const FilterByCategory = () => {

   const { dispatch } = useBudget();

   const onSelectChange = ( event : ChangeEvent<HTMLSelectElement> ) => {
      const value = event.target.value;
      dispatch({ type: "add-filter-category", payload: value });
   }

  return (
    <div className="bg-white shadow-lg rounded-lg p-10">
      <form>
         <div className="flex flex-col md:flex-row md:items-center gap-5">
            <label htmlFor="category">Filtrar Gastos</label>
            <select
               name="category"
               id="category"
               className="bg-slate-100 p-3 flex-1 rounded"
               onChange={ onSelectChange }
            >
               <option value="">-- Seleccione --</option>
               { categories.map( category => <option key={ category.id } value={ category.id }>{ category.name }</option> ) }
            </select>
         </div>
      </form>
    </div>
  )
}
