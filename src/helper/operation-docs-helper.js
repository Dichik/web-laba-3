import { gql } from '@apollo/client';

export class OperationDocsHelper {
    static QUERY_GetAll () {
        return `
          query MyQuery {
            train_todolist(order_by: {priority: desc}) {
              deadline
              done
              id
              priority
              task
            }
          }
        `;
    };
    static MUTATION_InsertOne (data) {
        return `
          mutation MyMutation {
            insert_train_todolist(objects: {deadline: "${data.deadline}", priority: ${data.priority}, task: "${data.task}"}) {
              returning {
                deadline
                done
                id
                priority
                task
              }
            }
          }
        `;
    };

    static SUBSCRIPTION_AllTodos = gql`
        subscription MySubscription {
            train_todolist(
                order_by: { priority: desc, deadline: asc, id: asc }
            ) {
                deadline
                done
                id
                priority
                task
            }
        }
    `;

    static UPDATE_DONE = (id, done) => {
        return `
          mutation MyMutation {
              update_train_todolist(where: {id: {_eq: "${id}"}}, _set: {done: "${done}"}) {
                returning {
                  deadline
                  done
                  id
                  priority
                  task
                }
              }
            }
        `;
    };

    static GET_UPDATE_AT = (id) => {
        return `
            query MyQuery {
              train_todolist(where: {id: {_eq: "${id}"}}) {
                done
              }
            }
        `;
    };

    static DELETE_DONE_TASKS = () => {
        return `
         mutation MyMutation {
          delete_train_todolist(where: {done: {_eq: true}}) {
            returning {
              deadline
              done
              id
              priority
              task
            }
          }
        }
        `;
    };
}
