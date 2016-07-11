import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import React from 'react';
import ReactDom from 'react-dom';
import expect from 'expect';
import deepFreeze from 'deep-freeze';

const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text
  }
}

const setVisibilityFilter = filter => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  };
};

const toggleTodo = id => {
  return {
    type: 'TOGGLE_TODO',
    id
  }
}

const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;

  }
}
const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      if (action.text === '') return state;
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => {
        return todo(t, action);
      });

    default:
      return state;
  }
};

const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
        return state;
  }
}

const todoApp = combineReducers({
  todos,
  visibilityFilter
});


const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    default:
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      )
    case 'SHOW_ACTIVE':
        return todos.filter(
          t => !t.completed
        )
  }
}

const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li
    onClick={onClick}
    style={{
      textDecoration:
        completed ?
        'line-through' :
        'none'
    }}>
    {text}
  </li>
);

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
  {todos.map(todo =>
    <Todo
    key={todo.id}
    {...todo}
    onClick={() => onTodoClick(todo.id)}
    />
  )}
  </ul>
);

const mapStateToTodoListProps = (
  state
) => {
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  }
};
const mapDispatchToTodoListProps = (
  dispatch
) => {
  return {
    onTodoClick: (id) => {
        dispatch(toggleTodo(id));
    }
  };
};
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);



let AddTodo = ({ dispatch }) => {
  let input;
  let addTodoDispatch = (text) => {
    dispatch(addTodo(text));
  }
  return (
    <div>
      <input ref={node => {
          input = node;
        }}
        onKeyPress = {(e) => {
          if (e.key !== 'Enter') return;
          addTodoDispatch(input.value);
          input.value='';
        }}
       />
      <button onClick= {() => {
        addTodoDispatch(input.value);
        input.value='';
      }}> ADD
      </button>
    </div>
  )
}

AddTodo = connect()(AddTodo);

const Link = ({
  active,
  children,
  onClick
}) => {
  if (active) {
    return <span>{ children }</span>
  }

  return (
    <a href="#"
      onClick = {e => {
        e.preventDefault();
        onClick();
      }}
    >
      { children }
    </a>
  );
};

const mapStateToLinkProps = (
  state,
  ownProps
) => {
  return {
    active:
      ownProps.filter ===
      state.visibilityFilter
  };
};

const mapDispatchToLinkProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter));
    }
  };
}

const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link)

const Footer = () => (
  <p>
    Show:
    { ' ' }
    <FilterLink
      filter='SHOW_ALL'
    >
      All
    </FilterLink>
    { ' ' }
    <FilterLink
      filter='SHOW_ACTIVE'
    >
      Active
    </FilterLink>
    { ' ' }
    <FilterLink
      filter='SHOW_COMPLETED'
    >
      Completed
    </FilterLink>
  </p>
)

let nextTodoId = 0;
const TodoApp = ({
  todos,
  visibilityFilter
}) => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

ReactDom.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);



// PART 7
// import { createStore, combineReducers } from 'redux';
// import React from 'react';
// import ReactDom from 'react-dom';
// import expect from 'expect';
// import deepFreeze from 'deep-freeze';
//
// const todo = (state, action) => {
//   switch (action.type) {
//     case 'ADD_TODO':
//       return {
//         id: action.id,
//         text: action.text,
//         completed: false
//       }
//     case 'TOGGLE_TODO':
//       if (state.id !== action.id) {
//         return state;
//       }
//
//       return {
//         ...state,
//         completed: !state.completed
//       };
//     default:
//       return state;
//
//   }
// }
// const todos = (state = [], action) => {
//   switch (action.type) {
//     case 'ADD_TODO':
//       if (action.text === '') return state;
//       return [
//         ...state,
//         todo(undefined, action)
//       ];
//     case 'TOGGLE_TODO':
//       return state.map(t => {
//         return todo(t, action);
//       });
//
//     default:
//       return state;
//   }
// };
//
// const visibilityFilter = (
//   state = 'SHOW_ALL',
//   action
// ) => {
//   switch (action.type) {
//     case 'SET_VISIBILITY_FILTER':
//       return action.filter
//     default:
//         return state;
//   }
// }
//
// const todoApp = combineReducers({
//   todos,
//   visibilityFilter
// });
//
// const store = createStore(todoApp);
//
// const getVisibleTodos = (
//   todos,
//   filter
// ) => {
//   switch (filter) {
//     case 'SHOW_ALL':
//       return todos;
//     default:
//     case 'SHOW_COMPLETED':
//       return todos.filter(
//         t => t.completed
//       )
//     case 'SHOW_ACTIVE':
//         return todos.filter(
//           t => !t.completed
//         )
//   }
// }
//
// const Todo = ({
//   onClick,
//   completed,
//   text
// }) => (
//   <li
//     onClick={onClick}
//     style={{
//       textDecoration:
//         completed ?
//         'line-through' :
//         'none'
//     }}>
//     {text}
//   </li>
// );
//
// const TodoList = ({
//   todos,
//   onTodoClick
// }) => (
//   <ul>
//     {todos.map(todo =>
//       <Todo
//         key={todo.id}
//         {...todo}
//         onClick={() => onTodoClick(todo.id)}
//       />
//     )}
//   </ul>
// );
//
// const AddTodo = ({
//   onAddClick
// }) => {
//   let input;
//   return (
//     <div>
//       <input ref={node => {
//           input = node;
//         }}
//         onKeyPress = {(e) => {
//           if (e.key !== 'Enter') return;
//           onAddClick(input.value);
//           input.value='';
//         }}
//        />
//       <button onClick= {() => {
//         onAddClick(input.value);
//         input.value='';
//
//       }}> ADD
//       </button>
//     </div>
//   )
// }
//
// const Footer = ({
//   visibilityFilter,
//   onFilterClick
// }) => (
//   <p>
//     Show:
//     { ' ' }
//     <FilterLink
//       filter='SHOW_ALL'
//       currenFilter={visibilityFilter}
//       onClick={onFilterClick}
//     >
//       All
//     </FilterLink>
//     { ' ' }
//     <FilterLink
//       filter='SHOW_ACTIVE'
//       currenFilter={visibilityFilter}
//       onClick={onFilterClick}
//     >
//       Active
//     </FilterLink>
//     { ' ' }
//     <FilterLink
//       filter='SHOW_COMPLETED'
//       currenFilter={visibilityFilter}
//       onClick={onFilterClick}
//     >
//       Completed
//     </FilterLink>
//   </p>
// )
//
// let nextTodoId = 0;
// const TodoApp = ({
//   todos,
//   visibilityFilter
// }) => (
//   <div>
//     <AddTodo
//       onAddClick = {text =>
//         store.dispatch({
//           type: 'ADD_TODO',
//           id: nextTodoId++,
//           text
//         })
//       }
//     />
//     <TodoList
//       todos={ getVisibleTodos(
//         todos,
//         visibilityFilter
//       )}
//       onTodoClick={id =>
//         store.dispatch({
//           type: 'TOGGLE_TODO',
//           id
//         })
//       }
//     />
//     <Footer
//       visibilityFilter={visibilityFilter}
//       onFilterClick={filter =>
//           store.dispatch({
//             type: 'SET_VISIBILITY_FILTER',
//             filter
//           })
//       }
//     />
//   </div>
// );
//
//
//
// const FilterLink = ({
//   filter,
//   currenFilter,
//   onClick,
//   children
// }) => {
//   if (filter === currenFilter) {
//     return <span>{ children }</span>
//   }
//   return (
//     <a href="#"
//       onClick = {e => {
//         e.preventDefault();
//         onClick(filter);
//       }}>{ children }</a>
//   )
// }
// const render = () => {
//   ReactDom.render(
//     <TodoApp
//       {...store.getState()}
//     />,
//     document.getElementById('root')
//   );
// }
//
// store.subscribe(render);
// render();


//PART 6
// import { createStore, combineReducers } from 'redux';
// import React from 'react';
// import ReactDom from 'react-dom';
// import expect from 'expect';
// import deepFreeze from 'deep-freeze';
//
// const todo = (state, action) => {
//   switch (action.type) {
//     case 'ADD_TODO':
//       return {
//         id: action.id,
//         text: action.text,
//         completed: false
//       }
//     case 'TOGGLE_TODO':
//       if (state.id !== action.id) {
//         return state;
//       }
//
//       return {
//         ...state,
//         completed: !state.completed
//       };
//     default:
//       return state;
//
//   }
// }
// const todos = (state = [], action) => {
//   switch (action.type) {
//     case 'ADD_TODO':
//       if (action.text === '') return state;
//       return [
//         ...state,
//         todo(undefined, action)
//       ];
//     case 'TOGGLE_TODO':
//       return state.map(t => {
//         return todo(t, action);
//       });
//
//     default:
//       return state;
//   }
// };
//
// const visibilityFilter = (
//   state = 'SHOW_ALL',
//   action
// ) => {
//   switch (action.type) {
//     case 'SET_VISIBILITY_FILTER':
//       return action.filter
//     default:
//         return state;
//   }
// }
//
// //  PART 5.3
// // const combineReducers = (reducers) => {
// //   return (state = {}, action) => {
// //     return Object.keys(reducers).reduce(
// //       (nextState, key) => {
// //         nextState[key] = reducers[key] (
// //           state[key],
// //           action
// //         );
// //         return nextState;
// //       },
// //       {}
// //     );
// //   }
// // }
// const todoApp = combineReducers({
//   todos,
//   visibilityFilter
// });
//
// // PART 5.2
// // combineReducers Implementation
// // const todoApp = (state = {}, action) => {
// //   return {
// //     todos: todos(
// //       state.todos,
// //       action
// //     ),
// //     visibilityFilter: visibilityFilter(
// //       state.visibilityFilter,
// //       action
// //     )
// //   };
// // }
//
//
//
// const store = createStore(todoApp);
//
// const getVisibleTodos = (
//   todos,
//   filter
// ) => {
//   console.log(todos, filter);
//   switch (filter) {
//     case 'SHOW_ALL':
//     console.log('All');
//       return todos;
//     default:
//     case 'SHOW_COMPLETED':
//     console.log('completed');
//       return todos.filter(
//         t => t.completed
//       )
//     case 'SHOW_ACTIVE':
//         console.log('Active');
//         return todos.filter(
//           t => !t.completed
//         )
//   }
// }
//
// let nextTodoId = 0;
// class TodoApp extends React.Component {
//   render() {
//     const {
//       todos,
//       visibilityFilter
//     } = this.props;
//     const visibleTodos = getVisibleTodos(
//       todos,
//       visibilityFilter
//     );
//     return (
//       <div>
//         <input ref={node => {
//             this.input = node;
//           }}
//           onKeyPress = {(e) => {
//             if (e.key !== 'Enter') return;
//             store.dispatch({
//               type: 'ADD_TODO',
//               text: this.input.value,
//               id: nextTodoId++
//             });
//             this.input.value =''
//           }}
//          />
//         <button onClick= {() => {
//           store.dispatch({
//             type: 'ADD_TODO',
//             text: this.input.value,
//             id: nextTodoId++
//           });
//           this.input.value =''
//         }}> ADD
//         </button>
//         <ul>
//           {visibleTodos.map(todo =>
//             <li key={todo.id}
//               onClick={() => {
//                 store.dispatch({
//                   type: 'TOGGLE_TODO',
//                   id: todo.id
//                 });
//               }} style={{
//                 textDecoration:
//                   todo.completed ?
//                   'line-through' :
//                   'none'
//               }}>
//               {todo.text}
//             </li>
//           )}
//         </ul>
//         <p>
//           Show:
//           { ' ' }
//           <FilterLink
//             filter='SHOW_ALL'
//             currenFilter={visibilityFilter}
//           >
//             All
//           </FilterLink>
//           { ' ' }
//           <FilterLink
//             filter='SHOW_ACTIVE'
//             currenFilter={visibilityFilter}
//           >
//             Active
//           </FilterLink>
//           { ' ' }
//           <FilterLink
//             filter='SHOW_COMPLETED'
//             currenFilter={visibilityFilter}
//           >
//             Completed
//           </FilterLink>
//         </p>
//       </div>
//     );
//   }
// }
//
// const FilterLink = ({
//   filter,
//   currenFilter,
//   children
// }) => {
//   if (filter === currenFilter) {
//     return <span>{ children }</span>
//   }
//   return (
//     <a href="#"
//       onClick = {e => {
//         e.preventDefault();
//         store.dispatch({
//           type: 'SET_VISIBILITY_FILTER',
//           filter
//         });
//       }}>{ children }</a>
//   )
// }
// const render = () => {
//   ReactDom.render(
//     <TodoApp
//       {...store.getState()}
//     />,
//     document.getElementById('root')
//   );
// }
//
// store.subscribe(render);
// render();

//PART 5.4
// console.log('Initial state:');
// console.log(store.getState());
// console.log('-----------');
// console.log('Dispatching ADD_TODO.');
// store.dispatch({
//   type: 'ADD_TODO',
//   id: 0,
//   text: 'Learn Redux'
// })
// console.log('Current state:');
// console.log(store.getState());
// console.log('-----------');
// console.log('Dispatching ADD_TODO.');
// store.dispatch({
//   type: 'ADD_TODO',
//   id: 1,
//   text: 'Terminar Pubj'
// })
// console.log('Current state:');
// console.log(store.getState());
// console.log('-----------');
// console.log('Dispatching TOGGLE_TODO');
// store.dispatch({
//   type: 'TOGGLE_TODO',
//   id: 0
// });
// console.log('Current state:');
// console.log(store.getState());
// console.log('-----------');
//
// console.log('Dispatching SET_VISIBILITY_FILTER');
// store.dispatch({
//   type: 'SET_VISIBILITY_FILTER',
//   filter: 'SHOW_COMPLETED'
// })
// console.log('Current state:');
// console.log(store.getState());
// console.log('-----------');
// console.log('Dispatching SET_VISIBILITY_FILTER');
// store.dispatch({
//   type: 'SET_VISIBILITY_FILTER',
//   filter: 'PERRO'
// })
// console.log('Current state:');
// console.log(store.getState());
// console.log('-----------');


//PART 5.1
// const testAddTodo = () => {
//   const stateBefore = [];
//   const action = {
//     type: 'ADD_TODO',
//     id: 0,
//     text: 'Learn Redux'
//   }
//
//   const stateAfter = [
//     {
//       id: 0,
//       text: 'Learn Redux',
//       completed: false
//     }
//   ];
//
//   deepFreeze(stateBefore);
//   deepFreeze(action);
//
//   expect(
//     todos(stateBefore, action)
//   ).toEqual(stateAfter);
// };
//
// const testToggleTodo = () => {
//   const stateBefore = [
//       {
//         id: 0,
//         text: 'Learn Redux',
//         completed: false
//       },
//       {
//         id: 1,
//         text: 'Terminar el curso',
//         completed: false
//       }
//   ];
//   const action = {
//     type: 'TOGGLE_TODO',
//     id: 1
//   };
//   const stateAfter = [
//       {
//         id: 0,
//         text: 'Learn Redux',
//         completed: false
//       },
//       {
//         id: 1,
//         text: 'Terminar el curso',
//         completed: true
//       }
//   ];
//
//   deepFreeze(stateBefore);
//   expect(
//     todos(stateBefore, action)
//   ).toEqual(stateAfter)
// };
//
// testAddTodo();
// testToggleTodo();
// console.log('All test passed.');

// PART 5
// const toggleTodo = (todo) => {
//   //
//   // return Object.assign({}, todo, {
//   //   complete: !todo.complete
//   // })
//   return {
//     ...todo,
//     complete: !todo.completed
//   };
// };
//
// const testToggleTodo = () => {
//   const todoBefore = {
//     id: 0,
//     text: 'Learn Redux',
//     complete: false
//   }
//
//   const todoAfter = {
//     id: 0,
//     text: 'Learn Redux',
//     complete: true
//   }
//
//   deepFreeze(todoBefore);
//
//   expect(
//     toggleTodo(todoBefore)
//   ).toEqual(todoAfter);
//
// }
//
// testToggleTodo()
// console.log('All Test Passed');
// PART 4
// const addCounter = list => {
//   return [...list, 0];
//
// };
//
// const removeCounter = (list, index) => {
//   return [
//     ...list.slice(0,index),
//     ...list.slice(index + 1)
//   ]
// }
//
// const incrementCounter = (list, index) => {
//   return [
//     ...list.slice(0, index),
//     list[index] + 1,
//     ...list.slice(index + 1)
//   ];
// }
//
// const testAddCounter = () =>{
//   const listBefore = [];
//   const listAfter = [0];
//
//   deepFreeze(listBefore);
//
//   expect(
//     addCounter(listBefore)
//   ).toEqual(listAfter);
// };
//
// const testRemoveCounter = () => {
//   const listBefore = [0, 10, 20];
//   const listAfter = [0, 20];
//
//   deepFreeze(listBefore);
//   expect(
//     removeCounter(listBefore, 1)
//   ).toEqual(listAfter);
// }
//
// const testIncrementCounter = () => {
//   const listBefore = [0, 10, 20];
//   const listAfter = [0, 11, 20];
//
//   deepFreeze(listBefore);
//
//   expect(
//     incrementCounter(listBefore, 1)
//   ).toEqual(listAfter);
// };
//
// testAddCounter();
// testRemoveCounter();
// testIncrementCounter();
// console.log('All Test Passed');
// PART 3
// const counter = (state = 0, action) => {
//   switch (action.type) {
//     case 'INCREMENT':
//       return state + 1;
//     case 'DECREMENT':
//       return state - 1;
//     default:
//       return state;
//   }
// }
// const Counter = ({
//   value,
//   onIncrement,
//   onDecrement
// }) => (
//   <div>
//     <h1> {value} </h1>
//     <button onClick={onIncrement}>+</button>
//     <button onClick={onDecrement}>-</button>
//   </div>
// )

//PART 2
// const store = createStore(counter)
//
// const render = () => {
//   ReactDom.render(
//     <Counter
//       value={store.getState()}
//       onIncrement={() =>
//         store.dispatch({
//           type: 'INCREMENT'
//         })
//       }
//       onDecrement={() =>
//         store.dispatch({
//           type: 'DECREMENT'
//         })
//       }
//     />,
//     document.getElementById('root')
//   );
// };
//
// store.subscribe(render);
// render();


// import React from 'react';
// import { render } from 'react-dom';
// import { Provider } from 'react-redux';
// import App from './components/App';
// import configureStore from './store/configureStore';
//
// const store = configureStore()
//
// render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('root')
// )

