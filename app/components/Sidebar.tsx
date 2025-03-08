import { Link, useLocation, useNavigate } from "@remix-run/react"
import { useState } from "react";
import { reportTabs, tabs } from "~/utils/constants"

const Sidebar = () => {
  const location = useLocation();
  const [active, setActive] = useState("Master Entry")
  const navigateTo = useNavigate()

  return (
    // <div className="sidebar flex flex-col items-center gap-1 w-[15rem] shadown-md h-screen overflow-y-auto">
    <div className={` flex flex-col px-5 w-[12rem] gap-2 pt-2 items-start text-white bg-gray-900 h-screen overflow-y-auto`}>
      {tabs?.map((item: any) => (
        <Link to={item?.path}>
          <span className={`${item.name === active ? `text-blue-700 font-bold`: ``}`} onClick={(e:any)=>{
            e.preventDefault()
            setActive(item.name)
            navigateTo(item.path)
          }}>{item?.name}</span>
        </Link>
      ))}
    {/* </div>
    <div className="flex flex-col px-5 w-[12rem] ml-2 gap-2 justify-center items-start bg-gray-900 text-white"> */}
      {/* {reportTabs?.map((item: any) => (
        <Link className="" to={item?.path}>
          <span>{item?.name}</span>
        </Link>
      ))} */}
    </div>
  // </div>
  )
}

export default Sidebar