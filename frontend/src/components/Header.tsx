

const Header = () => {
    return (
        <header className="flex justify-between border-2 border-blue-300 min-w-screen p-4 w-full">
            <h3 className="text-3xl text-blue-400 font-sansation font-bold">Kanban Board</h3>
            <button className="bg-blue-300 rounded-md p-2 border-2 border-white hover:bg-white hover:text-blue-700 hover:border-blue-400">Sign Out</button>
        </header>
    );
}

export default Header