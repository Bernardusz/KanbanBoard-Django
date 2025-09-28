import trashIcon from '../assets/trash.png'
import editIcon from '../assets/edit.png'

type props = {
    id: number,
    title: string,
    created_at: string,
    description: string
}


const BoardCard = ({id, title, created_at, description}: props) => {
    return (
        <div className="rounded-xl flex flex-row min-h-4 h-fit w-full border-2 border-r-2 border-gray-300 justify-between">
            <div className='flex flex-col p-2 ml-2 w-90'>
                <div className='p-1'>
                    <h3 className='font-sansation font-bold text-2xl text-left text-blue-500'>{title}</h3>
                    <h5 className='font-epunda-slab font-bold text-xs text-left text-blue-500'>Id: {id} - {created_at}</h5>
                    <hr className='w-full h-0.5 bg-blue-500' />
                </div>
                <p className='font-montserrat text-xs text-blue-500 text-left'>{description}</p>
            </div>
            <div className='flex flex-row w-fit p-2 items-center'>
                <img className='w-10 h-10' src={editIcon} alt="" />
                <img className='w-10 h-10' src={trashIcon} alt="" />
            </div>
        </div>
    );
}

const ListPage = () => {
    const myBoards: props[] = [
        {id : 1, title: "MyWorks", created_at: "22-8-2010", description: "My Kanban board for work"},
        {id : 2, title: "Bruh", created_at: "22-9-1020", description: "Just Bruhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"}
    ]
    return (
        <div className="flex flex-col w-full min-h-screen items-center mt-5">
            <div className="p-15 rounded-xl flex flex-col items-center justify-center align-middle h-fit w-xl border-2 bg-gray-100 gap-2">
                {myBoards.map(board => (
                    <BoardCard key={board.id} id={board.id} title={board.title} created_at={board.created_at} description={board.description}/>
                ))}
            </div>
            
        </div>
    );
}

export default ListPage;