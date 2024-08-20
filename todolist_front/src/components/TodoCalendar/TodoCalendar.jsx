/** @jsxImportSource @emotion/react */
import { useRecoilState, useSetRecoilState } from "recoil";
import * as s from "./style";
import { refreshTodolistAtom } from "../../atoms/todolistAtoms";
import { changeCheckTodoStatus } from "../../apis/todoApis/modifyTodoApi";
import { modifyTodoAtom, selectedCalendarTodoAtom } from "../../atoms/calendarAtoms";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import FullRedButton from "../FullRedButton/FullRedButton";
import { deleteTodoApi } from "../../apis/todoApis/deleteTodoApi";

function TodoBox({ todo }) {
    const importantOptions = [
        { label: "🟣 " + "중요함", value: 1, },
        { label: "⚪ " + "중요하지않음", value: 2, },
    ];

    const busyOptions = [
        { label: "🔴 " + "급함", value: 1, },
        { label: "⚪ " + "급하지않음", value: 2, },
    ];

    const [ selectedTodo, setSelectedTodo ] = useRecoilState(selectedCalendarTodoAtom);
    const setRefresh = useSetRecoilState(refreshTodolistAtom);
    const [ modifyTodo, setModifyTodo ] = useRecoilState(modifyTodoAtom);

    useEffect(() => {
        if(selectedTodo === todo.todoId) {
            setModifyTodo({
                ...todo,
                todoDateTime: todo.todoDateTime.replaceAll(" ", "T"),
            });
        }
    }, [selectedTodo]);

    const handleCheckBoxOnChange = async (e) => {
        await changeCheckTodoStatus(e.target.value);
        setRefresh(true);
    }

    const handleSelectTodoClick = (todoId) => {
        setSelectedTodo(todoId);
    }

    const handleModifyChange = (e) => {
        setModifyTodo(modifyTodo => ({
            ...modifyTodo,
            [e.target.name]: e.target.value
        }));
    }

    const handleImportantSelectOnChange = (option) => {
        setModifyTodo(modifyTodo => ({
            ...modifyTodo,
            important: option.value
        }));
    }

    const handleBusySelectOnChange = (option) => {
        setModifyTodo(modifyTodo => ({
            ...modifyTodo,
            busy: option.value
        }));
    }

    const handleDeleteClick = async (todoId) => {
        await deleteTodoApi(todoId);
        setRefresh(true);
        setSelectedTodo(0);
    }

    return <div css={s.todoBox}>
        <div css={s.todoTitleBox}>
            <div css={s.todoCheckBox}>
                <input type="checkbox" 
                    id={todo.todoId} 
                    checked={todo.status === 2}
                    onChange={handleCheckBoxOnChange}
                    value={todo.todoId} />
                <label htmlFor={todo.todoId}></label>
            </div>
            <div css={s.todoTitleAndTime}>
                {
                    selectedTodo === todo.todoId 
                    ? <input type="text" name="title" onChange={handleModifyChange} value={modifyTodo.title} autoFocus={true} />
                    : <h2 onClick={() => handleSelectTodoClick(todo.todoId)}>{todo.title}</h2>
                }
                <span>{todo.todoDateTime.slice(11)}</span>
            </div>
        </div>
        <div css={s.todoSubBox}>
            {
                selectedTodo === todo.todoId &&
                <>
                    <div css={s.contentBox}>
                        <h3>메모</h3>
                        <textarea name="content" onChange={handleModifyChange} value={modifyTodo.content}></textarea>
                    </div>
                    <div>
                        <ReactSelect
                            onChange={handleImportantSelectOnChange}
                            styles={{
                                control: (style) => ({
                                    ...style, 
                                    marginBottom: "5px",
                                    border: "none", 
                                    outline: "none", 
                                    boxShadow: "none",
                                    backgroundColor: "#f5f5f5",
                                    cursor: "pointer",
                                }),
                                menu: (style) => ({
                                    ...style,
                                    backgroundColor: "#f5f5f5",
                                }),
                                option: (style) => ({
                                    ...style,
                                    cursor: "pointer",
                                }),
                            }}
                            options={importantOptions}
                            value={importantOptions.filter(option => option.value === modifyTodo.important)[0]}                        
                        />

                        <ReactSelect
                            onChange={handleBusySelectOnChange}
                            styles={{
                                control: (style) => ({
                                    ...style, 
                                    marginBottom: "10px",
                                    border: "none", 
                                    outline: "none", 
                                    boxShadow: "none",
                                    backgroundColor: "#f5f5f5",
                                    cursor: "pointer",
                                }),
                                menu: (style) => ({
                                    ...style,
                                    backgroundColor: "#f5f5f5",
                                }),
                                option: (style) => ({
                                    ...style,
                                    cursor: "pointer",
                                }),
                            }}
                            options={busyOptions}
                            value={busyOptions.filter(option => option.value === modifyTodo.busy)[0]}
                        />
                        <div css={s.deleteButton}>
                            <FullRedButton onClick={() => handleDeleteClick(todo.todoId)}>삭제하기</FullRedButton>
                        </div>
                    </div>
                </>
            }
            
        </div>
    </div>
}

function TodoDateGroup({ date, todos }) {
    return <>
        <h2 css={s.dateTitle}>{date}</h2>
        <div>
            {
                todos.map(todo => <TodoBox key={todo.todoId} todo={todo} />)
            }
        </div>
    </>
}

function TodoMonthGroup({ month, dateOfCalendarData }) {
    const entriesOfDate = Object.entries(dateOfCalendarData);

    return <>
        <h2 css={s.monthTitle}>{month}월</h2>
        <div>
            {
                entriesOfDate.map(([date, todos]) => 
                <TodoDateGroup key={date} date={date} todos={todos} />)
            }
        </div>
    </>
}

function TodoYearGroup({ year, monthOfCalendarData }) {
    const entriesOfMonth = Object.entries(monthOfCalendarData);

    return <>
        <h2 css={s.yearTitle}>{year}년</h2>
        <div>
            {
                entriesOfMonth.map(([month, dateOfCalendarData]) => 
                <TodoMonthGroup key={year + month} month={month} dateOfCalendarData={dateOfCalendarData} />)
            }
        </div>
    </>
}

function TodoCalendar({ calendarData }) {
    const [ selectedTodo, setSelectedTodo ] = useRecoilState(selectedCalendarTodoAtom);
    const entriesOfCalendarData = Object.entries(calendarData);

    useEffect(() => {
        setSelectedTodo(0);
    }, []);

    return (
        <div css={s.layout}>
            {
                entriesOfCalendarData.map(([year, monthOfCalendarData]) => 
                <TodoYearGroup key={year} year={year} monthOfCalendarData={monthOfCalendarData} />)
            }
        </div>
    );
}

export default TodoCalendar;