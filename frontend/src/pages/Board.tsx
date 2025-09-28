import trashIcon from '../assets/trash.png'
import editIcon from '../assets/edit.png'
import React, { useState } from 'react'
import { closestCenter, 
         DragOverlay, 
         DndContext, 
         useDroppable, 
         type DragEndEvent,
         type DragStartEvent
  } from '@dnd-kit/core'


import {
    SortableContext,
    useSortable,
    arrayMove,
    verticalListSortingStrategy
} from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'

type task = {
    id: number,
    title: string,
    position: number,
    created_at: string,
    description: string
}

type column = {
    id: number,
    title: string,
    position: number,
    tasks: task[]
}

type board = {
    id: number,
    title: string,
    description: string,
    columns: column[]
}



const Task = ({taskData}: {taskData: task}) => {
    const {attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: `task-${taskData.id}`,
    });
    
    const style = {
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition: transition ?? undefined
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="rounded-xl flex flex-row min-h-4 h-fit w-full border-2 border-r-2 border-gray-300 justify-between" >
            <div className='flex flex-col p-2 ml-2 w-90'>
                <div className='p-1'>
                    <h3 className='font-sansation font-bold text-2xl text-left text-blue-500'>{taskData.title}</h3>
                    <h5 className='font-epunda-slab font-bold text-xs text-left text-blue-500'>Id: {taskData.id} - {taskData.created_at}</h5>
                    <hr className='w-full h-0.5 bg-blue-500' />
                </div>
                <p className='font-montserrat text-xs text-blue-500 text-left'>{taskData.description}</p>
            </div>
            <div className='flex flex-row w-fit p-2 items-center'>
                <img className='w-10 h-10' src={editIcon} alt="" />
                <img className='w-10 h-10' src={trashIcon} alt="" />
            </div>
        </div>
        
    );
}

const Column = ({columnData}: {columnData: column}) => {
    const {setNodeRef} = useDroppable({
        id: `column-${columnData.id}`
    })

    return (
        <div ref={setNodeRef} className='min-h-80 bg-gray-200 p-2 w-70'>
            <h2 className='text-blue-500 text-left text-3xl'>{columnData.title}</h2>
            <hr className='w-full bg-blue-500 h-0.5'/>
            <SortableContext items={columnData.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                {columnData.tasks.map(task => (
                    <Task key={`task-${task.id}`} taskData={task}/>
                ))}
            </SortableContext>
            {columnData.tasks.length === 0 && (
                <div className="h-10 w-full scale-105 shadow-xl opacity-90">Drop Here</div>)}
        </div>
    );
}


const Board = ({boardData, setBoard, setIsBoard}: {boardData: board, setBoard:React.Dispatch<React.SetStateAction<board>>, setIsBoard:React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [activeTask, setActiveTask] = useState<task | null>(null)
    function parseId(id: string){
        const [type, num] = id.split("-");
        return{type, id:Number(num)};
    }
    function handleDragStart(event: DragStartEvent){
        const {id: activeNum} = parseId(String(event.active.id))
        const found = boardData.columns.flatMap(column => column.tasks).find(task => task.id == activeNum);
        setActiveTask(found ?? null);
    }

    function handleDragEnd(event: DragEndEvent) {
        // --
        const {active, over} = event; // - This get what is going on now, the task and where did it get dropped
        setActiveTask(null);
        if (!over) return;


        const {id: activeNum} = parseId(String(active.id))
        const {id:overNum} = parseId(String(over.id))


        if (active.id === over.id) return;

        let sourceColumn: column | null = null;
        let targetColumn: column | null = null;

        //   1️⃣ Find source and target columns
        for (const column of boardData.columns){
            if (column.tasks.some(task => task.id === activeNum)) sourceColumn = column;
            
            if (column.id === overNum) targetColumn = column
            else if (column.tasks.some(task => task.id === overNum)) targetColumn = column;
        }

        if (!sourceColumn || !targetColumn) return;

        if (sourceColumn.id === targetColumn.id){
            const oldIndex = sourceColumn.tasks.findIndex(task => task.id === activeNum);
            const newIndex = targetColumn.tasks.findIndex(task => task.id === overNum);

            const newTasks = arrayMove(sourceColumn.tasks, oldIndex, newIndex);

            setBoard(prev => ({
                ...prev,
                columns: prev.columns.map(column =>
                    column.id === sourceColumn.id ? {...column, tasks: newTasks} : column
                ),
            }));
        }

        else {
            const oldIndex = sourceColumn.tasks.findIndex(task => task.id === activeNum);
            let newIndex: number;

            if (targetColumn.tasks.some(task => task.id === overNum)){
                newIndex = targetColumn.tasks.findIndex(task => task.id === overNum);
            }
            else{
                newIndex = targetColumn.tasks.length;
            }
            const movedTask = sourceColumn.tasks[oldIndex];

            const newSourceTasks = [...sourceColumn.tasks];
            newSourceTasks.splice(oldIndex, 1);

            const newTargetTasks = [...targetColumn.tasks];
            newTargetTasks.splice(newIndex, 0, movedTask);

            setBoard(prev => ({
                ...prev,
                columns: prev.columns.map(column => {
                    if (column.id === sourceColumn.id) return {...column, tasks: newSourceTasks};
                    if (column.id === targetColumn.id) return {...column, tasks: newTargetTasks};
                    return column;
                }),
            }))
        }
}

    
    return (
        <div className="rounded-xl flex flex-row min-h-4 h-fit w-full border-2 border-r-2 border-gray-300 justify-center items-center">
            <div className="p-15 rounded-xl flex flex-row items-center justify-center align-middle h-fit w-fit gap-5 border-2 bg-blue-100">
                <DndContext 
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                    onDragCancel={() => setActiveTask(null)}>
                    {boardData.columns.map(column => (
                        <Column key={column.id} columnData={column}/>
                    ))}
                    <DragOverlay>
                        {activeTask ? <Task taskData={activeTask}/> : null}
                    </DragOverlay>
                </DndContext>
            </div>
            <button className='fixed bottom-4 right-6' onClick={() => setIsBoard}>Create a new Task</button>
        </div>
    );
}

const AddPage = () => {
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [type, setType] = useState<"toDo" | "inProgress" | "inReview" | "done">("toDo")
    return (
        <div className="flex flex-col w-full min-h-screen justify-center items-center"> {/* The Page */} 
            <div className="p-15 rounded-xl flex flex-col items-center justify-center align-middle h-fit w-xl border-2 bg-blue-100 gap-2"> {/* The box in the middle */}

                <div className="p-2 w-full flex flex-col gap-1"> {/* Header */}
                    <h6 className="font-light text-gray-600 text-left">Hello grinder</h6>
                    <h3 className="text-2xl font-medium text-gray-600 text-left">WNew Board incoming !</h3>
                </div> 

                <div className="flex flex-col w-full gap-2"> {/* Login information */}
                    <div className="flex flex-col p-4">
                        <div className="flex flex-col w-full h-fit gap-2">
                            <input className="text-gray-900 w-full h-10 border-1 border-gray-600 pl-2" type="text" value={title} onChange={event => setTitle(event.target.value)} placeholder="Title" />
                            <input className="text-gray-900 w-full h-10 border-1 border-gray-600 pl-2" type="text" value={description} onChange={event => setDescription(event.target.value)} placeholder="Description" />
                            <div>    
                                <input type="radio" name="type" id="todo" onClick={() => setType("toDo")} />
                                <label htmlFor="todo">ToDo</label>
                                <input type="radio" name='type' id='in-progress' onClick={() => setType("inProgress")}/>
                                <label htmlFor="in-progress">In Progress</label>
                                <input type="radio" name='type' id='in-review' onClick={() => setType("inReview")}/>
                                <label htmlFor="in-review">In Review</label>
                                <input type="radio" name='type' id='done' onClick={() => setType("done")}/>
                                <label htmlFor="done">Done</label>
                            </div>
                        </div>

                    </div>
                    <button className="mt-2 bg-blue-500 p-2 rounded-md" >Login</button>
                </div>
            </div>
            <button className="mt-2 bg-blue-500 p-2 rounded-md">Back</button>
        </div>
    );
}

const BoardPage = () => {
    const [isBoard, setIsBoard] = useState<boolean>(true);
    const [board, setBoard] = useState<board>({
    id: 1,
    title: "My Kanban",
    description: "",
    columns: [
        { id: 1, title: "Todo", position: 1, tasks: [{ id: 1, title: "Learn React", position: 1, created_at: "22-9-2010", description: "jdfhkdsjhfs" }, 
                                                     { id: 2, title: "Debug", position: 2, created_at: "22-9-2010", description: "jdfhkdsjhfs" }] },
        { id: 2, title: "Doing", position: 2, tasks: [{ id: 3, title: "Make UI", position: 1, created_at:"22-9-2010", description: ""}] },
        { id: 3, title: "Review", position: 3, tasks: [{ id: 4, title: "Make UI", position: 1, created_at:"22-9-2010", description: ""}] },
        { id: 4, title: "Done", position: 4, tasks: [{ id: 5, title: "Make UI", position: 1, created_at:"22-9-2010", description: ""},
                                                     { id: 6, title: "Make UI", position: 1, created_at:"22-9-2010", description: ""}
        ] },
    ],
    });
    return (
        <div>
            { isBoard ? (
                <Board boardData={board} setBoard={setBoard} setIsBoard={() => setIsBoard(false)}/>
            ) : (
                <AddPage/>
            )

            }
        </div>
        );
}

export default BoardPage;