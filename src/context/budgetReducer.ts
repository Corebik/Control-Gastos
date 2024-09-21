import type { Category, DraftExpense, Expense } from "../types";
import { v4 as uuidv4 } from 'uuid';

const initialBudget = () => {
   const localBudget = localStorage.getItem("budget");
   return localBudget ? +localBudget : 0
}

const initialExpenses = () => {
   const localExpenses = localStorage.getItem("expenses");
   return localExpenses ? JSON.parse( localExpenses ) : []
}

//!START
export type BudgetActions = 
   { type: "add-budget", payload: number } |
   { type: "show-modal" } |
   { type: "hide-modal" } | 
   { type: "add-expense", payload: DraftExpense } |
   { type: "delete-expense", payload: Expense['id'] } |
   { type: "set-active", payload: Expense['id'] } |
   { type: "edit-expense", payload: Expense } |
   { type: "reset-app" } |
   { type: "add-filter-category", payload: Category['id'] }

export type BudgetState = {
   budget: number
   modal: boolean,
   expenses: Expense[],
   activeId?: Expense['id'],
   currentCategory?: Category['id']
}

export const initialState : BudgetState = {
   budget: initialBudget(),
   modal: false,
   expenses: initialExpenses(),
   activeId: "",
   currentCategory: ""
}

const createExpense = ( draftExpense : DraftExpense ) : Expense => {
   return {
      id: uuidv4(),
      ...draftExpense
   }
}

export const budgetReducer = ( 
   state : BudgetState = initialState, 
   action : BudgetActions ) => {

   switch (action.type) {
      
      case "add-budget":

         return {
            ...state,
            budget: action.payload
         }

      case "show-modal":
         return {
            ...state,
            modal: true
         }

      case "hide-modal":
         return {
            ...state,
            modal: false,
            activeId: ""
         }

      case "add-expense":{
         const expense = createExpense( action.payload );
         return {
            ...state,
            expenses: [ ...state.expenses, expense ],
            modal: false
         }
      }

      case "set-active":
         return {
            ...state,
            activeId: action.payload
         }

      case "edit-expense": 
         return {
            ...state,
            expenses: state.expenses.map( expense => expense.id === action.payload.id ? action.payload : expense ),
            modal: false,
            activeId: ""
         }

      case "delete-expense":
         return {
            ...state,
            expenses: state.expenses.filter( expense => expense.id !== action.payload )
         }  
         
      case "reset-app":
         return {
            ...state,
            budget: 0,
            expenses: []
         }

      case "add-filter-category":
         return {
            ...state,
            currentCategory: action.payload
         }
         
      default:
         return state
   }
}