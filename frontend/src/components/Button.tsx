

export const Button = ({onClick, children} : {onClick : () => void, children : React.ReactNode}) => {
    return(
    <button onClick ={onClick} className="p-8 mt-4 px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600">
                        {children}
     </button>
    );
}