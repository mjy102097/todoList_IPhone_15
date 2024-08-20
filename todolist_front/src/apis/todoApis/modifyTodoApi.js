import { instance } from "../utils/instance";

export async function changeCheckTodoStatus(todoId) {
    let response = null;
    try {
        response = await instance.put(`/todo/${todoId}/status`);
    } catch(e) {
        console.error(e);
        response = e.response;
    }
    return response;
}