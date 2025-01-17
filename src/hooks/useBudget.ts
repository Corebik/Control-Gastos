import { useContext } from "react";
import { BudgetContext } from "../context";

export const useBudget = () => {

   const context = useContext( BudgetContext );

   if( !context ) throw new Error( 'useBudget must be used within an BudgetProvider' );

  return context;
}
