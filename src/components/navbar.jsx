import Logo from "../assets/image/header.png"

export default function Navbar(){
    return(
        <div className="flex justify-center bg-red-500 text-white items-center gap-2 md:gap-5 p-3 md:p-0 ">
            
            <img className="w-11 md:w-20" src={Logo} alt="" />
            <h1 className="font-medium md:text-2xl md:font-bold text-lg">Bulk Mail</h1>
        </div>
    )
}