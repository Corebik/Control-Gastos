import { useMemo } from "react";
import { LeadingActions, SwipeableList, SwipeableListItem, SwipeAction, TrailingActions } from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
//*Hooks
import { AmountDisplay } from "./AmountDisplay";
//*Types
import type { Expense } from "../types";
//*Custom
import { categories } from "../data";
import { formatDate } from "../helpers";
import { useBudget } from "../hooks";

type ExpenseDetailProps = {
   expense: Expense
}

export const ExpenseDetail = ({ expense }: ExpenseDetailProps ) => {

   const { dispatch } = useBudget();
   const categoryInfo = useMemo(() => categories.filter( cat => cat.id === expense.category )[0], [ expense ]);

   const onEditExpense = () => {
      dispatch({ type: "set-active", payload: expense.id });
      dispatch({ type: "show-modal" });
   };

   const leadingActions = () => (
      <LeadingActions>
         <SwipeAction
            onClick={ onEditExpense }
         >
            Actualizar
         </SwipeAction>
      </LeadingActions>
   );

   const trailingActions = () => (
      <TrailingActions>
         <SwipeAction
            onClick={ () => dispatch({ type: "delete-expense", payload: expense.id }) }
            destructive={ true }
         >
            Eliminar
         </SwipeAction>
      </TrailingActions>
   );

  return (
    <SwipeableList>
      <SwipeableListItem
         maxSwipe={1}
         leadingActions={ leadingActions() }
         trailingActions={ trailingActions() }
      >
         <div className="bg-white shadow-lg p-5 w-full border-b border-gray-200 flex gap-5 items-center">
            <div>
               <img 
                  className="w-20" 
                  src={`/icono_${ categoryInfo.icon }.svg`} 
                  alt="Icono Gasto" 
               />
            </div>

            <div className="flex-1 space-y-1">
               <p className="text-sm font-bold uppercase text-slate-500"> { categoryInfo.name } </p>
               <p> { expense.expenseName } </p>
               <p className="text-slate-600 text-sm">{ formatDate( expense.date!.toString() )}</p>
            </div>

            <AmountDisplay
               amount={ expense.amount }
            />
         </div>
      </SwipeableListItem>
   </SwipeableList>
  )
}
