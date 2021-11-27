export class OperationDocsHelper {
    static QUERY_GetAll = () => {
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
    }
    static MUTATION_InsertOne = (task, priority, deadline) => {
        return `
          mutation MyMutation {
            insert_train_todolist(objects: {deadline: "${deadline}", priority: ${priority}, task: "${task}"}) {
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
    }
}