import Navbar from "./components/navbar"
import { useState } from "react";
import axios from "axios"
import * as XLSX from "xlsx"

export default function App() {
  const [fileName, setFileName] = useState("");
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [count, setCount] = useState("")
  const [emailList,setMailList] = useState([])
  const [status,setStatus] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
    // Create Reader obect
    const reader = new FileReader()
    reader.onload = (evt) => {
      const binaryData = evt.target.result;
      const workbook = XLSX.read(binaryData, { type: "binary" })
      const sheetName = workbook.SheetNames[0];
      const data = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(data, { header: "A" })
      const listMail = jsonData.map(function(item){return item.A})
      setCount(listMail.length)
      setMailList(listMail)
    }
    reader.readAsBinaryString(file)
  };

  const handleSubmit = () => {
    setStatus(true)
    axios.post("https://bulkmail-backend-production-1411.up.railway.app/sendmail", { subject: subject, content: content, emailList:emailList})
    .then(function(data){
      if(data.data === true){
        alert("Mail Send Successfully")
        setStatus(false)
      }else{
        alert("Falied to Send Mail")
        setStatus(false)
      }
    }).catch(function(err){console.log(err)})
  }

  const handleSubject = (evt) => {
    setSubject(evt.target.value)
  }
  const handleContent = (evt) => {
    setContent(evt.target.value)
  }

  return (
    <div>
      <Navbar />

      {/* Header Card */}
      <div className="border border-green-500 md:py-1 mx-5 md:mx-48 bg-green-100 p-1 mt-2 rounded-xl md:text-center">
        <h2 className="text-green-600 text-lg md:text-xl md:font-bold font-medium"> <i className="fa-solid fa-file"></i> Upload EXCEL File</h2>
        <p className="font-medium">Import your email list using EXCEL file</p>
      </div>

      {/* Upload Card */}
      <div className="mx-6  md:mx-48 mt-4 md:mt-3">
        <h2 className="font-medium md:font-bold md:text-lg pb-2 md:pb-1">Upload a file</h2>
        <label htmlFor="excel-upload" className="block border-2 border-dashed border-blue-400 p-6 md:p-2 rounded-lg text-center cursor-pointer hover:bg-blue-50 transition">
          <i className="text-blue-400 text-3xl md:text-4xl fa-solid fa-cloud-arrow-up"></i>
          <p className="text-blue-400 font-medium md:text-2xl ">Click to upload</p>
          {
            fileName &&
            <div>
              <p className="text-green-500 font-medium md:text-lg">{fileName}</p>
              <p className="text-sky-500 text-xs md:text-sm  mt-2 font-medium">Total Count of Email: {count}</p>
            </div>
          }
        </label>
        <input id="excel-upload" type="file" onChange={handleFileChange} className="hidden" />
      </div>

      {/* Mail Content */}
      <div className="mx-6  md:mx-48 mt-4 md:mt-2">
        <h1 className="font-medium md:font-bold md:text-lg">Mail Conetent</h1>
        <p className="text-gray-500 font-medium mt-2 md:mt-1">Subject </p>
        <input onChange={handleSubject} className="w-[100%] border-[2px] border-gray-400 rounded-lg" type="text" />
        <p className="font-medium text-gray-500 mt-2">Content</p>
        <textarea onChange={handleContent} className="border-[2px] border-gray-400 w-[100%] rounded-lg"></textarea>
        <div className="flex justify-center items-center mt-4">
          <button onClick={handleSubmit} className="bg-red-500 text-white rounded-lg px-8 py-2 font-medium">{status?(<> Sending <i className='fa-solid fa-spinner fa-spin-pulse'></i></>):("Send")}</button>
        </div>
      </div>
    </div>
  )
}