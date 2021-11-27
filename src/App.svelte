<script>
    import http from './helper/request-helper';
    import {OperationDocsHelper} from "./helper/operation-docs-helper";
    import {ApolloClient, InMemoryCache} from '@apollo/client';
    import {setClient, subscribe} from "svelte-apollo";
    import {WebSocketLink} from "@apollo/client/link/ws";

    function createApolloClient() {
        const wsLink = new WebSocketLink({
            uri: "wss://web-laba3.herokuapp.com/v1/graphql",
            options: {
                reconnect: true,
            }
        })
        const cache = new InMemoryCache();
        const client = new ApolloClient({
            link: wsLink,
            cache
        })
        return client
    }

    const client = createApolloClient()
    setClient(client)
    const tasks = subscribe(OperationDocsHelper.SUBSCRIPTION_AllTodos)

    const convertToNumber = (string) => {
        return isNaN(+string) ? 0 : +string;
    }
    // TODO check data -> not less than now

    // TODO add delete

    // TODO add update

    // TODO add search (search by)

    const addTask = async () => {
        const name = prompt("Task name: ") ?? "";
        const priority = convertToNumber(prompt("Task priority: ") ?? "");
        const deadline = prompt("Deadline: ") ?? "";

        if(!name || !deadline) return
        await http.startExecuteMyMutation(OperationDocsHelper.MUTATION_InsertOne(name, priority, deadline));
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
        <table border="1">
            <caption>Tasks</caption>
            <tr>
                <th>Task</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Done</th>
            </tr>
            {#each $tasks.data.train_todolist as t (t.id)}
                <tr>
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