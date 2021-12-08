<script>
    import http from './helper/request-helper';
    import {OperationDocsHelper} from "./helper/operation-docs-helper";
    import {ApolloClient, InMemoryCache} from '@apollo/client';
    import {setClient, subscribe} from "svelte-apollo";
    import {WebSocketLink} from "@apollo/client/link/ws";

    function createApolloClient() {
        const wsLink = new WebSocketLink({
            uri: "wss://web-laba3-2.herokuapp.com/v1/graphql",
            options: {
                reconnect: true,
            }
        });
        const cache = new InMemoryCache();
        return new ApolloClient({
            link: wsLink,
            cache
        })
    }

    const client = createApolloClient()
    setClient(client)
    const tasks = subscribe(OperationDocsHelper.SUBSCRIPTION_AllTodos)

    const convertToNumber = (string) => {
        return isNaN(+string) ? 0 : +string;
    }

    // TODO add delete

    // TODO add update

    // TODO add search (search by)

    const addTask = async () => {
        const name = prompt("Task name: ") ?? "";
        const priority = convertToNumber(prompt("Task priority: ") ?? "");
        const deadline = prompt("Deadline: ") ?? "";

        if(!name || !deadline) {
            // TODO message about wrong deadline
            return
        }

        if(Date.parse(deadline) < Date.now()) return

        await http.startExecuteMyMutation(OperationDocsHelper.MUTATION_InsertOne(name, priority, deadline));
    }

    const deleteTasks = async () => {
        await http.startExecuteMyMutation(OperationDocsHelper.DELETE_DONE_TASKS());
    }

    const getDoneFromId = async (id) => {
        const {train_todolist} = await http.startFetchMyQuery(OperationDocsHelper.GET_UPDATE_AT(id));
        return train_todolist[0].done;
    }

    const markTask = async (id) => {
        let flag = await getDoneFromId(id)
        await http.startExecuteMyMutation(OperationDocsHelper.UPDATE_DONE(id, !flag))
        // TODO if was marked - then unmark, in the other case - mark
    }

    // TODO pagination offset, limit, etc...
</script>

<main>
    {#if $tasks.loading}
        <div class="centerize">
            <h1>Loading...</h1>
        </div>
    {:else if $tasks.error}
        <div>Error!</div>
    {:else if $tasks.data}
        <button on:click={addTask}>Add product</button>
        <button on:click={deleteTasks}>Delete Done</button>
        <table border="1">
            <caption>Tasks</caption>
            <tr>
                <th></th>
                <th>Task</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Done</th>
            </tr>
            {#each $tasks.data.train_todolist as t (t.id)}
                <tr>
                    <td>
<!--                        FIXME how to get current boolean DONE-->
                        <input type="checkbox" name="done" id="done" on:click={markTask(t.id)} />
                    </td>
                    <td>{t.task}</td>
                    <td>{t.priority}</td>
                    <td>{t.deadline}</td>
                    <td>{t.done}</td>
                </tr>
            {/each}
        </table>
<!--        TODO add ability to mark a task as done and add a sign (перекреслення)-->
    {/if}
</main>

<style>
    .centerize {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>