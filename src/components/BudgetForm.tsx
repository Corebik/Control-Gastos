import { useState, ChangeEvent, useMemo, FormEvent } from "react";
//* Hooks
import { useBudget } from "../hooks";

export const BudgetForm = () => {

   const [budget, setBudget] = useState(0);
   const { dispatch } = useBudget();


   const onInputChange = ( event : ChangeEvent<HTMLInputElement> ) => {
      setBudget( +event.target.value );
   };

   const isValid = useMemo(() => {
      return isNaN(budget) || budget <= 0
   }, [ budget ]);

   const onSubmit = ( event : FormEvent<HTMLFormElement> ) => {
      event.preventDefault();
      dispatch({ type:"add-budget", payload: budget });
   };

  return (
    <form className="space-y-5" onSubmit={ onSubmit }>
      <div className="flex flex-col space-y-5">
         <label htmlFor="budget" className="text-4xl text-blue-600 font-bold text-center">
            Definir Presupuesto
         </label>
         <input 
            id="budget"
            name="budget"
            type="number"
            placeholder="Definir presupuesto"
            className="w-full bg-white border border-gray-200 p-2"
            value={ budget }
            onChange={ onInputChange }
         />
      </div>
      <input 
         type="submit"
         value="Definir presupuesto"
         className="bg-blue-600 hover:bg-blue-700 cursor-pointer w-full p-2 text-white font-black uppercase
         disabled:opacity-50"
         disabled={ isValid } 
      />
    </form>
  )
}
