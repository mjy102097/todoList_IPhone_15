/** @jsxImportSource @emotion/react */
import * as s from "./style";
import React, { useEffect, useState } from 'react';
import PageAnimationLayout from '../../components/PageAnimationLayout/PageAnimationLayout';
import MainContainer from '../../components/MainContainer/MainContainer';
import BackButtonTop from '../../components/BackButtonTop/BackButtonTop';
import PageTitle from '../../components/PageTitle/PageTitle';
import { MENUS } from '../../constants/menus';
import { useRecoilState } from 'recoil';
import { todolistAtom } from '../../atoms/todolistAtoms';
import TodoCalendar from '../../components/TodoCalendar/TodoCalendar';
import RegisterTodoButton from '../../components/RegisterTodoButton/RegisterTodoButton';
import { modifyTodoAtom, selectedCalendarTodoAtom } from "../../atoms/calendarAtoms";
import ConfirmButtonTop from "../../components/ConfirmButtonTop/ConfirmButtonTop";
import SubPageContainer from "../../components/SubPageContainer/SubPageContainer";

function TodoAll(props) {
    const [ todolistAll ] = useRecoilState(todolistAtom);
    const [ selectedTodo, setSelectedTodo ] = useRecoilState(selectedCalendarTodoAtom);
    const [ modifyTodo, setModifyTodo ] = useRecoilState(modifyTodoAtom);

    const [ calendarData, setCalendarData ] = useState({});
    const [ isShow, setShow ] = useState(true);
    const [ submitButtonDisabled, setSubmitButtonDisabled ] = useState(true);

    useEffect(() => {
        let preTodo = {
            ...(todolistAll.todolist.filter(todo => 
            todo.todoId === modifyTodo?.todoId)[0]),
        };
        
        preTodo = {
            ...preTodo, 
            todoDateTime: preTodo?.todoDateTime?.replaceAll(" ", "T")
        };
        
        const disabled = JSON.stringify(modifyTodo) === JSON.stringify(preTodo) || !modifyTodo?.title?.trim();
        setSubmitButtonDisabled(disabled);
    }, [modifyTodo]);

    useEffect(() => {
        const tempCalendarData = {};

        for(let todo of todolistAll.todolist) {
            const dateTime = todo.todoDateTime;
            const year = dateTime.slice(0, 4);
            const month = dateTime.slice(5, 7);
            const date = dateTime.slice(0, 10);

            if(!tempCalendarData[year]) {
                tempCalendarData[year] = {};
            }
            if(!tempCalendarData[year][month]) {
                tempCalendarData[year][month] = {};
            }
            if(!tempCalendarData[year][month][date]) {
                tempCalendarData[year][month][date] = [];
            }

            tempCalendarData[year][month][date].push(todo);
        }
    
        setCalendarData(tempCalendarData);

    }, [todolistAll]);

    const modifyCancel = () => {
        setSelectedTodo(0);
    } 

    const modifySubmit = () => {
        console.log(modifyTodo);
        setSelectedTodo(0);
    }


    return (
        <PageAnimationLayout isShow={isShow} setShow={setShow}>
            <SubPageContainer>
                <div css={s.layout}>
                    {
                        selectedTodo === 0 
                        ? <BackButtonTop setShow={setShow} />
                        : <ConfirmButtonTop onCancel={modifyCancel} onSubmit={modifySubmit} disabled={submitButtonDisabled} />
                    }
                    <PageTitle title={MENUS.all.title} color={MENUS.all.color} />
                    <TodoCalendar calendarData={calendarData} />
                    <RegisterTodoButton />
                </div>
            </SubPageContainer>
        </PageAnimationLayout>
    );
}

export default TodoAll;