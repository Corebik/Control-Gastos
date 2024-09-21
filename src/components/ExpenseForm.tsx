import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { categories } from "../data";

//*Dependecies
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

//*Types
import type { DraftExpense, Value } from "../types";

//*Components
import { ErrorMessage } from "./ErrorMessage";
import { useBudget } from "../hooks";

const expenseForm = {
   expenseName: "",
   amount: 0,
   category: "",
   date: new Date()
}

export const ExpenseForm = () => {

   const [expense, setExpense] = useState<DraftExpense>( expenseForm );
   const [errorForm, setErrorForm] = useState("");
   const { state, dispatch, remainingBudget } = useBudget();

   const [ previouseAmount, setPreviousAmount ] = useState(0);

   useEffect(() => {
     if( state.activeId ){
         const expenseActive = state.expenses.filter( expense => expense.id === state.activeId )[0];
         setExpense( expenseActive );
         setPreviousAmount( expenseActive.amount );
     }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [ state.activeId ]);
   

   const onInputChange = ( event : ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> ) => {

      const { name, value } = event.target;
      const numberFields = [ "amount" ].includes( name ); //True or False

      setExpense({ 
         ...expense,
         [ event.target.name ]: numberFields ? +value : value 
      });
   }

   const onDateChange = ( value : Value ) => {
      setExpense({ ...expense, date: value });
   }

   const onFormSubmit = ( event : FormEvent<HTMLFormElement> ) => {
      event.preventDefault();

      //Validate Form
      if( Object.values( expense ).includes("") ){
         setErrorForm("Todos los campos son obligatorios");
         console.log(errorForm);
         return;
      }

      //Validate Amount
      if( (expense.amount - previouseAmount ) > remainingBudget ){
         setErrorForm("Ese gasto se sale del presupuesto");
         console.log(errorForm);
         return;
      }

      //Add or Update Expense
      if( state.activeId ){
         dispatch({ type: "edit-expense", payload: { ...expense, id: state.activeId} });
      }else{
         dispatch({ type: "add-expense", payload: expense });
      }
      
      // Reset Form
      setExpense( expenseForm );
      setPreviousAmount( 0 );
   }

  return (
    <form className="space-y-5" onSubmit={ onFormSubmit }>
      <legend
         className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2"
      >
         { state.activeId ? "Actualizar Gasto" : "Nuevo Gasto" }
      </legend>

      { errorForm && <ErrorMessage> { errorForm } </ErrorMessage> }

      <div className="flex flex-col gap-2">
         <label htmlFor="expenseName" className="text-xl">Nombre Gasto:</label>
         <input 
            id="expenseName" 
            name="expenseName"
            type="text" 
            className="bg-slate-100 p-2"
            placeholder="Añade el nombre del gasto" 
            value={ expense.expenseName }
            onChange={ onInputChange }
         />
      </div>

      <div className="flex flex-col gap-2">
         <label htmlFor="amount" className="text-xl">Cantidad:</label>
         <input 
            id="amount" 
            name="amount"
            type="number" 
            className="bg-slate-100 p-2"
            placeholder="Añade la cantidad del gasto: ej. 300" 
            value={ expense.amount }
            onChange={ onInputChange }
         />
      </div>

      <div className="flex flex-col gap-2">
         <label htmlFor="category" className="text-xl">Categoría:</label>
         <select 
            id="category" 
            name="category"
            className="bg-slate-100 p-2"
            value={ expense.category }
            onChange={ onInputChange }
         >
            <option value="">-- Seleccione --</option>
            { categories.map( category => (
               <option 
                  key={ category.id } 
                  value={ category.id }
               >
                  { category.name }
               </option>
            ))}
         </select>
      </div>

      <div className="flex flex-col gap-2">
         <label htmlFor="amount" className="text-xl">Fecha Gasto:</label>
         <DatePicker 
            className="bg-slate-100 p-2 border-0"
            value={ expense.date }
            onChange={ onDateChange }
         />
      </div>

      <input 
         type="submit" 
         className="bg-blue-600 cursor-pointer w-full p-2 font-bold rounded-lg text-white uppercase
         hover:bg-blue-700 transition duration-300"
         value={ state.activeId ? "Guardar Cambios" : "Registrar Gasto" }
      />

    </form>
  )
}
