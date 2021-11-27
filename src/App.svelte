<script>
    import http from './helper/request-helper'
    import {OperationDocsHelper} from "./helper/operation-docs-helper";
    let tasks = []
    window.onload = async () => {
        const {train_todolist} = await http.startFetchMyQuery(OperationDocsHelper.QUERY_GetAll())
        tasks = train_todolist
        // TODO sort tasks by priority
        renderTable()
    }

    const renderTable = () => {
        const table = document.querySelector('table')
        table.innerHTML = `
            <caption>Tasks</caption>
            <tr>
                <th>Task</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Done</th>
            </tr>
        `;
        tasks.forEach(t => {
            table.innerHTML += `<tr>
                <td>${t.task}</td>
                <td>${t.priority}</td>
                <td>${t.deadline}</td>
                <td>${t.done}</td>
            </tr>`;
        })
    }

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

        const {insert_train_todolist} = await http.startExecuteMyMutation(OperationDocsHelper.MUTATION_InsertOne(name, priority, deadline));
        const {returning} = insert_train_todolist;
        tasks.push(returning[0]);
        renderTable();
        // FIXME sort tasks
    }

    // TODO pagination offset, limit, etc...
</script>

<main>
    <button on:click={addTask}>Add product</button>
    <table border="1">

    </table>
</main>

<style>
</style>